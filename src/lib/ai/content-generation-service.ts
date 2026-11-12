/**
 * Content generation service.
 *
 * Generates marketing copy, Etsy listings, alt text, blog intros, and SVG
 * descriptions. This is a free operation (no credit deduction).
 *
 * When OPENAI_API_KEY is set, it uses the OpenAI Chat Completions API.
 * Otherwise it falls back to structured template-based generation so the
 * feature works without an external key.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ContentType =
  | 'etsy_listing'
  | 'alt_text'
  | 'blog_intro'
  | 'product_description'
  | 'svg_description';

export interface ContentOptions {
  type: ContentType;
  /** Primary subject — the SVG, product, or image being described. */
  subject: string;
  /** Optional brand or shop name. */
  brandName?: string;
  /** Industry or niche (e.g. "craft supplies", "laser cutting"). */
  industry?: string;
  /** Target audience or buyer persona. */
  audience?: string;
  /** Up to 5 keywords to include. */
  keywords?: string[];
}

export interface ContentResult {
  title: string;
  content: string;
  tags?: string[];
}

// ---------------------------------------------------------------------------
// OpenAI helper (optional)
// ---------------------------------------------------------------------------

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

async function callOpenAI(messages: OpenAIMessage[], maxTokens = 400): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY not set');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: maxTokens,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${err}`);
  }

  const data = (await response.json()) as {
    choices: Array<{ message: { content: string } }>;
  };
  return data.choices[0]?.message?.content?.trim() ?? '';
}

// ---------------------------------------------------------------------------
// Fallback template generators
// ---------------------------------------------------------------------------

function templateEtsyListing(options: ContentOptions): ContentResult {
  const { subject, brandName, industry, keywords = [] } = options;
  const shop = brandName ? `${brandName} ` : '';
  const niche = industry ? ` perfect for ${industry}` : '';
  const kws = keywords.slice(0, 5).join(', ');

  return {
    title: `${shop}${subject} SVG Cut File – Instant Digital Download${niche}`,
    content: [
      `Bring your creative vision to life with this high-quality **${subject} SVG cut file**${niche}.`,
      '',
      '**What you get:**',
      '- SVG file (compatible with Cricut, Silhouette, Glowforge, and more)',
      '- PNG at 300 DPI for sublimation and print',
      '- DXF for laser cutters',
      '- PDF reference sheet',
      '',
      '**Perfect for:**',
      '- Vinyl decals, heat transfer projects, and T-shirts',
      '- Laser engraving and cutting on wood, acrylic, and leather',
      '- Paper crafting, card making, and scrapbooking',
      '',
      '⚡ **Instant download** — files available immediately after purchase.',
      '',
      kws ? `Tags: ${kws}` : '',
    ]
      .filter(Boolean)
      .join('\n'),
    tags: [
      'svg cut file',
      'instant download',
      'cricut',
      'silhouette',
      subject.toLowerCase(),
      ...(keywords || []),
    ].slice(0, 13),
  };
}

function templateAltText(options: ContentOptions): ContentResult {
  const { subject, industry } = options;
  const ctx = industry ? ` used in ${industry}` : '';
  return {
    title: `Alt text for ${subject}`,
    content: `A clean vector SVG graphic of ${subject}${ctx}, with simple shapes and minimal detail, suitable for web use and scalable at any size.`,
  };
}

function templateBlogIntro(options: ContentOptions): ContentResult {
  const { subject, industry, brandName } = options;
  const brand = brandName ? ` by ${brandName}` : '';
  const niche = industry ? ` in the ${industry} space` : '';
  return {
    title: `How to Use ${subject} SVGs for Your Next Project`,
    content: [
      `Whether you're a seasoned maker or just getting started${niche}, finding the right SVG file can make or break your project.`,
      '',
      `${subject} designs${brand} have exploded in popularity — and for good reason. They're versatile, crisp at any size, and work with virtually every cutting machine and design tool on the market.`,
      '',
      `In this guide, we'll walk through everything you need to know about working with ${subject} SVG files, from choosing the right format to exporting for your specific machine or platform.`,
    ].join('\n'),
  };
}

function templateProductDescription(options: ContentOptions): ContentResult {
  const { subject, industry, keywords = [] } = options;
  const niche = industry ? ` for ${industry} professionals` : '';
  const kws = keywords.slice(0, 3).join(', ');
  return {
    title: `${subject} — Professional SVG Vector File`,
    content: [
      `A professionally designed ${subject} vector graphic${niche}, ready to use in your next creative project.`,
      '',
      `This scalable SVG file is built for precision — clean anchor points, organized layers, and full compatibility with all major design tools including Adobe Illustrator, Inkscape, Affinity Designer, Cricut Design Space, and Silhouette Studio.`,
      '',
      kws ? `Ideal for: ${kws}.` : '',
    ]
      .filter(Boolean)
      .join('\n'),
    tags: [subject.toLowerCase(), 'vector', 'svg', ...(keywords || [])].slice(0, 10),
  };
}

function templateSvgDescription(options: ContentOptions): ContentResult {
  const { subject } = options;
  return {
    title: `${subject} SVG`,
    content: `Vector SVG graphic depicting ${subject}. Clean paths, optimized for web and print use.`,
  };
}

// ---------------------------------------------------------------------------
// OpenAI-backed generators
// ---------------------------------------------------------------------------

async function openAiEtsyListing(options: ContentOptions): Promise<ContentResult> {
  const { subject, brandName, industry, audience, keywords = [] } = options;
  const kws = keywords.join(', ');

  const text = await callOpenAI(
    [
      {
        role: 'system',
        content:
          'You are an expert Etsy SEO copywriter. Write compelling product listings for digital SVG downloads. Use markdown-style bold for section headers. Be concise but thorough.',
      },
      {
        role: 'user',
        content: [
          `Write an Etsy listing for: "${subject}" SVG cut file`,
          brandName ? `Shop: ${brandName}` : '',
          industry ? `Niche: ${industry}` : '',
          audience ? `Target buyer: ${audience}` : '',
          kws ? `Keywords to include: ${kws}` : '',
          '',
          'Format: First line is the title (under 140 chars). Then a blank line. Then the description (200-300 words). Then "Tags: tag1, tag2, ..." (up to 13 tags).',
        ]
          .filter(Boolean)
          .join('\n'),
      },
    ],
    500,
  );

  const lines = text.split('\n');
  const title = lines[0].replace(/^#+\s*/, '').trim();
  const tagLine = lines.find((l) => l.toLowerCase().startsWith('tags:'));
  const tags = tagLine
    ? tagLine
        .replace(/^tags:\s*/i, '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    : [];
  const content = lines
    .slice(1)
    .filter((l) => !l.toLowerCase().startsWith('tags:'))
    .join('\n')
    .trim();

  return { title, content, tags };
}

async function openAiAltText(options: ContentOptions): Promise<ContentResult> {
  const { subject, industry } = options;
  const text = await callOpenAI(
    [
      {
        role: 'system',
        content:
          'You write concise, accurate alt text for images. Keep it under 125 characters. Describe the visual content, not the purpose.',
      },
      {
        role: 'user',
        content: `Write alt text for an SVG graphic of: "${subject}"${industry ? ` used in ${industry}` : ''}`,
      },
    ],
    80,
  );
  return { title: `Alt text for ${subject}`, content: text };
}

async function openAiBlogIntro(options: ContentOptions): Promise<ContentResult> {
  const { subject, industry, keywords = [] } = options;
  const kws = keywords.join(', ');
  const text = await callOpenAI(
    [
      {
        role: 'system',
        content:
          'You write engaging, SEO-friendly blog introductions for creative and maker content. Keep it to 3 paragraphs, conversational tone, no fluff.',
      },
      {
        role: 'user',
        content: [
          `Write a blog introduction about: "${subject} SVG files"`,
          industry ? `Context: ${industry}` : '',
          kws ? `Include these keywords naturally: ${kws}` : '',
        ]
          .filter(Boolean)
          .join('\n'),
      },
    ],
    300,
  );

  return {
    title: `How to Use ${subject} SVGs for Your Next Project`,
    content: text,
  };
}

async function openAiProductDescription(options: ContentOptions): Promise<ContentResult> {
  const { subject, industry, audience, keywords = [] } = options;
  const text = await callOpenAI(
    [
      {
        role: 'system',
        content:
          'You write short, punchy product descriptions for digital SVG files. Focus on benefits, compatibility, and use cases. 2-3 short paragraphs.',
      },
      {
        role: 'user',
        content: [
          `Write a product description for: "${subject}" SVG file`,
          industry ? `Industry: ${industry}` : '',
          audience ? `Audience: ${audience}` : '',
          keywords.length ? `Keywords: ${keywords.join(', ')}` : '',
        ]
          .filter(Boolean)
          .join('\n'),
      },
    ],
    250,
  );

  return {
    title: `${subject} — Professional SVG Vector File`,
    content: text,
    tags: [subject.toLowerCase(), 'vector', 'svg', ...(keywords || [])].slice(0, 10),
  };
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export async function generateContent(options: ContentOptions): Promise<ContentResult> {
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);

  try {
    if (hasOpenAI) {
      switch (options.type) {
        case 'etsy_listing':
          return await openAiEtsyListing(options);
        case 'alt_text':
          return await openAiAltText(options);
        case 'blog_intro':
          return await openAiBlogIntro(options);
        case 'product_description':
          return await openAiProductDescription(options);
        case 'svg_description':
          // Template is good enough; skip the round-trip
          return templateSvgDescription(options);
      }
    }
  } catch {
    // Fall through to templates on any OpenAI error
  }

  // Template fallback (always works without env vars)
  switch (options.type) {
    case 'etsy_listing':
      return templateEtsyListing(options);
    case 'alt_text':
      return templateAltText(options);
    case 'blog_intro':
      return templateBlogIntro(options);
    case 'product_description':
      return templateProductDescription(options);
    case 'svg_description':
    default:
      return templateSvgDescription(options);
  }
}
