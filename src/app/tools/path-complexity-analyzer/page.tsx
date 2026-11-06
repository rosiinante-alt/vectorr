'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

export default function PathComplexityAnalyzerPage() {
  const [fileName, setFileName] = useState('');
  const [stats, setStats] = useState({
    totalPaths: 0,
    totalNodes: 0,
    avgNodesPerPath: 0,
    maxNodes: 0,
    minNodes: 0,
    curveCount: 0,
    lineCount: 0,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const text = await file.text();

    const pathMatches = text.match(/<path[^>]*d="([^"]+)"/g) || [];
    let totalNodes = 0;
    let maxNodes = 0;
    let minNodes = Infinity;
    let curveCount = 0;
    let lineCount = 0;

    pathMatches.forEach((path) => {
      const dMatch = path.match(/d="([^"]+)"/);
      if (dMatch) {
        const commands = dMatch[1].match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/gi) || [];
        const nodeCount = commands.length;
        totalNodes += nodeCount;
        maxNodes = Math.max(maxNodes, nodeCount);
        minNodes = Math.min(minNodes, nodeCount);

        commands.forEach((cmd) => {
          if (cmd[0].toUpperCase() === 'C' || cmd[0].toUpperCase() === 'Q') {
            curveCount++;
          } else if (cmd[0].toUpperCase() === 'L') {
            lineCount++;
          }
        });
      }
    });

    setStats({
      totalPaths: pathMatches.length,
      totalNodes,
      avgNodesPerPath: pathMatches.length > 0 ? totalNodes / pathMatches.length : 0,
      maxNodes: maxNodes === 0 ? 0 : maxNodes,
      minNodes: minNodes === Infinity ? 0 : minNodes,
      curveCount,
      lineCount,
    });
  };

  const complexity = stats.avgNodesPerPath > 100 ? 'High' : stats.avgNodesPerPath > 50 ? 'Medium' : 'Low';

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      <nav aria-label="Breadcrumb" className="border-b border-[#E5E8EB] bg-white">
        <div className="wrap py-3 text-[13.5px] text-[#718096]">
          <Link href="/" className="hover:text-[#1A202C]">Home</Link>
          <span aria-hidden="true"> / </span>
          <Link href="/tools" className="hover:text-[#1A202C]">Tools</Link>
          <span aria-hidden="true"> / </span>
          <span className="text-[#4A5568]">Path Complexity Analyzer</span>
        </div>
      </nav>

      <div className="wrap py-12">
        <header className="mb-8">
          <h1 className="text-[clamp(2rem,4vw,2.75rem)] font-bold mb-3 tracking-[-0.02em]">
            Path Complexity Analyzer
          </h1>
          <p className="text-[1.0625rem] text-text-secondary max-w-2xl">
            Measure SVG path complexity with detailed node counts, segment analysis, and curve statistics. Identify
            paths that need simplification.
          </p>
        </header>

        {stats.totalPaths === 0 && (
          <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border-strong rounded-2xl cursor-pointer bg-white hover:bg-bg-secondary transition-colors">
            <div className="text-center">
              <svg className="mx-auto mb-4 w-12 h-12 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-[1rem] font-medium mb-1">Click to upload SVG</p>
              <p className="text-[0.875rem] text-text-tertiary">or drag and drop</p>
            </div>
            <input ref={fileInputRef} id="file-upload" type="file" accept=".svg" className="hidden" onChange={handleFileSelect} />
          </label>
        )}

        {stats.totalPaths > 0 && (
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-white border border-border-subtle">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-[1.25rem] font-semibold">Complexity Analysis</h2>
                  <p className="text-[0.875rem] text-text-tertiary">{fileName}</p>
                </div>
                <div className={`px-4 py-2 rounded-full font-semibold ${
                  complexity === 'High' ? 'bg-red-100 text-red-700' :
                  complexity === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {complexity} Complexity
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-[0.875rem] text-text-tertiary mb-1">Total Paths</p>
                    <p className="text-[2rem] font-bold">{stats.totalPaths}</p>
                  </div>
                  <div>
                    <p className="text-[0.875rem] text-text-tertiary mb-1">Total Nodes</p>
                    <p className="text-[2rem] font-bold">{stats.totalNodes.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[0.875rem] text-text-tertiary mb-1">Avg Nodes per Path</p>
                    <p className="text-[2rem] font-bold">{stats.avgNodesPerPath.toFixed(1)}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[0.875rem] text-text-tertiary">Most Complex Path:</span>
                    <span className="text-[1.25rem] font-bold">{stats.maxNodes} nodes</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-[0.875rem] text-text-tertiary">Simplest Path:</span>
                    <span className="text-[1.25rem] font-bold">{stats.minNodes} nodes</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-[0.875rem] text-text-tertiary">Curve Commands:</span>
                    <span className="text-[1.25rem] font-bold">{stats.curveCount}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-[0.875rem] text-text-tertiary">Line Commands:</span>
                    <span className="text-[1.25rem] font-bold">{stats.lineCount}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl bg-bg-secondary border border-border-subtle">
                <h3 className="text-[1rem] font-semibold mb-3">Optimization Tips</h3>
                <ul className="space-y-2 text-[0.875rem] text-text-secondary">
                  <li>• Paths with &gt;100 nodes may benefit from simplification</li>
                  <li>• Use path optimization tools to reduce node count</li>
                  <li>• Complex paths increase file size and render time</li>
                </ul>
              </div>

              <div className="p-6 rounded-xl bg-white border border-border-subtle">
                <h3 className="text-[1rem] font-semibold mb-3">Performance Impact</h3>
                <div className="space-y-3 text-[0.875rem]">
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">Web Rendering:</span>
                    <span className="font-medium">{complexity === 'High' ? 'Slow' : complexity === 'Medium' ? 'Moderate' : 'Fast'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">Cutting Speed:</span>
                    <span className="font-medium">{complexity === 'High' ? 'Slower' : 'Normal'}</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => { setStats({ totalPaths: 0, totalNodes: 0, avgNodesPerPath: 0, maxNodes: 0, minNodes: 0, curveCount: 0, lineCount: 0 }); setFileName(''); if (fileInputRef.current) fileInputRef.current.value = ''; }}
              className="w-full h-11 rounded-full border border-border-strong font-semibold hover:bg-bg-secondary transition-colors"
            >
              Analyze Another File
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
