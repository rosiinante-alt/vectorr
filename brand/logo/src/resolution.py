"""Variant grid for A — Resolution, rendered as one sheet."""
import rebuild as R

INK = "#000000"


def resolution_v(hw, top, vert, bands, mode="bisect"):
    """Left arm split into vertical bands; each band is pixels of its own size.
    bands = [(width, pixel_ratio)] where pixel_ratio 0 = true straight edge."""
    total = sum(w for w, _ in bands)
    inner = hw - total
    inner_vert = vert - inner / R.SLOPE
    path = [(hw, top), (inner, top), (inner, inner_vert), (0.0, vert)]
    u = total                       # walk outward, u = distance from the inner edge
    for w, ratio in bands:
        if ratio <= 0.0:
            path.append((-(hw - total + u - total + 0.0), top))
            # outer edge x at the top is -hw
            path[-1] = (-hw, top)
            break
        n = max(2, int(round((vert - top) / (ratio * (vert - top)))))
        rise = (vert - top) / n
        dx = w / n
        x_start = -(inner + (total - u))       # left edge of this band
        x_out = x_start - w
        yy = vert
        xx = x_start
        # pixel outline of the band: vertical, then out, repeated upward
        for _ in range(n):
            yy -= rise
            path.append((xx, yy))
            xx -= dx
            path.append((xx, yy))
        u -= w
    return path


def sheet(variants):
    cells = []
    for tag, kw in variants:
        p = resolution_v(**kw)
        d = R.poly(R.shift(p, R.C, R.C))
        cells.append((tag, d))
    w = 256 * len(cells)
    body = ""
    for i, (tag, d) in enumerate(cells):
        body += f'<g transform="translate({i*256},0)"><path d="{d}" fill="{INK}"/></g>'
    R.write("scratch-a-variants.svg", R.svg(w, 256, body))
    return cells


VARIANTS = [
    ("v1", dict(hw=62, top=54, vert=214, bands=[(16, 0.42), (14, 0.2), (14, 0)])),
    ("v2", dict(hw=62, top=54, vert=214, bands=[(22, 0.5), (22, 0)])),
    ("v3", dict(hw=62, top=54, vert=214, bands=[(12, 0.33), (12, 0.16), (10, 0)])),
    ("v4", dict(hw=62, top=54, vert=214, bands=[(26, 0.4), (18, 0)])),
    ("v5", dict(hw=62, top=54, vert=214, bands=[(18, 0.55), (14, 0.25), (12, 0)])),
]

if __name__ == "__main__":
    sheet(VARIANTS)