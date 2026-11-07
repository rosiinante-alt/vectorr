"""Vectroy concepts — locked builds A · B · C.

Grid: slope 1:4.5 · V top 56 · foot 214 (+1 overshoot) · 256 square canvas.
Wordmark: Inter Display SemiBold cap 104. Symbol and wordmark share the cap band.

A  Trace Edge   left arm's outer edge is a pixel staircase cut into the arm, right
                arm one true cut, square foot flush to the outer edge
B  Cut V        clean V, foot cut to a true point; the wordmark's V matches
C  Stencil V    the V as a stencil: the left arm is a solid edge with a slit cut
                through it (a cut path), right arm solid; foot to a point
"""
import rebuild as R

INK = "#000000"
HW, TOP, VERT, T = 60.0, 56.0, 214.0, 22.0
TIP = VERT + 1.0


def cap_paths(paths, k=1.35):
    pts = [p for part in paths for p in part]
    xs, ys = [p[0] for p in pts], [p[1] for p in pts]
    h = max(ys) - min(ys)
    k = (R.CAP + 6.0) / h                 # symbol reads a touch above cap, as a mark should
    baseline = R.C + R.CAP / 2 + 3.0
    sw = (max(xs) - min(xs)) * k
    total = sw + R.GAP + R.word_advance()
    left = (R.LW - total) / 2
    top_target = baseline - R.CAP - 3.0
    out = []
    for part in paths:
        out.append([(left + (x - min(xs)) * k, top_target + (y - min(ys)) * k) for x, y in part])
    return out, left + sw + R.GAP, baseline


def symbol_svg(paths):
    pts = [q for part in paths for q in part]
    cy = (min(q[1] for q in pts) + max(q[1] for q in pts)) / 2
    ox, oy = R.C, R.C - cy + 2.0
    d = " ".join(R.poly([(x + ox, y + oy) for x, y in part]) for part in paths)
    return R.svg(R.S, R.S, f'<path id="symbol" d="{d}" fill="{INK}" fill-rule="evenodd"/>')


def lockup_svg(paths, word_fn=None):
    parts, wx, baseline = cap_paths(paths)
    d = " ".join(R.poly(p) for p in parts)
    body = f'<g id="symbol"><path d="{d}" fill="{INK}" fill-rule="evenodd"/></g>'
    body += f'<path id="wordmark" d="{(word_fn or R.wordmark)(wx, baseline)}" fill="{INK}"/>'
    return R.svg(R.LW, R.LOCKUP_H, body)


def v_base(t_h=T):
    inner = HW - t_h
    return inner, VERT - inner / R.SLOPE


# ---------------------------------------------------------------- A
def a_v():
    """Right arm one true cut down to a pointed foot; the left arm's outer edge is a
    pixel staircase walking out from the top to the widest point at the foot."""
    inner, inner_vert = v_base()
    n = max(2, int(round((inner_vert - TOP) / 36.0)))
    dy = (inner_vert - TOP) / n
    dx = (HW - inner) / n
    step_ys = [inner_vert - i * dy for i in range(n)]          # notch → top
    step_xs = [-(inner + i * dx) for i in range(n)]            # notch → widest
    pts = [(HW, TOP), (HW, VERT - HW / R.SLOPE), (0.0, TIP), (step_xs[-1], VERT)]
    for i in reversed(range(n)):
        pts.append((step_xs[i], step_ys[i]))                   # in along the tread
        if i:
            pts.append((step_xs[i - 1], step_ys[i]))           # up the riser
    pts.append((inner, TOP))
    return pts


# ---------------------------------------------------------------- B
def b_v(t_h=T):
    """Chevron V with a pointed foot. Outer edge right and left, inner edges meeting at
    the foot, square horizontal cut at the tops — no horns, no parallelogram."""
    inner = HW - t_h
    inner_vert = VERT - inner / R.SLOPE
    return [
        (HW, TOP),                      # top right
        (HW, VERT - HW / R.SLOPE),      # outer right, down to the foot line
        (0.0, TIP),                     # pointed foot
        (-HW, VERT),                    # outer left, foot line
        (-HW, TOP),                     # top left
        (-inner, TOP),                  # inner left, top
        (-inner, inner_vert),           # inner left, notch
        (0.0, TIP - t_h * 1.35),        # inner apex
        (inner, inner_vert),            # inner right, notch
        (inner, TOP),                   # inner right, top
    ]


# ---------------------------------------------------------------- C stencil
def edge_x(y, side=-1):
    """x of the arm's outer edge at height y (side=-1 left arm, +1 right arm)."""
    return side * (HW - y / R.SLOPE) if side > 0 else -(HW - y / R.SLOPE)


def c_paths(slit=8.0, gap=20.0, frac=0.78):
    """Stencil V: one slit runs parallel to the left arm, holding the outer edge apart
    from the rest of the arm and stopping short of the foot, so the mark stays whole."""
    outer = b_v()
    y0 = TOP + 6.0
    y1 = y0 + (VERT - TOP) * frac
    run = (y1 - y0) / R.SLOPE
    o0, o1 = -(HW - y0 / R.SLOPE), -(HW - y1 / R.SLOPE)     # outer edge of the arm
    a, b = o0 + gap, o0 + gap + slit                        # slit band at y0
    c, d = o1 + gap, o1 + gap + slit                        # slit band at y1
    slit_pts = [(a, y0), (b, y0), (d, y1), (c, y1)]
    return [outer, slit_pts]


def main():
    for tag, paths in (("a", [a_v()]), ("b", [b_v()]), ("c", c_paths())):
        R.write(f"concept-{tag}-symbol.svg", symbol_svg(paths))
        R.write(f"concept-{tag}-lockup.svg", lockup_svg(paths))


if __name__ == "__main__":
    main()