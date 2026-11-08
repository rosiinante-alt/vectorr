"use client";

export function VideoDemo() {
  return (
    <section className="py-20 sm:py-28 bg-bg-secondary" aria-labelledby="video-heading">
      <div className="wrap">
        <div className="max-w-[760px] mb-12">
          <h2 id="video-heading" className="display text-[clamp(30px,4.4vw,50px)]">
            Watch it in action.
          </h2>
          <p className="mt-5 text-[clamp(17px,1.7vw,20px)] leading-relaxed text-text-secondary">
            From upload to download in under 10 seconds. See how our AI traces edges and rebuilds real geometry.
          </p>
        </div>

        <div className="max-w-[900px] mx-auto">
          <div className="relative aspect-video bg-black rounded-[var(--radius-xl)] shadow-[0_0_0_0.5px_var(--border),0_8px_24px_rgba(0,0,0,0.12)] overflow-hidden">
            {/* Video placeholder with play button */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60 flex items-center justify-center z-10">
              <button className="group flex items-center gap-3 rounded-full bg-white px-6 py-3 font-semibold text-black hover:bg-gray-100 transition-colors shadow-lg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch Demo (2 min)
              </button>
            </div>

            {/* Thumbnail image */}
            <img
              src="/demo/video-thumbnail.svg"
              alt="Video thumbnail"
              className="w-full h-full object-cover"
            />
          </div>

          <p className="mt-4 text-center text-[13.5px] text-text-tertiary">
            Demo video: Logo vectorization, format selection, and export
          </p>
        </div>
      </div>
    </section>
  );
}
