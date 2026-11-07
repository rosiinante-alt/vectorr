"""Vectroy concept system — one geometric logic across A, B, C.

The V grid (used by symbol and by the wordmark's V alike):
  slope 1 : 4.5 · half-width 58 · arm thickness measured HORIZONTALLY = 17.3 (30 %)
  top y = 56 · long edges meet at y = 212 · pointed foot overshoots to 215
  The pointed foot, cut to a true point, is Vectroy's signature detail.

Symbol canvas 0 0 256 256 (cap band 56..212 is optically centred: margins 56 / 44).
Lockup canvas 0 0 640 256, Inter Display SemiBold, cap 104, gap 46, block centred.
"""
from pathlib import Path

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

from lib import TMP, GlyphFont, svg as _svg

DISP = GlyphFont(TMP / "InterDisplay-SemiBold.ttf")
OUT = Path(__file__).resolve().parent.parent

S = 256.0
C = 128.0
CAP = 104.0
GAP = 46.0
LW, LOCKUP_H = 640.0, 256.0
INK = "#000000"

TOP = 56.0
VERT = 212.0
TIP = 215.0
HW = 58.0
SLOPE = 4.5
T_H = 17.3
NAME = "Vectroy"
TRACK = 0.0


def write(name, content):
    (OUT / name).write_text(content)
    print("wrote", name)


def svg(w, h, body, title="Vectroy"):
    return _svg(w, h, body).replace("<svg ", f'<svg role="img" aria-label="{title}" ', 1)


def poly(pts):
    return "M " + " L ".join(f"{x:.2f} {y:.2f}" for x, y in pts) + " Z"


def shift(pts, ox=0.0, oy=0.0):
    return [(ox + x, oy + y) for x, y in pts]


# ------------------------------------------------------------------ V variants

def v_cut(hw=HW, top=TOP, vert=VERT, tip=TIP, t_h=T_H):
    """Canonical V with a pointed foot."""
    inner = hw - t_h
    inner_y = vert - inner / SLOPE
    return [
        (hw, top),
        (inner, top),
        (inner, inner_y),
        (0.0, tip),
        (-inner, inner_y),
        (-inner, top),
        (-hw, top),
        (-hw, top + 2 * hw / SLOPE),
    ]


def v_foot(hw=HW, top=TOP, vert=VERT, tip=TIP, t_h=T_H, foot=6.0):
    """Canonical V with a flat foot (the control against the cut)."""
    inner = hw - t_h
    inner_y = vert - inner / SLOPE
    return [
        (hw, top),
        (inner, top),
        (inner, inner_y),
        (foot / 2, vert),
        (-foot / 2, vert),
        (-inner, inner_y),
        (-inner, top),
        (-hw, top),
        (-hw, top + 2 * hw / SLOPE),
    ]


def v_step(hw=HW, top=TOP, vert=VERT, t_h=T_H, step=26.0, inset=4.0):
    """A: left outer edge is a pixel staircase, everything else a true vector line.
    The staircase sits INSIDE the arm and is shallower than the arm, so the V still
    reads as a V; the right arm is a single clean edge."""
    inner = hw - t_h
    inner_vert = vert - inner / SLOPE
    # the stair band: from -hw to -hw+inset+run, radius = full arm depth
    run = 0.0
    pts = [
        (hw, top),
        (inner, top),
        (inner, inner_vert),
        (0.0, vert),
        (-inner, inner_vert),
        (-inner, top),
        (-hw + t_h, top),          # top of the left arm, inner limit of the steps
    ]
    drop = vert - top
    n = max(3, int(round(drop / step)))
    dy = drop / n
    x, y = -hw + t_h, top
    walk = []
    for i in range(n):
        y += dy
        walk.append((x, y))        # vertical
        x -= t_h / n
        walk.append((x, y))        # horizontal
    return pts + walk[:-1] + [(-hw, vert), (-inner, inner_vert)]


def v_stripes(stripe=13.0, gap=8.0):
    """C-lines: the V's left arm drawn as three cut stripes, the right arm solid."""
    pass


# ------------------------------------------------------------------ wordmark

def inter_rest(x, baseline, size=CAP):
    scale = size / DISP.upm
    parts, pen = [], 0.0
    for ch in NAME:
        spen = SVGPathPen(DISP.gs)
        DISP.gs[DISP.cmap[ord(ch)]].draw(
            TransformPen(spen, (scale, 0, 0, -scale, x + pen * scale, baseline)))
        parts.append(spen.getCommands())
        pen += DISP.advance(ch) + TRACK / scale
    return " ".join(p for p in parts if p)


def word_advance(size=CAP):
    return sum(DISP.advance(ch) for ch in NAME) * size / DISP.upm + TRACK * (len(NAME) - 1)


def v_word(x, baseline, size=CAP, depth=8.0, custom=True):
    """The wordmark's V rebuilt on the same grid and cut to the same point."""
    scale = size / DISP.upm
    bp = BoundsPen(DISP.gs)
    DISP.gs[DISP.cmap[ord("V")]].draw(bp)
    if not custom:
        spen = SVGPathPen(DISP.gs)
        DISP.gs[DISP.cmap[ord("V")]].draw(
            TransformPen(spen, (scale, 0, 0, -scale, x, baseline)))
        return spen.getCommands()
    xmin = x + bp.bounds[0] * scale
    xmax = x + bp.bounds[2] * scale
    hw = (xmax - xmin) / 2
    cx = (xmin + xmax) / 2
    top = baseline - CAP
    slope = 2 * hw / (baseline - top)
    inner = hw * (1 - 2 * T_H / (2 * HW))
    inner_y = baseline - inner / slope
    pts = [
        (cx + hw, top),
        (cx + inner, top),
        (cx + inner, inner_y),
        (cx, baseline + depth),
        (cx - inner, inner_y),
        (cx - inner, top),
        (cx - hw, top),
        (cx - hw, top + 2 * hw / slope),
    ]
    return poly(pts)


def wordmark(x, baseline, size=CAP, depth=8.0, custom=True):
    scale = size / DISP.upm
    vx = v_word(x, baseline, size, depth, custom)
    rest_x = x + DISP.advance("V") * scale + TRACK
    return f'{vx} {inter_rest(rest_x, baseline, size)}'


# ------------------------------------------------------------------ lockup

def lockup(sym_pts, title="Vectroy", depth=8.0, custom=True):
    k = 1.6
    sp = shift([(x * k, y * k) for x, y in sym_pts], -C * k, -C * k)
    sy0 = min(p[1] for p in sp)
    baseline = C + CAP / 2 + depth / 3
    sp = shift(sp, 0.0, (baseline - CAP) - sy0)
    sx0, sx1 = min(p[0] for p in sp), max(p[0] for p in sp)
    w = word_advance()
    total = (sx1 - sx0) + GAP + w
    left = (LW - total) / 2
    sym = shift(sp, left - sx0, 0.0)
    body = f'<path id="symbol" d="{poly(sym)}" fill="{INK}"/>'
    body += f'<path id="wordmark" d="{wordmark(left + (sx1 - sx0) + GAP, baseline, depth=depth, custom=custom)}" fill="{INK}"/>'
    return svg(LW, LOCKUP_H, body, title)


def symbol_doc(pts, title):
    return svg(S, S, f'<path id="symbol" d="{poly(shift(pts, C, C))}" fill="{INK}"/>', title)


def main():
    a = v_step()
    b = v_cut()
    write("concept-a-symbol.svg", symbol_doc(a, "Vectroy symbol"))
    write("concept-a-lockup.svg", lockup(a))
    write("concept-b-symbol.svg", symbol_doc(b, "Vectroy symbol"))
    write("concept-b-lockup.svg", lockup(b))
    print("advance", round(word_advance(), 2))


if __name__ == "__main__":
    main()