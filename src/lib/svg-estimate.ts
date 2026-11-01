/**
 * Logged-out preview metrics.
 *
 * This is deliberately NOT an optimizer: it never rewrites the file and never
 * claims a result. It parses the uploaded SVG in the browser just far enough to
 * report the original size and a rough, clearly-labelled estimate, so a visitor
 * sees the shape of the savings report before signing in. The real optimization,
 * report and export all run server-side through the API.
 */

export interface SvgEstimate {
  originalBytes: number;
  nodes: number | null;
  paths: number | null;
  colors: number | null;
  /** Comment header, editor metadata and similar removable bulk, in bytes. */
  metadataBytes: number;
  /** Cheap, honest "these bytes are usually strippable" estimate, as a ratio. */
  estimatedSavingsRatio: number;
}

const MAX_PARSE_BYTES = 10 * 1024 * 1024;

/**
 * Counts drawing elements. `NodeList` from `querySelectorAll` is enough here
 * because we only need a count, and `getElementsByTagName` on a detached
 * document is the fastest path for a large file.
 */
function countTags(doc: Document, tag: string): number {
  return doc.getElementsByTagName(tag).length;
}

function collectColors(doc: Document): number | null {
  const colors = new Set<string>();
  const attrNames = ["fill", "stroke", "stop-color", "flood-color", "color"];

  for (const attr of attrNames) {
    const nodes = doc.querySelectorAll(`[${attr}]`);
    for (const node of nodes) {
      const value = node.getAttribute(attr)?.trim().toLowerCase();
      if (!value || value === "none" || value === "currentcolor") continue;
      // Normalise rgb()/hsl() spacing so duplicates collapse.
      colors.add(value.replace(/\s+/g, ""));
    }
  }

  // Style blocks and <style>-driven colours are not counted; the server does the
  // authoritative pass. Returning null rather than 0 keeps "unknown" honest.
  return colors.size > 0 ? colors.size : null;
}

function measureMetadata(source: string): number {
  let bytes = 0;
  const patterns = [
    /<!--[\s\S]*?-->/g, // comments, including editor headers
    /<\?xml[\s\S]*?\?>/g, // XML declaration
    /<!DOCTYPE[\s\S]*?>/gi, // doctype
    /<metadata[\s\S]*?<\/metadata>/gi, // Inkscape/Illustrator metadata
    /<sodipodi:namedview[\s\S]*?\/>/gi,
    /<foreignObject[\s\S]*?<\/foreignObject>/gi,
  ];

  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      bytes += new TextEncoder().encode(match[0]).length;
    }
  }
  return bytes;
}

/**
 * Estimates savings from measurable signals only: removable metadata plus the
 * bulk of very high coordinate precision, which is the single biggest source of
 * bloat in hand- and editor-exported SVG. The ratio is intentionally
 * conservative and always presented as an estimate.
 */
export function analyzeSvg(source: string, originalBytes: number): SvgEstimate {
  const empty: SvgEstimate = {
    originalBytes,
    nodes: null,
    paths: null,
    colors: null,
    metadataBytes: 0,
    estimatedSavingsRatio: 0,
  };

  if (originalBytes === 0 || originalBytes > MAX_PARSE_BYTES) return empty;

  const parser = new DOMParser();
  const doc = parser.parseFromString(source, "image/svg+xml");

  // DOMParser reports malformed XML as a parsererror document rather than throwing.
  if (doc.getElementsByTagName("parsererror").length > 0) return empty;
  if (doc.documentElement.tagName.toLowerCase() !== "svg") return empty;

  const nodes = countTags(doc, "path") + countTags(doc, "rect") + countTags(doc, "circle")
    + countTags(doc, "ellipse") + countTags(doc, "polygon") + countTags(doc, "polyline")
    + countTags(doc, "line") + countTags(doc, "text") + countTags(doc, "use");

  const metadataBytes = measureMetadata(source);

  // Excess decimal precision: count digits after the 2nd decimal place in path
  // data and point lists. Each surplus digit is roughly one byte on disk.
  let surplusDigits = 0;
  const numberRe = /-?\d+\.(\d+)/g;
  for (const match of source.matchAll(numberRe)) {
    const decimals = match[1]?.length ?? 0;
    if (decimals > 2) surplusDigits += decimals - 2;
  }

  const estimatedSavings = metadataBytes + Math.min(surplusDigits, originalBytes * 0.35);
  const ratio = Math.min(0.6, Math.max(0, estimatedSavings / originalBytes));

  return {
    originalBytes,
    nodes: nodes > 0 ? nodes : null,
    paths: countTags(doc, "path") || null,
    colors: collectColors(doc),
    metadataBytes,
    estimatedSavingsRatio: Math.round(ratio * 1000) / 1000,
  };
}

/** Reads a File as text, refusing anything that is not plausibly an SVG. */
export async function readSvgText(file: File): Promise<string> {
  const text = await file.text();
  if (!/<svg[\s>]/i.test(text.slice(0, 4096))) {
    throw new Error("That file does not contain an <svg> root element.");
  }
  return text;
}
