"""Shared construction helpers for the Vectroy logo concepts.

Type is outlined from the real Inter family (the site's typeface) so the wordmark is a
faithful starting point, never live <text>. Run with the venv that has fonttools:
  <tmp>/fontvenv/bin/python build.py
"""
from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.pens.boundsPen import BoundsPen

TMP = Path("/private/var/folders/12/019bz6gx5x7cswh601lb1rzw0000gn/T/opencode/inter/extras/ttf")

INK = "#000000"


class GlyphFont:
    def __init__(self, path):
        self.tt = TTFont(path)
        self.gs = self.tt.getGlyphSet()
        self.cmap = self.tt.getBestCmap()
        self.upm = self.tt["head"].unitsPerEm

    def advance(self, ch):
        return self.tt["hmtx"][self.cmap[ord(ch)]][0]

    def path(self, text, size, x=0.0, y=0.0, tracking=0.0):
        """Return (svg path d, advance width) for text with its baseline at y."""
        scale = size / self.upm
        d_parts = []
        pen_x = 0.0
        for i, ch in enumerate(text):
            name = self.cmap[ord(ch)]
            spen = SVGPathPen(self.gs)
            tpen = TransformPen(spen, (scale, 0, 0, -scale, x + pen_x * scale, y))
            self.gs[name].draw(tpen)
            d_parts.append(spen.getCommands())
            pen_x += self.advance(ch)
            if i < len(text) - 1:
                pen_x += tracking / scale
        d = " ".join(p for p in d_parts if p)
        return d, pen_x * scale

    def lsb(self, ch):
        return self.tt["hmtx"][self.cmap[ord(ch)]][1]

    def kern_width(self, text, size, tracking=0.0):
        scale = size / self.upm
        w = 0.0
        for ch in text:
            w += self.advance(ch)
        w += (len(text) - 1) * tracking / scale
        return w * scale


def svg(w, h, body, extra=""):
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:g} {h:g}" '
        f'width="{w:g}" height="{h:g}">{extra}{body}</svg>\n'
    )


def write(name, content):
    p = Path(__file__).parent / name
    p.write_text(content)
    print("wrote", p.name)