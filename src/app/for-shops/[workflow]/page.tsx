import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SHOPS_WORKFLOWS, SHOPS_WORKFLOWS_MAP } from '@/lib/shops-workflow-configs';

export async function generateStaticParams() {
  return SHOPS_WORKFLOWS.map((w) => ({
    workflow: w.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ workflow: string }>;
}): Promise<Metadata> {
  const { workflow: slug } = await params;
  const workflow = SHOPS_WORKFLOWS_MAP.get(slug);

  if (!workflow) {
    return { title: 'Workflow Not Found' };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vectorr.com';

  return {
    title: workflow.seoTitle,
    description: workflow.seoDescription,
    keywords: workflow.keywords,
    alternates: {
      canonical: `${baseUrl}/for-shops/${slug}`,
    },
    openGraph: {
      title: workflow.seoTitle,
      description: workflow.seoDescription,
      url: `${baseUrl}/for-shops/${slug}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: workflow.seoTitle,
      description: workflow.seoDescription,
    },
  };
}

function renderMarkdown(body: string): string {
  const inline = (text: string) =>
    escapeHtml(text)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(
        /\[([^\]]+)\]\(([^)\s]+)\)/g,
        '<a class="text-accent underline underline-offset-2" href="$2">$1</a>',
      );

  const blocks: string[] = [];
  const lines = body.split('\n');
  let paragraph: string[] = [];
  let list: { type: 'ul' | 'ol'; items: string[] } | null = null;

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      blocks.push(`<p>${inline(paragraph.join(' '))}</p>`);
      paragraph = [];
    }
  };
  const flushList = () => {
    if (list) {
      blocks.push(
        `<${list.type}>${list.items.map((item) => `<li>${inline(item)}</li>`).join('')}</${list.type}>`,
      );
      list = null;
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed === '') {
      flushParagraph();
      flushList();
      continue;
    }

    const ordered = trimmed.match(/^\d+\.\s+(.*)$/);
    const unordered = trimmed.match(/^[-*]\s+(.*)$/);

    if (ordered || unordered) {
      flushParagraph();
      const type = ordered ? 'ol' : 'ul';
      if (!list || list.type !== type) {
        flushList();
        list = { type, items: [] };
      }
      list.items.push((ordered ?? unordered)![1]);
      continue;
    }

    flushList();

    if (trimmed.endsWith(':')) {
      flushParagraph();
      blocks.push(`<h3>${inline(trimmed.slice(0, -1))}</h3>`);
      continue;
    }

    const leadIn = trimmed.match(/^([^:.]{3,60}):\s+(.+)$/);
    if (leadIn) {
      flushParagraph();
      blocks.push(`<p><strong>${inline(leadIn[1])}:</strong> ${inline(leadIn[2])}</p>`);
      continue;
    }

    paragraph.push(trimmed);
  }

  flushParagraph();
  flushList();
  return blocks.join('');
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export default async function ShopsWorkflowPage({
  params,
}: {
  params: Promise<{ workflow: string }>;
}) {
  const { workflow: slug } = await params;
  const workflow = SHOPS_WORKFLOWS_MAP.get(slug);

  if (!workflow) {
    notFound();
  }

  const sections = workflow.content.split(/\n## /).slice(1);
  const intro = workflow.content.split(/\n## /)[0].replace(/^# .+\n\n/, '');

  return (
    <main className="min-h-screen bg-[#FAFBFC]">
      {workflow.schema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(workflow.schema) }}
        />
      ) : null}
      <nav aria-label="Breadcrumb" className="border-b border-[#E5E8EB] bg-white">
        <div className="wrap py-3 text-[13.5px] text-[#718096]">
          <Link href="/" className="hover:text-[#1A202C]">
            Home
          </Link>
          <span aria-hidden="true"> / </span>
          <Link href="/for-shops" className="hover:text-[#1A202C]">
            For Shops
          </Link>
          <span aria-hidden="true"> / </span>
          <span className="text-[#4A5568]">{workflow.title}</span>
        </div>
      </nav>

      <section className="border-b border-[#E5E8EB] bg-white">
        <div className="wrap py-16 md:py-20">
          <div className="mx-auto max-w-3xl">
            <div className="mb-4 flex items-center gap-3">
              <span className="rounded-full bg-[#F0F2F5] px-3 py-1 text-[13px] font-medium text-[#4A5568]">
                {workflow.category}
              </span>
              <span className="text-[13px] text-[#718096]">{workflow.tools.join(', ')}</span>
            </div>
            <h1 className="mb-5 text-[clamp(2rem,4vw,2.75rem)] font-bold leading-[1.15] tracking-[-0.025em] text-[#1A202C]">
              {workflow.title}
            </h1>
            <p className="text-[17px] leading-[1.6] text-[#4A5568]">{intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {workflow.formats.map((format) => (
                <span
                  key={format}
                  className="rounded-full border border-[#E5E8EB] bg-white px-4 py-1.5 text-[13px] font-medium text-[#2D3748]"
                >
                  {format}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="wrap py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          <article className="prose prose-slate max-w-none">
            {sections.map((section, idx) => {
              const [heading, ...rest] = section.split('\n');
              const body = rest.join('\n');
              return (
                <section key={idx} className="mb-10">
                  <h2 className="mb-4 text-[1.75rem] font-bold leading-[1.2] tracking-[-0.02em] text-[#1A202C]">
                    {heading}
                  </h2>
                  <div
                    className="space-y-4 text-[16px] leading-[1.7] text-[#4A5568]"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(body) }}
                  />
                </section>
              );
            })}
          </article>

          {workflow.faqs && workflow.faqs.length > 0 ? (
            <section className="mt-14" aria-labelledby="faq-heading">
              <h2
                id="faq-heading"
                className="mb-6 text-[1.75rem] font-bold leading-[1.2] tracking-[-0.02em] text-[#1A202C]"
              >
                Frequently Asked Questions
              </h2>
              <div className="divide-y divide-[#E5E8EB] rounded-2xl border border-[#E5E8EB] bg-white">
                {workflow.faqs.map((faq) => (
                  <details key={faq.question} className="group px-6 py-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[16px] font-semibold text-[#1A202C]">
                      {faq.question}
                      <span
                        aria-hidden="true"
                        className="shrink-0 text-[#718096] transition-transform group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <p className="mt-3 text-[15px] leading-[1.7] text-[#4A5568]">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          ) : null}

          <div className="mt-12 rounded-2xl border border-[#E5E8EB] bg-white p-8 text-center">
            <h3 className="mb-3 text-[1.5rem] font-bold text-[#1A202C]">
              Ready to prepare your production files?
            </h3>
            <p className="mb-6 text-[15px] text-[#718096]">
              Upload your artwork and optimize it for {workflow.tools[0]}.
            </p>
            <Link
              href="/convert"
              className="inline-flex h-11 items-center rounded-full bg-[#1A202C] px-6 text-[14.5px] font-semibold text-white transition-colors hover:bg-black"
            >
              Convert Now
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
