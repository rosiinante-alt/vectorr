"""A — Trace Edge: final geometry.

Left arm: a band (thickness 20) that descends in pixel steps (rise 40 x run 5).
Right arm: one straight cut. Foot: a true point. Left bar edges are extended left to
the outer edge so the steps sit in the silhouette and the arm stays one mass.
"""
import rebuild as R

INK = "#000000"
HW, TOP, VERT, T_H = 60.0, 56.0, 212.0, 20.0


def bars(rise=40.0, extend=0.0):
    inner = HW - T_H
    n = max(2, int(round((VERT - TOP) / rise)))
    rise = (VERT - TOP) / n
    run = T_H / n
    out = []
    for k in range(n):
        y0 = TOP + k * rise
        x1 = -inner - k * run
        x0 = -HW - extend
        # each bar joins the bar above: drop the shared-edge seam by merging
        out.append([(x0, y0), (x1, y0), (x1, y0 + rise), (x0, y0 + rise)])
    return out


def right():
    inner = HW - T_H
    inner_vert = VERT - inner / R.SLOPE
    return [
        (0.0, VERT),
        (inner, inner_vert),
        (inner, TOP),
        (HW, TOP),
        (HW, VERT - HW / R.SLOPE),
    ]


def symbol_path(extend=0.0):
    b = bars(extend=extend)
    d = " ".join(R.poly(R.shift(bar, R.C, R.C)) for bar in b)
    d += " " + R.poly(R.shift(right(), R.C, R.C))
    return d


if __name__ == "__main__":
    for ext in (0.0, 10.0, 18.0):
        R.write(f"scratch-a-ext{int(ext)}.svg", R.svg(R.S, R.S, f'<path d="{symbol_path(ext)}" fill="{INK}"/>'))