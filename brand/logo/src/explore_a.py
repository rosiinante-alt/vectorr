"""A v4 — Trace Edge.

The V keeps Vectroy's pointed foot. Its left arm's OUTER edge is a pixel staircase
(a traced raster edge), its right arm is one true straight cut. The vector result is
the same V built from the stairs: same top, same foot, same thickness.

Geometry: arm thickness measured horizontally 18 (31 %), staircase steps 22 tall /
~9 wide, staircase band exactly the arm so it reads as a chunky edge, not an extra bar.
"""
import rebuild as R

INK = "#000000"


def trace_edge(hw=60.0, top=56.0, vert=212.0, t_h=19.0, step=24.0):
    inner = hw - t_h                    # 41
    inner_vert = vert - inner / R.SLOPE
    dx = inner                          # left arm runs from -hw to -inner
    drop = vert - top
    n = max(3, int(round(drop / step)))
    dy = drop / n
    sx = dx / n
    pts = [
        (hw, top),
        (inner, top),
        (inner, inner_vert),
        (0.0, vert),
        (-inner, inner_vert),
        (-inner, top),
        (-inner, top),                  # top of the stair band
    ]
    x, y = -inner, top
    walk = []
    for i in range(n):
        y += dy
        walk.append((x, y))
        x -= sx
        walk.append((x, y))
    pts += walk[:-1] + [(-hw, vert)]
    return pts


if __name__ == "__main__":
    a = trace_edge()
    R.write("concept-a-symbol.svg", R.symbol_doc(a, "Vectroy symbol"))
    R.write("concept-a-lockup.svg", R.lockup(a))