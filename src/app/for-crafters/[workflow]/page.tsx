import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getWorkflow, WORKFLOW_SLUGS } from '@/lib/workflow-configs';

export async function generateStaticParams() {
  return WORKFLOW_SLUGS.map((slug) => ({
    workflow: slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ workflow: string }>;
}): Promise<Metadata> {
  const { workflow: slug } = await params;
  const workflow = getWorkflow(slug);

  if (!workflow) {
    return {
      title: 'Workflow Not Found',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vectorr.com';

  return {
    title: workflow.seoTitle,
    description: workflow.seoDescription,
    keywords: workflow.keywords,
    alternates: {
      canonical: `${baseUrl}/for-crafters/${slug}`,
    },
    openGraph: {
      title: workflow.seoTitle,
      description: workflow.seoDescription,
      url: `${baseUrl}/for-crafters/${slug}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: workflow.seoTitle,
      description: workflow.seoDescription,
    },
  };
}

export default async function WorkflowPage({
  params,
}: {
  params: Promise<{ workflow: string }>;
}) {
  const { workflow: slug } = await params;
  const workflow = getWorkflow(slug);

  if (!workflow) {
    notFound();
  }

  // Parse content sections (split by ## headers)
  const sections = workflow.content.split(/\n## /).slice(1);
  const intro = workflow.content.split(/\n## /)[0].replace(/^# .+\n\n/, '');

  return (
    <main className="min-h-screen bg-[#FAFBFC]">
      {/* Hero */}
      <section className="border-b border-[#E5E8EB] bg-white">
        <div className="wrap py-16 md:py-20">
          <div className="mx-auto max-w-3xl">
            <div className="mb-4 flex items-center gap-3">
              <span className="rounded-full bg-[#F0F2F5] px-3 py-1 text-[13px] font-medium text-[#4A5568]">
                {workflow.category}
              </span>
              <span className="text-[13px] text-[#718096]">
                {workflow.tools.join(', ')}
              </span>
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

      {/* Content */}
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
                    dangerouslySetInnerHTML={{
                      __html: body
                        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\n\n/g, '</p><p>')
                        .replace(/\n(\d+)\. /g, '</p><ol><li>')
                        .replace(/\n- /g, '</p><ul><li>')
                        .replace(/<\/li>\n/g, '</li></ul><p>')
                        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
                        .split('\n')
                        .map((line) => (line ? `<p>${line}</p>` : ''))
                        .join(''),
                    }}
                  />
                </section>
              );
            })}
          </article>

          {/* CTA */}
          <div className="mt-12 rounded-2xl border border-[#E5E8EB] bg-white p-8 text-center">
            <h3 className="mb-3 text-[1.5rem] font-bold text-[#1A202C]">
              Ready to convert your files?
            </h3>
            <p className="mb-6 text-[15px] text-[#718096]">
              Upload your images and start creating with {workflow.tools[0]}.
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
