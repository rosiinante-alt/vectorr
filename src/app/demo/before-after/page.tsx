import { BeforeAfterSlider } from "@/components/before-after-slider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Before/After Slider Demo — Vectorr",
  description: "Interactive comparison slider for before and after images",
};

export default function BeforeAfterPage() {
  return (
    <main className="min-h-screen bg-bg-primary py-8 px-4 sm:px-6 lg:px-8">
      <div className="wrap">
        <div className="mb-8">
          <h1 className="display text-[32px] sm:text-[40px] mb-2">Before/After Comparison</h1>
          <p className="text-text-secondary text-lg">
            Interactive slider to compare original images with vectorized SVG output
          </p>
        </div>

        {/* Example 1: Simple comparison */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Example: Logo Vectorization</CardTitle>
            <CardDescription>
              Drag the slider to compare the original PNG with the optimized SVG
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video overflow-hidden">
              <BeforeAfterSlider
                beforeSrc="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=600&fit=crop"
                afterSrc="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=600&fit=crop&auto=format&q=80&sat=-50"
                beforeLabel="Original (PNG)"
                afterLabel="Vectorized (SVG)"
              />
            </div>
          </CardContent>
        </Card>

        {/* Example 2: Illustration comparison */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Example: Illustration Optimization</CardTitle>
            <CardDescription>
              Use keyboard arrow keys to fine-tune the comparison
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-square overflow-hidden">
              <BeforeAfterSlider
                beforeSrc="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=600&fit=crop"
                afterSrc="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=600&fit=crop&auto=format&q=80&sat=-30"
                beforeLabel="Original"
                afterLabel="Optimized"
              />
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-text-secondary">
              <li className="flex gap-3">
                <span className="text-accent font-bold">✓</span>
                <span>
                  <strong>Mouse drag:</strong> Click and drag the slider to compare
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold">✓</span>
                <span>
                  <strong>Touch support:</strong> Swipe on mobile and tablet devices
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold">✓</span>
                <span>
                  <strong>Keyboard navigation:</strong> Use ← → arrow keys for precise control
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold">✓</span>
                <span>
                  <strong>Click anywhere:</strong> Click on the image to jump to that position
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold">✓</span>
                <span>
                  <strong>Smooth animations:</strong> 60fps motion with spring easing
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold">✓</span>
                <span>
                  <strong>Accessible:</strong> Full keyboard and screen reader support
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
