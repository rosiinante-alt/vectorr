'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SiteHeader, SiteFooter } from '@/components/site-chrome';
import { Button } from '@/components/ui/button';
import { Badge, type BadgeTone } from '@/components/ui/badge';
import { ArrowUpRight, Upload, Zap, GitBranch } from 'lucide-react';

interface FileRecord {
  id: string;
  filename: string;
  status: string;
  created_at: string;
  output_format: string | null;
  credits_used: number;
  error_message: string | null;
  download_url: string | null;
}

export default function DashboardPage() {
  const [credits, setCredits] = useState<number | null>(null);
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/credits/balance').then(r => {
        if (r.status === 401) return { error: 'Unauthorized' };
        return r.ok ? r.json() : null;
      }).catch(() => null),
      fetch('/api/files').then(r => {
        if (r.status === 401) return { error: 'Unauthorized' };
        return r.ok ? r.json() : null;
      }).catch(() => null),
    ]).then(([balanceData, filesData]) => {
      if (balanceData?.error === 'Unauthorized' || filesData?.error === 'Unauthorized') {
        setError('Please sign in to view your dashboard');
      } else {
        if (balanceData) {
          setCredits(balanceData.balance ?? 0);
        }
        if (filesData) {
          setFiles(filesData.files ?? []);
        }
      }
    }).finally(() => setLoading(false));
  }, []);

  const getStatusTone = (status: string): BadgeTone => {
    switch (status) {
      case 'complete': return 'success';
      case 'pending':
      case 'processing': return 'accent';
      case 'failed': return 'error';
      default: return 'neutral';
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'complete': return 'Complete';
      case 'pending': return 'Queued';
      case 'processing': return 'Processing';
      case 'failed': return 'Failed (refunded)';
      default: return status;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />

      <main id="main" className="flex-1 py-10 sm:py-14">
        <div className="wrap">
          {/* Header */}
          <div className="max-w-[820px]">
            <h1 className="display text-[clamp(28px,4vw,40px)]">
              Dashboard
            </h1>
            <p className="mt-3 max-w-[560px] text-[16.5px] text-text-secondary">
              View your credit balance, recent conversions, and quick actions.
            </p>
          </div>

          {loading ? (
            <div className="mt-10 text-text-secondary">Loading...</div>
          ) : error ? (
            <div className="mt-10 max-w-[560px] rounded-[var(--radius-xl)] bg-white p-6 shadow-[var(--shadow-1)]">
              <h2 className="text-[17px] font-semibold tracking-[-0.02em]">
                Sign in required
              </h2>
              <p className="mt-1.5 text-[14.5px] text-text-secondary">
                {error}
              </p>
              <div className="mt-4">
                <Link
                  href="/login"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-accent px-4 text-[15px] font-semibold tracking-[-0.01em] text-white shadow-[0_1px_2px_rgba(0,0,0,0.12)] transition-[background-color,transform,box-shadow] hover:-translate-y-px hover:bg-accent-hover active:translate-y-0"
                >
                  Sign in
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_280px]">
              {/* Main content */}
              <div className="space-y-6">
                {/* Credit balance card */}
                <div className="rounded-[var(--radius-xl)] bg-white p-6 shadow-[var(--shadow-1)]">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[13.5px] font-medium text-text-secondary">
                        Credit Balance
                      </p>
                      <p className="mt-2 font-mono text-[40px] font-bold leading-none tracking-[-0.02em]">
                        {credits}
                      </p>
                      <p className="mt-2 text-[13.5px] text-text-tertiary">
                        Credits available for conversions
                      </p>
                    </div>
                    <Link
                      href="/pricing"
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-accent px-4 text-[15px] font-semibold tracking-[-0.01em] text-white shadow-[0_1px_2px_rgba(0,0,0,0.12)] transition-[background-color,transform,box-shadow] hover:-translate-y-px hover:bg-accent-hover active:translate-y-0"
                    >
                      Buy credits
                    </Link>
                  </div>
                </div>

                {/* Recent conversions */}
                <div className="rounded-[var(--radius-xl)] bg-white p-6 shadow-[var(--shadow-1)]">
                  <h2 className="text-[17px] font-semibold tracking-[-0.02em]">
                    Recent Files
                  </h2>
                  
                  {files.length === 0 ? (
                    <div className="mt-6 text-center">
                      <p className="text-[14.5px] text-text-secondary">
                        No conversions yet. Convert your first image →
                      </p>
                      <div className="mt-4">
                        <Link
                          href="/convert"
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-accent px-4 text-[15px] font-semibold tracking-[-0.01em] text-white shadow-[0_1px_2px_rgba(0,0,0,0.12)] transition-[background-color,transform,box-shadow] hover:-translate-y-px hover:bg-accent-hover active:translate-y-0"
                        >
                          Start converting
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {files.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between gap-4 rounded-[var(--radius-md)] border border-[var(--border)] p-4 transition-colors hover:bg-bg-secondary"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[14.5px] font-medium">
                              {file.filename}
                            </p>
                            <div className="mt-1 flex items-center gap-3 text-[13px] text-text-tertiary">
                              <span>{formatDate(file.created_at)}</span>
                              {file.output_format && (
                                <span className="font-mono uppercase">{file.output_format}</span>
                              )}
                              <span className="font-mono">{file.credits_used} cr</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge tone={getStatusTone(file.status)}>
                              {getStatusLabel(file.status)}
                            </Badge>
                            {file.status === 'complete' && file.download_url && (
                              <a
                                href={file.download_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[13.5px] font-medium text-accent hover:underline"
                              >
                                Download
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <aside className="space-y-4">
                <div className="rounded-[var(--radius-xl)] bg-white p-5 shadow-[var(--shadow-1)]">
                  <h2 className="text-[15px] font-semibold tracking-[-0.02em]">
                    Quick Actions
                  </h2>
                  <div className="mt-4 space-y-2">
                    <Link
                      href="/convert"
                      className="flex items-center gap-3 rounded-[var(--radius-md)] p-3 text-[14px] font-medium transition-colors hover:bg-bg-secondary"
                    >
                      <Upload className="h-4 w-4 text-text-tertiary" />
                      <span>Convert image</span>
                    </Link>
                    <Link
                      href="/convert"
                      className="flex items-center gap-3 rounded-[var(--radius-md)] p-3 text-[14px] font-medium transition-colors hover:bg-bg-secondary"
                    >
                      <Zap className="h-4 w-4 text-text-tertiary" />
                      <span>Batch upload</span>
                    </Link>
                    <Link
                      href="/convert"
                      className="flex items-center gap-3 rounded-[var(--radius-md)] p-3 text-[14px] font-medium transition-colors hover:bg-bg-secondary"
                    >
                      <ArrowUpRight className="h-4 w-4 text-text-tertiary" />
                      <span>Style transfer</span>
                    </Link>
                    <Link
                      href="/workflows"
                      className="flex items-center gap-3 rounded-[var(--radius-md)] p-3 text-[14px] font-medium transition-colors hover:bg-bg-secondary"
                    >
                      <GitBranch className="h-4 w-4 text-text-tertiary" />
                      <span>Workflows</span>
                    </Link>
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
