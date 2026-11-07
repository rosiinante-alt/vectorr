"""Final concept builds for Vectroy — A (Trace Edge), B (Cut V), C (Cut Lines).

All three share one grid: slope 1:4.5, cap 56..212 with a pointed foot, and the
wordmark is Inter Display SemiBold with the V rebuilt on that same grid... except
where a concept changes the V (A and C do; B keeps Inter's own V and only sharpens
its foot).
"""
import math

import rebuild as R

INK = "#000000"
HW, TOP, VERT, T_H = 60.0, 56.0, 212.0, 20.0


# ------------------------------------------------------------------ A  Trace Edge

def a_bars(extend=16.0):
    inner = HW - T_H
    rise = 39.0
    n = max(2, int(round((VERT - TOP) / rise)))
    rise = (VERT - TOP) / n
    run = T_H / n
    bars = []
    for k in range(n):
        y0 = TOP + k * rise
        x1 = -inner - k * run
        x0 = -HW - extend
        bars.append([(x0, y0), (x1, y0), (x1, y0 + rise), (x0, y0 + rise)])
    return bars


def a_right():
    inner = HW - T_H
    inner_vert = VERT - inner / R.SLOPE
    return [(0.0, VERT), (inner, inner_vert), (inner, TOP), (HW, TOP), (HW, VERT - HW / R.SLOPE)]


def a_symbol_d():
    return (" ".join(R.poly(R.shift(b, R.C, R.C)) for b in a_bars())
            + " " + R.poly(R.shift(a_right(), R.C, R.C)))


def a_word_v(x, baseline, size=R.CAP, depth=9.0):
    """The wordmark's V: same silhouette as the symbol — stepped left edge, cut foot."""
    scale = size / R.DISP.upm
    # place the grid so the V spans cap height and sits in Inter's V slot
    from fontTools.pens.boundsPen import BoundsPen
    bp = BoundsPen(R.DISP.gs)
    R.DISP.gs[R.DISP.cmap[ord("V")]].draw(bp)
    xmin = x + bp.bounds[0] * scale
    xmax = x + bp.bounds[2] * scale
    hw = (xmax - xmin) / 2
    cx = (xmin + xmax) / 2
    top = baseline - R.CAP
    k = hw / HW
    th = T_H * k
    inner = hw - th
    vert = baseline - (VERT - TOP) * k + 0.0
    rise = 39.0 * k
    n = max(2, int(round((vert - top) / rise)))
    rise = (vert - top) / n
    run = th / n
    bars = []
    for i in range(n):
        y0 = top + i * rise
        x1 = cx - inner - i * run
        x0 = cx - hw - 16.0 * k
        bars.append([(x0, y0), (x1, y0), (x1, y0 + rise), (x0, y0 + rise)])
    right = [
        (cx, vert + depth),
        (cx + inner, vert - inner / R.SLOPE),
        (cx + inner, top),
        (cx + hw, top),
        (cx + hw, vert - hw / R.SLOPE),
    ]
    return " ".join(R.poly(b) for b in bars) + " " + R.poly(right)


def a_word(x, baseline, size=R.CAP):
    sub = f'{a_word_v(x, baseline, size)} {R.inter_rest(x + R.DISP.advance("V") * size / R.DISP.upm, baseline, size)}'
    return sub


# ------------------------------------------------------------------ B  Cut V

def b_symbol_d():
    return R.poly(R.shift(R.v_cut(), R.C, R.C))


# ------------------------------------------------------------------ C  Cut Lines

def c_parts():
    """Left arm as three cut lines (raster rows), right arm one line, open at the foot."""
    t = 15.0
    gap = 9.0
    hw = HW
    inner = hw - (t * 3 + gap * 2)
    inner_vert = VERT - inner / R.SLOPE
    out = []
    # left arm lines: three parallel bands stacked along the normal of the left arm
    ux, uy = -hw, -(VERT - TOP)
    L = math.hypot(ux, uy)
    ux, uy = ux / L, uy / L
    nx, ny = -uy, ux
    for i in range(3):
        off = (t * 3 + gap * 2) / 2 - t / 2 - i * (t + gap)
        a = (nx * off, VERT + ny * off)
        b = (-hw + nx * off, TOP + ny * off)
        out.append(band(a, b, t))
    # right arm: single line from the apex area to the top-right
    out.append(band((0.0, VERT - 6.0), (hw, TOP), t))
    return out


def band(p0, p1, w):
    dx, dy = p1[0] - p0[0], p1[1] - p0[1]
    L = math.hypot(dx, dy)
    nx, ny = -dy / L * w / 2, dx / L * w / 2
    return [
        (p0[0] + nx, p0[1] + ny),
        (p1[0] + nx, p1[1] + ny),
        (p1[0] - nx, p1[1] - ny),
        (p0[0] - nx, p0[1] - ny),
    ]


def c_symbol_d():
    return " ".join(R.poly(R.shift(p, R.C, R.C)) for p in c_parts())


# ------------------------------------------------------------------ lockups

def lockup_from_d(sym_d, title, word=None):
    """sym_d is in 256 canvas space; scale 1.6 and align the cap band to the wordmark."""
    from xml.etree import ElementTree as ET
    # compute bbox from the polygon coordinates in the path string
    nums = []
    toks = sym_d.replace("M", " ").replace("L", " ").replace("Z", " ").split()
    for i in range(0, len(toks) - 1, 2):
        nums.append((float(toks[i]), float(toks[i + 1])))
    xs = [p[0] for p in nums]
    ys = [p[1] for p in nums]
    k = 1.6
    cx = 128.0
    # top of the mark at cap 56 in canvas space -> map to the wordmark's cap line
    baseline = R.C + R.CAP / 2 + 3.0
    sy_top = TOP + R.C
    dy = (baseline - R.CAP) - (sy_top * 1.0)
    def tx(x, y):
        return (R.LW_MARGIN, 0)
    w = R.word_advance()
    sw = (max(xs) - min(xs)) * k
    total = sw + R.GAP + w
    left = (R.LW - total) / 2
    sx = left - min(xs) * k
    sy = (baseline - R.CAP) - R.TOP * k
    body = (f'<g id="symbol" transform="translate({sx:.2f},{sy:.2f}) scale({k})">'
            f'<path d="{sym_d}" fill="{INK}"/></g>')
    wx = left + sw + R.GAP
    body += f'<path id="wordmark" d="{(word or R.wordmark)(wx, baseline)}" fill="{INK}"/>'
    return R.svg(R.LW, R.LOCKUP_H, body, title)


if __name__ == "__main__":
    R.write("concept-a-symbol.svg", R.svg(R.S, R.S, f'<path id="symbol" d="{a_symbol_d()}" fill="{INK}"/>'))
    R.write("concept-a-lockup.svg", lockup_from_d(a_symbol_d(), "Vectroy", a_word))
    R.write("concept-b-symbol.svg", R.svg(R.S, R.S, f'<path id="symbol" d="{b_symbol_d()}" fill="{INK}"/>'))
    R.write("concept-b-lockup.svg", lockup_from_d(b_symbol_d(), "Vectroy"))
    R.write("concept-c-symbol.svg", R.svg(R.S, R.S, f'<path id="symbol" d="{c_symbol_d()}" fill="{INK}"/>'))
    R.write("concept-c-lockup.svg", lockup_from_d(c_symbol_d(), "Vectroy"))