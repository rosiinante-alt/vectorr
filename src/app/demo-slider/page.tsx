import { ImageComparisonSlider } from "@/components/image-comparison-slider";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export default function DemoSliderPage() {
  return (
    <>
      <SiteHeader />
      <main className="py-12">
        <div className="wrap">
          <h1 className="text-3xl font-bold mb-12">Image Comparison Slider Demo</h1>

          {/* Logo example */}
          <section className="mb-16">
            <h2 className="text-xl font-semibold mb-4">Logo Comparison</h2>
            <p className="text-gray-600 mb-6">Initial position at 50%</p>
            <ImageComparisonSlider
              beforeImage="/demo/logo-raster.svg"
              afterImage="/demo/logo-vector.svg"
              beforeAlt="Raster logo - pixelated and blurry"
              afterAlt="Vector logo - crisp and scalable"
              initialPosition={50}
              className="rounded-lg shadow-lg"
              height={500}
            />
          </section>

          {/* Tree example */}
          <section className="mb-16">
            <h2 className="text-xl font-semibold mb-4">Tree Comparison</h2>
            <p className="text-gray-600 mb-6">Initial position at 30%</p>
            <ImageComparisonSlider
              beforeImage="/demo/tree-raster.svg"
              afterImage="/demo/tree-vector.svg"
              beforeAlt="Raster tree - pixelated and blurry"
              afterAlt="Vector tree - crisp and scalable"
              initialPosition={30}
              className="rounded-lg shadow-lg"
              height={400}
            />
          </section>

          {/* Instructions */}
          <section className="bg-gray-50 p-8 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">How to Use</h2>
            <ul className="space-y-2 text-gray-700">
              <li><strong>Click & Drag:</strong> Click on the slider and drag left/right to compare</li>
              <li><strong>Touch:</strong> On mobile, touch and drag to compare</li>
              <li><strong>Keyboard Navigation:</strong> Click to focus, then use arrow keys</li>
              <li><strong>Arrow Keys:</strong> ← → moves 1%, Shift+← → moves 10%</li>
              <li><strong>Home/End:</strong> Jump to 0% or 100%</li>
            </ul>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
