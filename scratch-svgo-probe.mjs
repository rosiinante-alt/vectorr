import { optimize } from 'svgo';

const run = (svg, label) => {
  const t0 = performance.now();
  const out = optimize(svg, { plugins: [{ name: 'preset-default' }], js2svg: { pretty: false } });
  const ms = performance.now() - t0;
  console.log(
    `${label.padEnd(38)} ${String(Math.round(Buffer.byteLength(svg) / 1024)).padStart(5)}KB  ${ms.toFixed(0).padStart(6)}ms  saved ${(100 - (Buffer.byteLength(out.data) / Buffer.byteLength(svg)) * 100).toFixed(0)}%`,
  );
};

const wrap = (inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><g>${inner}</g></svg>`;

let a = '';
for (let i = 0; i < 2000; i += 1) a += `<path d="M10 10L20 20L30 30Z"/>`;
run(wrap(a), '2000 paths, no ids, short coords');

let b = '';
for (let i = 0; i < 2000; i += 1) b += `<path id="p${i}" d="M10 10L20 20L30 30Z"/>`;
run(wrap(b), '2000 paths, WITH ids');

// 1MB probe
let c = '';
while (Buffer.byteLength(c) < 1 * 1024 * 1024) c += `<path d="M10.123456789 10.987654321L20.123456789 20.987654321L30.5 30.5Z"/>`;
run(wrap(c), '~1MB');

// 2MB probe
let d = '';
while (Buffer.byteLength(d) < 2 * 1024 * 1024) d += `<path d="M10.123456789 10.987654321L20.123456789 20.987654321L30.5 30.5Z"/>`;
run(wrap(d), '~2MB');

console.log('\nConclusion: sweep cost at these sizes');
for (const kb of [100, 500, 1024, 2048]) {
  console.log(`  ${String(kb).padStart(4)}KB = 34 runs × ${String(Math.round((kb / 100) * 100)).padStart(4)}ms = ${String(Math.round(34 * (kb / 100) * 100)).padStart(6)}ms total`);
}
