import { Suspense } from "react";
import { ImageComparisonSlider } from "@/components/image-comparison-slider";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { AuthSlot } from "@/components/auth-slot";
import Link from "next/link";

interface ExampleItem {
  index: number;
  name: string;
  title: string;
  description: string;
  category: string;
  beforeImage: string;
  afterImage: string;
  initialPosition?: number;
}

const examples: ExampleItem[] = [
  {
    index: 1,
    name: "pixel-heart",
    title: "Pixel Heart Icon",
    description: "Transform pixelated game art into crisp, scalable vector graphics perfect for app icons and UI elements.",
    category: "Icons & Logos",
    beforeImage: "/demo/examples/image-01-before.png",
    afterImage: "/demo/examples/image-01-after.png",
    initialPosition: 50,
  },
  {
    index: 2,
    name: "apple",
    title: "Apple Illustration",
    description: "Convert blurred raster photos into clean vector artwork with preserved shapes and colors.",
    category: "Illustrations",
    beforeImage: "/demo/examples/image-02-before.png",
    afterImage: "/demo/examples/image-02-after.png",
    initialPosition: 50,
  },
  {
    index: 3,
    name: "cityscape",
    title: "City Skyline",
    description: "Extract architectural silhouettes from noisy backgrounds into crisp vector shapes ready for print or web.",
    category: "Architectural",
    beforeImage: "/demo/examples/image-03-before.png",
    afterImage: "/demo/examples/image-03-after.png",
    initialPosition: 50,
  },
  {
    index: 4,
    name: "bird",
    title: "Bird Illustration",
    description: "Preserve intricate detail in nature illustrations while eliminating compression artifacts.",
    category: "Nature & Wildlife",
    beforeImage: "/demo/examples/image-04-before.png",
    afterImage: "/demo/examples/image-04-after.png",
    initialPosition: 50,
  },
  {
    index: 6,
    name: "deer-full",
    title: "Red Deer",
    description: "Full-body wildlife art with complex organic shapes converted to infinitely scalable vectors.",
    category: "Nature & Wildlife",
    beforeImage: "/demo/examples/image-06-before.png",
    afterImage: "/demo/examples/image-06-after.png",
    initialPosition: 50,
  },
  {
    index: 7,
    name: "deer-detail",
    title: "Deer Antler Detail",
    description: "Zoom into fine detail — antlers, branches, intricate line work — without losing quality.",
    category: "Detail Shots",
    beforeImage: "/demo/examples/image-07-before.png",
    afterImage: "/demo/examples/image-07-after.png",
    initialPosition: 50,
  },
  {
    index: 10,
    name: "eagle",
    title: "Eagle Logo",
    description: "Turn blurry bitmap logos into professional vector marks suitable for large-format printing.",
    category: "Icons & Logos",
    beforeImage: "/demo/examples/image-10-before.png",
    afterImage: "/demo/examples/image-10-after.png",
    initialPosition: 50,
  },
  {
    index: 11,
    name: "s-letter",
    title: "Letter S Emblem",
    description: "Typography and lettering converted from raster to editable vector paths.",
    category: "Typography",
    beforeImage: "/demo/examples/image-11-before.png",
    afterImage: "/demo/examples/image-11-after.png",
    initialPosition: 50,
  },
];

const categories = Array.from(new Set(examples.map((ex) => ex.category)));

export const metadata = {
  title: "Before/After Examples — Vectroy Vectorization Gallery",
  description: "See real-world vectorization results. Drag the slider to compare pixelated raster images with clean, scalable vector output.",
};

export default function ExamplesPage() {
  return (
    <>
      <SiteHeader
        authSlot={
          <Suspense fallback={null}>
            <AuthSlot />
          </Suspense>
        }
      />

      <main className="min-h-screen bg-[#0B0E14]">
        {/* Hero */}
        <section className="py-16 sm:py-24 bg-gradient-to-b from-[#0F172A] to-[#0B0E14]">
          <div className="wrap">
            <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h1 className="text-[clamp(32px,5vw,56px)] font-bold text-[#F8FAFC] leading-[1.1] mb-6">
                See the difference.
              </h1>
              <p className="text-lg text-[#94A3B8] leading-relaxed mb-8">
                Drag the slider to compare pixelated raster images with clean vector results. 
                Every example below is a real conversion — no mockups, no manual redrawing.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link
                  href="/convert"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#22D3EE] text-[#0B0E14] font-medium hover:bg-[#06B6D4] transition-colors"
                >
                  Try it yourself
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                <Link
                  href="#categories"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-[#1E293B] text-[#F8FAFC] hover:bg-[#1E293B] transition-colors"
                >
                  Browse examples
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How to use */}
        <section className="py-12 border-t border-[#1E293B]">
          <div className="wrap">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[#1E293B] flex items-center justify-center text-[#22D3EE]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M15 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V9L15 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M15 3V9H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-[#F8FAFC] mb-1">Click & Drag</div>
                    <div className="text-sm text-[#64748B]">Mouse or touch the slider</div>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[#1E293B] flex items-center justify-center text-[#22D3EE]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M8 6L12 2L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 2V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M18 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 18L12 22L16 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 10V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-[#F8FAFC] mb-1">Keyboard Controls</div>
                    <div className="text-sm text-[#64748B]">Arrow keys or Home/End</div>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[#1E293B] flex items-center justify-center text-[#22D3EE]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 5V3M12 21V19M19 12H21M3 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M17.66 17.66L19.07 19.07M4.93 4.93L6.34 6.34M17.66 6.34L19.07 4.93M4.93 19.07L6.34 17.66" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-[#F8FAFC] mb-1">Focus to Compare</div>
                    <div className="text-sm text-[#64748B]">See raster vs. vector quality</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Category navigation */}
        <section id="categories" className="py-8 border-t border-[#1E293B] sticky top-0 bg-[#0B0E14]/95 backdrop-blur-sm z-10">
          <div className="wrap">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((cat) => (
                <a
                  key={cat}
                  href={`#${cat.toLowerCase().replace(/\s+/g, "-")}`}
                  className="px-4 py-2 rounded-lg border border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B] transition-colors whitespace-nowrap text-sm font-medium"
                >
                  {cat}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Examples by category */}
        {categories.map((category) => {
          const categoryExamples = examples.filter((ex) => ex.category === category);
          return (
            <section
              key={category}
              id={category.toLowerCase().replace(/\s+/g, "-")}
              className="py-16 border-t border-[#1E293B]"
            >
              <div className="wrap">
                <h2 className="text-2xl font-bold text-[#F8FAFC] mb-8">{category}</h2>
                <div className="space-y-16">
                  {categoryExamples.map((example, idx) => (
                    <div 
                      key={example.index} 
                      className="group"
                      style={{
                        animation: `fadeInUp 0.6s ease-out ${idx * 0.1}s both`
                      }}
                    >
                      <div className="mb-4">
                        <h3 className="text-xl font-semibold text-[#F8FAFC] mb-2">
                          {example.title}
                        </h3>
                        <p className="text-[#64748B] max-w-2xl">{example.description}</p>
                      </div>
                      <div className="max-w-[1000px] mx-auto">
                        <ImageComparisonSlider
                          beforeImage={example.beforeImage}
                          afterImage={example.afterImage}
                          beforeLabel="Raster"
                          afterLabel="Vector"
                          beforeAlt={`${example.title} — pixelated raster version`}
                          afterAlt={`${example.title} — clean vector result`}
                          initialPosition={example.initialPosition}
                          className="rounded-xl bg-[#111827] shadow-[0_8px_24px_rgba(0,0,0,0.4)] overflow-hidden border border-[#1E293B]"
                          height={600}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        })}

        {/* CTA */}
        <section className="py-16 sm:py-20 border-t border-[#1E293B]">
          <div className="wrap">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-[clamp(28px,4vw,44px)] font-bold text-[#F8FAFC] mb-6">
                Ready to vectorize your images?
              </h2>
              <p className="text-lg text-[#94A3B8] mb-8">
                Upload your raster image and get clean, scalable vector graphics in seconds.
              </p>
              <Link
                href="/convert"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-[#22D3EE] text-[#0B0E14] font-semibold text-lg hover:bg-[#06B6D4] transition-colors"
              >
                Start converting
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7.5 4L13.5 10L7.5 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
