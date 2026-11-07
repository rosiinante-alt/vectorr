"""Builds the Vectroy logo concepts (black first).

Canonical V (shared by symbol and wordmark)
------------------------------------------
Slope 1 : 4.5. Half-width 52, horizontal arm thickness 13.4 (Inter's own V
relationship), top y = 60, long edges meet at y = 192, pointed foot overshoots to 194.
The pointed foot is Vectroy's signature: the trace is cut to the point.

Symbol canvas 0 0 256 256. Lockup canvas 0 0 640 256; Inter Display SemiBold at cap 104.
"""
from pathlib import Path

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

from lib import TMP, GlyphFont, svg, write

DISP = GlyphFont(TMP / "InterDisplay-SemiBold.ttf")
OUT = Path(__file__).resolve().parent.parent

S = 256.0
C = 128.0
CAP = 104.0
GAP = 46.0
LOCKUP_W = 640.0
LOCKUP_H = 256.0
INK = "#000000"

TOP_Y = 60.0
VERT_Y = 192.0
TIP_Y = 194.5
HALF_W = 52.0
SLOPE = 4.5
T_H = 13.4
INNER_X = HALF_W - T_H

NAME = "Vectroy"


# ------------------------------------------------------------------ primitives

def spiral_trace(n=7, t=16.0, sweep=90.0, start=-135.0, corner=0.55, centre_band=None):
    """A single line that turns in a square spiral from the outside to a dead centre.

    Bands are drawn between consecutive radii na*n*t... each turn cuts a corner with a
    mitre of length `corner * t`; the cut corners form one clean diagonal per quarter."""
    cx = cy = C
    m = n + 1
    radii = [m * t - 2 * i * t for i in range(m)]   # outer edge of each band
    radii = [r for r in radii if r >= t]
    d = []
    for i, r in enumerate(radii):
        a0 = start + sweep * i
        for (ra, rb) in ((r, r - t),):
            pass
        # corner quad: outer arc point, mitred cut, inner point
        ao = math.radians(a0 - sweep / 2)
        po = (cx + r * math.cos(ao), cy + r * math.sin(ao))
        ai = math.radians(a0 + sweep / 2)
        pi = (cx + (r - t) * math.cos(ai), cy + (r - t) * math.sin(ai))
        if i == 0:
            d += [po, pi]
            continue
        d += [po, pi]
    return d


def poly(pts):
    return "M " + " L ".join(f"{x:.2f} {y:.2f}" for x, y in pts) + " Z"


def shift(pts, ox=0.0, oy=0.0):
    return [(ox + x, oy + y) for x, y in pts]


def v_outline(hw=HALF_W, t_h=T_H, top=TOP_Y, vert=VERT_Y, tip=TIP_Y, slope=SLOPE):
    """Filled V outline (clockwise)."""
    inner = hw - t_h
    inner_y = vert - inner / slope
    return [
        (hw, top),
        (inner, top),
        (inner, inner_y),
        (0.0, tip),
        (-inner, inner_y),
        (-inner, top),
        (-hw, top),
        (-hw, top + 2 * hw / slope),
    ]


def v_stairs(hw=HALF_W, top=TOP_Y, slope=SLOPE, t_h=T_H, step=21.0, vert=VERT_Y):
    """Left outer edge replaced by square pixel steps (a traced raster edge).
    Points are relative to the V's own origin (foot at y = vert), not the canvas."""
    inner = hw - t_h
    inner_y = vert - inner / slope
    pts = [
        (hw, top),
        (inner, top),
        (inner, inner_y),
        (0.0, vert),
        (-inner, inner_y),
        (-inner, top),
    ]
    run = hw
    drop = 2 * hw / slope
    n = max(3, int(round(drop / step)))
    dx, dy = run / n, drop / n
    x, y = -hw, top + drop
    walk = [(x, y)]
    for _ in range(n):
        y -= dy
        walk.append((x, y))
        x += dx
        walk.append((x, y))
    return pts + walk[:-1]


def ribbon(hw=52.0, top=44.0, vert=196.0, slope=3.6, t_h=15.0, apex=250.0):
    """M/wave ribbon: sharp top point, V cut, underside follows the same silhouette."""
    inner = hw - t_h
    inner_y = vert - inner / slope
    bottom_top = top + 2 * hw / slope
    b_inner = hw - t_h - 4.0
    b_inner_top = bottom_top + b_inner / slope
    b_inner_y = vert - b_inner / slope
    return [
        (hw, top),
        (inner, top),
        (inner, inner_y),
        (0.0, apex),
        (-inner, inner_y),
        (-inner, top),
        (-hw, top),
        (-hw, bottom_top),
        (-b_inner, b_inner_top),
        (-b_inner, b_inner_y),
        (0.0, apex - t_h * 1.15),
        (b_inner, b_inner_y),
        (b_inner, b_inner_top),
        (hw, bottom_top),
    ]


def open_trace(hw=52.0, top=60.0, slope=4.5, sw=22.0):
    """Single stroked trace: comes in from the right, strikes the apex, returns.
    Returns (points, stroke width scaled into 256 space)."""
    floor = top + 2 * hw / slope
    return [(0.0, floor), (hw, top), (-hw, top + 2 * hw / slope)], sw


# ------------------------------------------------------------------ wordmark

def inter_rest(x, baseline, size=CAP):
    scale = size / DISP.upm
    parts, pen = [], 0.0
    for ch in NAME:
        spen = SVGPathPen(DISP.gs)
        DISP.gs[DISP.cmap[ord(ch)]].draw(
            TransformPen(spen, (scale, 0, 0, -scale, x + pen * scale, baseline)))
        parts.append(spen.getCommands())
        pen += DISP.advance(ch)
    return " ".join(p for p in parts if p)


def word_width(size=CAP, tracking=0.0):
    w = sum(DISP.advance(ch) for ch in NAME) * size / DISP.upm
    return w + tracking * (len(NAME) - 1)


def v_word(x, baseline, size=CAP, depth=8.0, t_ratio=T_H / (HALF_W * 2)):
    """Inter's V slot, foot cut to a sharp point `depth` below the baseline."""
    scale = size / DISP.upm
    bp = BoundsPen(DISP.gs)
    DISP.gs[DISP.cmap[ord("V")]].draw(bp)
    xmin = x + bp.bounds[0] * scale
    xmax = x + bp.bounds[2] * scale
    top = baseline - CAP
    hw = (xmax - xmin) / 2
    cx = (xmin + xmax) / 2
    slope = (2 * hw) / (baseline - top)
    inner = hw * (1 - 2 * t_ratio)
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


def wordmark(x, baseline, size=CAP, custom_v=True, depth=8.0):
    if not custom_v:
        return inter_rest(x, baseline, size)
    scale = size / DISP.upm
    v_x = x
    rest_x = x + DISP.advance("V") * scale
    return f'{v_word(v_x, baseline, size, depth)} {inter_rest(rest_x, baseline, size)}'


# ------------------------------------------------------------------ lockups

def lockup(symbol_pts, sym_scale=1.6, custom_v=True, depth=8.0, stroked=None):
    k = sym_scale
    pts = [(x * k, y * k) for x, y in symbol_pts]
    pts = shift(pts, -C * k, -C * k)
    ys = [p[1] for p in pts]
    # scale so the symbol's cap band matches the wordmark's; keep the apex shared
    pts = shift(pts, 0.0, C)
    sx0, sx1 = min(p[0] for p in pts), max(p[0] for p in pts)
    sy0, sy1 = min(p[1] for p in pts), max(p[1] for p in pts)
    sym_h = sy1 - sy0
    baseline = C + CAP / 2 + depth / 3
    if baseline - CAP < sy0:
        pass
    top_target = baseline - CAP
    dy = top_target - sy0
    pts = shift(pts, 0.0, dy)
    sym_h = sy1 - sy0
    w = word_width()
    total = (sx1 - sx0) + GAP + w
    left = (LOCKUP_W - total) / 2
    dx = left - sx0
    wx = left + (sx1 - sx0) + GAP
    body = f'<path id="symbol" d="{poly(shift(pts, dx, 0))}" fill="{INK}"/>'
    body += f'<path id="wordmark" d="{wordmark(wx, baseline, custom_v=custom_v, depth=depth)}" fill="{INK}"/>'
    return svg(LOCKUP_W, LOCKUP_H, body)


def lockup_stroked(pts, sw, sym_scale=1.6, custom_v=True, depth=8.0):
    k = sym_scale
    sp = shift([(x * k, y * k) for x, y in pts], -C * k, -C * k)
    sp = shift(sp, 0.0, C)
    sy0 = min(p[1] for p in sp)
    baseline = C + CAP / 2 + depth / 3
    sp = shift(sp, 0.0, (baseline - CAP) - sy0)
    sx0, sx1 = min(p[0] for p in sp), max(p[0] for p in sp)
    w = word_width()
    total = (sx1 - sx0) + GAP + w
    left = (LOCKUP_W - total) / 2
    d = "M " + " L ".join(f"{x - sx0 + left:.2f} {y:.2f}" for x, y in sp)
    body = (f'<path id="symbol" d="{d}" fill="none" stroke="{INK}" stroke-width="{sw * k:.2f}" '
            f'stroke-linecap="butt" stroke-linejoin="miter"/>')
    wx = left + (sx1 - sx0) + GAP
    body += f'<path id="wordmark" d="{wordmark(wx, baseline, custom_v=custom_v, depth=depth)}" fill="{INK}"/>'
    return svg(LOCKUP_W, LOCKUP_H, body)


# ------------------------------------------------------------------ emit

def main():
    # A — True Trace: raster staircase on the left, vector edge on the right
    a = v_stairs()
    a_canvas = shift(a, C, C)
    write("concept-a-symbol.svg", svg(S, S, f'<path id="symbol" d="{poly(a_canvas)}" fill="{INK}"/>'))
    write("concept-a-lockup.svg", lockup(a))

    # B — Cut V: clean geometry, the foot cut to a point (also in the wordmark V)
    b = [(x, y + C) for x, y in v_outline()]
    write("concept-b-symbol.svg", svg(S, S, f'<path id="symbol" d="{poly(b)}" fill="{INK}"/>'))
    write("concept-b-lockup.svg", lockup([(x, y - C) for x, y in b]))

    # C — the trace: a single squiggle converts into the clean V
    from explore_c import trace_symbol, trace_lockup
    c = trace_symbol()
    write("concept-c-symbol.svg", svg(S, S, c))
    write("concept-c-lockup.svg", trace_lockup())

    print("word width", round(word_width(), 2))


if __name__ == "__main__":
    main()