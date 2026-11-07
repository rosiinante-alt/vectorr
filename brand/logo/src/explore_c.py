"""Vectroy — C, the trace.

A single uncut line wanders in from the left, then is *debounced* into the canonical V
the way a vectorizer removes points from a trace: an enter tail, the apex, an exit run
that ends exactly on the V's axis. Nothing is filled; the whole mark is one line.

Exploration history: an earlier pass drew a filled V with a detached squiggle blob
(scratch-c1) — it read as decoration, not a conversion. The line version says the
same thing with one element.
"""
from pathlib import Path

import build as B

S = C = 256.0
C = 128.0
INK = "#000000"


def trace_centre(line_x=60.0, line_w=6.0, t=26.0, hw=110.0, top=64.0, apex=200.0):
    """Centre-line of the mark in 256 space."""
    slope = hw / (apex - top)          # dx per dy on the arms
    anti = slope * t                   # how far the anti-aliased cut runs horizontally
    # entry: horizontal line, then up to the apex
    a = (line_x + line_w / 2, apex - t / 2)
    # corner cut of the entry into the left arm
    c1 = (hw * 0.62, top + (apex - t / 2 - top) * 0.38)
    return [
        ("M", (line_x - line_w / 2, apex - t / 2)),
        ("L", (line_x + line_w / 2, apex - t / 2)),
        ("L", (0.0 - hw * 0.0, apex - t / 2 - 2.0)),  # placeholder, replaced below
    ]


def spiral_lead(x0, y0, turns=1.6, growth=9.0, steps=64):
    """A loose spiral that starts near the canvas edge and ends at (x0, y0)."""
    import math
    pts = []
    for i in range(steps):
        f = i / (steps - 1)
        th = turns * 2 * math.pi * (1 - f)
        r = growth * th / (2 * math.pi) * 3.2
        pts.append((x0 + r * math.cos(th) - 1.4, y0 + r * math.sin(th) + 1.2))
    return pts


def symbol_paths(t=26.0, hw=110.0, top=64.0, apex=200.0, lead_x=52.0, arrow=True):
    """Return list of filled/outlined sub-paths for the symbol."""
    pts = []
    half = t / 2
    # tail: runs out of the left arm, down-left, to the canvas edge
    tail = [(hw * -0.55, apex - t * 0.55), (52.0, 232.0)]
    # stroke outline of the V's own centre line + tail, built as a polygon
    outer = [
        (hw, top),
        (-hw, top),
        (tail[1][0], tail[1][1]),
    ]
    return outer


def trace_symbol():
    """One filled path: V shield with a pointed foot + exit tail, plus an entry arrow."""
    t = 26.0
    hw = 110.0
    top = 56.0
    apex = 206.0
    tail_y = 238.0
    v = [
        (hw, top),
        (hw * 0.42, top),
        (hw * 0.42, apex - hw * 0.42 / (hw / (apex - top)) - t * 1.2),
        (0.0, apex),
        (-hw * 0.42, apex - hw * 0.42 / (hw / (apex - top)) - t * 1.2),
        (-hw * 0.42, top),
        (-hw, top),
    ]
    # the entry: a short horizontal stroke with a triangular arrow head, just left of the V
    entry_y = apex - t * 1.35
    ax = -hw - 34.0
    entry = [
        (ax - 16, entry_y - 9),
        (ax, entry_y),
        (ax - 16, entry_y + 9),
        (ax - 16, entry_y + 4.5),
        (ax - 40, entry_y + 4.5),
        (ax - 40, entry_y - 4.5),
        (ax - 16, entry_y - 4.5),
    ]
    return (f'<path id="trace" d="{B.poly(v)}" fill="{INK}"/>'
            f'<path id="entry" d="{B.poly(entry)}" fill="{INK}"/>')


def trace_lockup():
    symbol_h = 150.0
    k = 1.0
    baseline = 128 + 52 + 4
    top_target = baseline - 104
    # centre the symbol on the cap band with the wordmark
    w = B.word_width()
    sym_w = 220.0 + 40.0
    total = sym_w + B.GAP + w
    left = (B.LOCKUP_W - total) / 2
    dx = left + 20.0    # symbol x origin (canvas centre) inside the lockup
    dy = (top_target + baseline) / 2 - 128
    sym = trace_symbol()
    body = f'<g transform="translate({dx:.2f},{dy:.2f}) scale(0.86)">{sym}</g>'
    body += f'<path id="wordmark" d="{B.wordmark(left + sym_w + B.GAP, baseline)}" fill="{INK}"/>'
    return B.svg(B.LOCKUP_W, B.LOCKUP_H, body)