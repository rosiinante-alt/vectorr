"""Vectroy — concept builds, third pass. Self-contained and consistent.

Grid (all concepts): slope 1 : 4.5, V top y=54, long edges meet at y=214 (foot point
overshoots), symbol canvas 0 0 256 256. Wordmark: Inter Display SemiBold, cap 104,
custom V that echoes the symbol.

A  True Trace   left arm outer edge = pixel steps cut INTO the arm; right arm = one edge
B  Cut V        clean V, foot cut to a true point; the wordmark's V matches
C  Cut Lines    left arm = three plotted lines with an open foot; right arm = one line
"""
import math

import rebuild as R

INK = "#000000"
HW, TOP, VERT = 60.0, 54.0, 214.0
T = 20.0            # left-arm block thickness
STEP = 32.0         # step height


# ---------------------------------------------------------------- A
def a_v():
    """Left arm: a stepped notch band; right arm: a single straight edge."""
    inner = HW - T
    inner_vert = VERT - inner / R.SLOPE
    n = max(2, int(round((VERT - TOP) / STEP)))
    dy = (VERT - TOP) / n
    dx = T / n
    pts = [
        (HW, TOP),                  # top-right
        (inner, TOP),               # inner right at top
        (inner, inner_vert),        # inner right notch
        (0.0, VERT),                # foot point
        (-inner, inner_vert),       # inner left notch
        (-inner, TOP),              # top of left arm, inner side
    ]
    # stair band, descending from the top-left outward to the outer edge at the foot line
    x, y = -inner, TOP
    walk = []
    for _ in range(n):
        y += dy
        walk.append((x, y))         # down
        x -= dx
        walk.append((x, y))         # out
    pts += walk[:-1]
    pts += [(-HW, VERT)]            # flush with the foot line
    return pts


# ---------------------------------------------------------------- B
def b_v():
    return R.v_cut(hw=HW, top=TOP, vert=VERT, tip=VERT + 1.0, t_h=T)


# ---------------------------------------------------------------- C
def band(p0, p1, w):
    dx, dy = p1[0] - p0[0], p1[1] - p0[1]
    L = math.hypot(dx, dy)
    nx, ny = -dy / L * w / 2, dx / L * w / 2
    return [(p0[0] + nx, p0[1] + ny), (p1[0] + nx, p1[1] + ny),
            (p1[0] - nx, p1[1] - ny), (p0[0] - nx, p0[1] - ny)]


def c_parts(t=15.0, gap=9.0, hw=HW, start=8.0):
    """Left arm: 3 parallel lines stacked along its normal. Right arm: one line."""
    ux, uy = -hw, -(VERT - TOP)
    L = math.hypot(ux, uy)
    ux, uy = ux / L, uy / L
    nx, ny = -uy, ux
    total = 3 * t + 2 * gap
    parts = []
    for i in range(3):
        off = total / 2 - t / 2 - i * (t + gap)
        a = (nx * off, VERT - start + ny * off)
        b = (-hw + nx * off, TOP + ny * off)
        parts.append(band(a, b, t))
    parts.append(band((0.0, VERT - start * 0.35), (hw, TOP), t))
    return parts


# ---------------------------------------------------------------- emit helpers
def sym_doc(paths):
    d = " ".join(R.poly(R.shift(p, R.C, R.C)) for p in paths)
    return R.svg(R.S, R.S, f'<path id="symbol" d="{d}" fill="{INK}"/>')


def lockup(paths, word_fn=None, cap_scale=1.55):
    pts = [p for part in paths for p in part]
    xs = [p[0] for p in pts]
    ys = [p[1] for p in pts]
    k = cap_scale
    baseline = R.C + R.CAP / 2 + 3.0
    w = R.word_advance()
    sw = (max(xs) - min(xs)) * k
    total = sw + R.GAP + w
    left = (R.LW - total) / 2
    sx = left - min(xs) * k
    sy = (baseline - R.CAP) - min(ys) * k
    d = " ".join(R.poly([(x * k + sx, y * k + sy) for x, y in part]) for part in paths)
    body = f'<g id="symbol"><path d="{d}" fill="{INK}"/></g>'
    body += f'<path id="wordmark" d="{(word_fn or R.wordmark)(left + sw + R.GAP, baseline)}" fill="{INK}"/>'
    return R.svg(R.LW, R.LOCKUP_H, body)


if __name__ == "__main__":
    R.write("concept-a-symbol.svg", sym_doc([a_v()]))
    R.write("concept-a-lockup.svg", lockup([a_v()]))
    R.write("concept-b-symbol.svg", sym_doc([b_v()]))
    R.write("concept-b-lockup.svg", lockup([b_v()]))
    R.write("concept-c-symbol.svg", sym_doc(c_parts()))
    R.write("concept-c-lockup.svg", lockup(c_parts()))