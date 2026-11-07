"""A — Trace Edge (chosen form). Left arm's outer edge is a pixel staircase cut into the
arm; the base is flush with the outer edge so the V keeps a solid, square foot. Right
arm is one true edge. Reads as: a raster trace that has been resolved into a V."""
import rebuild as R

INK = "#000000"
HW, TOP, VERT, T = 60.0, 56.0, 212.0, 20.0


def trace_edge(rise=36.0):
    inner = HW - T
    inner_vert = VERT - inner / R.SLOPE
    n = max(2, int(round((VERT - TOP) / rise)))
    dy = (VERT - TOP) / n
    dx = T / n
    pts = [(HW, TOP), (HW, VERT - HW / R.SLOPE), (0.0, VERT), (-inner, inner_vert), (-inner, TOP)]
    x, y = -inner, TOP
    walk = []
    for _ in range(n):
        y += dy
        walk.append((x, y))
        x -= dx
        walk.append((x, y))
    pts += walk[:-1] + [(-HW, VERT)]
    return pts