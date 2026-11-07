"""C — Lines: the V as a set of plotted strokes with a 1 px opening at the foot.

The left arm is three cut lines (a raster hatched into rows), the right arm one
continuous line; the vertex does not close — the trace simply ends, exactly as a
plotter or a cutter would leave it. Meaning: precision, paths, cut lines.
"""
import rebuild as R

INK = "#000000"
C = 128.0


def band_outline(p0, p1, w):
    """Rectangle-ish quad of width w along the segment p0->p1 (square ends)."""
    import math
    dx, dy = p1[0] - p0[0], p1[1] - p0[1]
    L = math.hypot(dx, dy)
    nx, ny = -dy / L * w / 2, dx / L * w / 2
    return [
        (p0[0] + nx, p0[1] + ny),
        (p1[0] + nx, p1[1] + ny),
        (p1[0] - nx, p1[1] - ny),
        (p0[0] - nx, p0[1] - ny),
    ]


def lines_v(hw=94.0, top=54.0, apex=216.0, t=26.0, gap=8.0):
    """Left arm: 3 lines separated by gaps; right arm: 1 line; an 8-unit opening at the
    foot between the last left line and the right line."""
    parts = []
    slope = hw / (apex - top)
    # right arm: one line from apex up to top-right
    parts.append(band_outline((0.0, apex), (hw, top), t))
    # left arm: three lines, each parallel to the arm, offset along the normal
    import math
    ux, uy = -hw, -(apex - top)
    L = math.hypot(ux, uy)
    ux, uy = ux / L, uy / L
    nx, ny = -uy, ux          # normal pointing right(+x)/up
    each = (t * 3 + gap * 2)
    for i in range(3):
        off = each - t / 2 - i * (t + gap)
        a = (0.0 + nx * off * -1, apex + ny * off * -1)
        b = (-hw + nx * off * -1, top + ny * off * -1)
        parts.append(band_outline(a, b, t))
    return parts


def main():
    parts = lines_v()
    d = " ".join(R.poly(R.shift(p, C, C)) for p in parts)
    body = f'<path id="symbol" d="{d}" fill="{INK}"/>'
    R.write("concept-c-symbol.svg", R.svg(R.S, R.S, body))
    # lockup: symbols need a bbox; use a flatten of all parts
    pts = [p for part in parts for p in part]
    inner = R.lockup(pts)
    R.write("concept-c-lockup.svg", inner)


if __name__ == "__main__":
    main()