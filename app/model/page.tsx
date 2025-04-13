'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, ImageIcon, Code, Brush, Droplet } from "lucide-react"
import { useEffect, useState } from 'react'
import { LoadingSkeleton } from '@/components/ui/loading-skeleton'

export default function ModelPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="container py-12 transition-opacity duration-500 ease-in-out">
      {isLoading ? (
        <div className="max-w-4xl mx-auto space-y-8">
          <LoadingSkeleton className="h-8 w-3/4 mx-auto" />
          <LoadingSkeleton className="h-4 w-1/2 mx-auto" />
          <LoadingSkeleton count={3} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <LoadingSkeleton className="h-32" />
            <LoadingSkeleton className="h-32" />
            <LoadingSkeleton className="h-32" />
          </div>
        </div>
      ) : (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold">How Our Enhanced Oil Paint Model Works</h1>
          <p className="mt-4 text-muted-foreground">
            Discover the technology behind our advanced oil paint style conversion
          </p>
        </div>

        <div className="space-y-16">
          {/* Overview Section */}
          <section>
            <h2 className="text-2xl font-bold mb-6">The Technology Behind ArtifyAI</h2>
            <div className="prose dark:prose-invert max-w-none">
              <p>
                ArtifyAI uses advanced computer vision techniques to transform ordinary photos into authentic oil paint
                style artwork. Our enhanced model analyzes the input image, identifies key features, and applies
                multiple layers of transformations to create a realistic oil painting effect with rich texture and
                depth.
              </p>
              <p>
                Unlike simple filters, our approach preserves the important details of your image while adding authentic
                brush stroke textures, canvas grain, and artistic color adjustments that mimic the techniques used by
                oil painters. The result is a stunning artwork that captures the essence and character of traditional
                oil paintings.
              </p>
            </div>
          </section>

          {/* Process Flow */}
          <section>
            <h2 className="text-2xl font-bold mb-6">The Enhanced Conversion Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-background rounded-lg p-6 shadow-sm border text-center">
                <div className="h-12 w-12 rounded-full gradient-bg flex items-center justify-center mx-auto">
                  <ImageIcon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">1. Image Analysis</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your image is analyzed to identify edges, textures, and color patterns with enhanced precision.
                </p>
              </div>

              <div className="bg-background rounded-lg p-6 shadow-sm border text-center">
                <div className="h-12 w-12 rounded-full gradient-bg flex items-center justify-center mx-auto">
                  <Brush className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">2. Brush Stroke Simulation</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Multiple layers of simulated brush strokes are applied to create authentic texture and depth.
                </p>
              </div>

              <div className="bg-background rounded-lg p-6 shadow-sm border text-center">
                <div className="h-12 w-12 rounded-full gradient-bg flex items-center justify-center mx-auto">
                  <Droplet className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">3. Color Blending & Texture</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Advanced color quantization and canvas texture create the rich, vibrant look of oil paintings.
                </p>
              </div>
            </div>
          </section>

          {/* Technical Details */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Enhanced Technical Details</h2>
            <div className="bg-muted/50 rounded-lg p-6">
              <div className="prose dark:prose-invert max-w-none">
                <h3>Advanced Oil Paint Techniques</h3>
                <p>
                  Our enhanced model uses several sophisticated techniques to achieve a more authentic oil paint effect:
                </p>
                <ul>
                  <li>
                    <strong>Multi-layer Brush Simulation:</strong> We apply multiple layers of brush strokes with
                    varying sizes and directions
                  </li>
                  <li>
                    <strong>Canvas Texture Integration:</strong> A subtle canvas grain is added to mimic the texture of
                    real painting surfaces
                  </li>
                  <li>
                    <strong>Adaptive Color Quantization:</strong> Colors are intelligently grouped and blended to create
                    the distinctive oil paint look
                  </li>
                  <li>
                    <strong>Edge-Aware Stylization:</strong> Preserves important details while applying artistic effects
                    to surrounding areas
                  </li>
                  <li>
                    <strong>Dynamic Brush Pressure:</strong> Simulates varying pressure of brush strokes for more
                    realistic results
                  </li>
                </ul>

                <h3 className="mt-6">Implementation Improvements</h3>
                <p>The enhanced conversion engine includes significant improvements over the basic version:</p>
                <ol>
                  <li>Increased parameter customization for fine-tuning the artistic effect</li>
                  <li>Multiple bilateral filtering passes with varying parameters to create layered brush effects</li>
                  <li>Advanced color enhancement that preserves natural tones while adding artistic vibrancy</li>
                  <li>Simulated canvas texture integration for authentic painting surface appearance</li>
                  <li>Randomized brush stroke patterns to avoid artificial-looking repetition</li>
                  <li>Optimized processing for better detail preservation in the final artwork</li>
                </ol>
              </div>
            </div>
          </section>

          {/* Code Snippet */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Behind the Scenes: The Enhanced Code</h2>
            <div className="bg-background rounded-lg border overflow-hidden">
              <div className="bg-muted px-4 py-2 border-b flex items-center">
                <Code className="h-4 w-4 mr-2" />
                <span className="font-medium">apply_oil_paint_effect function</span>
              </div>
              <pre className="p-4 overflow-x-auto text-sm">
                <code>{`def apply_oil_paint_effect(self, img, radius=4, intensity=10, brush_count=25):
    """
    Apply an enhanced oil paint effect with more texture and depth
    
    Parameters:
    - radius: Size of the neighborhood for color averaging
    - intensity: Strength of the effect
    - brush_count: Number of brush strokes to simulate
    """
    # Convert to float32 for processing
    img_float = img.astype(np.float32) / 255.0
    
    # Create a copy for the output
    result = img.copy()
    
    # Apply bilateral filter for initial smoothing while preserving edges
    smoothed = cv2.bilateralFilter(img, 9, 75, 75)
    
    # Create canvas texture
    canvas = np.ones_like(img) * 240  # Light canvas background
    noise = np.random.randint(0, 15, img.shape).astype(np.uint8)
    canvas = cv2.subtract(canvas, noise)  # Add subtle texture to canvas
    
    # Apply multiple layers of "brush strokes"
    for i in range(brush_count):
        # Vary brush size for each layer
        brush_size = max(2, radius - i % 3)
        
        # Apply stylization with different parameters for each layer
        layer = cv2.stylization(
            smoothed, 
            sigma_s=0.5 + (i % 5) * 0.1,  # Spatial standard deviation
            sigma_r=0.5 + (i % 3) * 0.05  # Range standard deviation
        )
        
        # Apply additional bilateral filtering with varying parameters
        layer = cv2.bilateralFilter(
            layer, 
            d=brush_size*2 + 1,
            sigmaColor=35 + i % 20,
            sigmaSpace=35 + i % 20
        )
        
        # Add random brush stroke effect
        if i > 0:
            mask = np.random.rand(*img.shape[:2]) > 0.7
            mask = mask[:,:,np.newaxis].astype(np.float32)
            result = result * (1 - mask) + layer * mask
        else:
            result = layer
    
    # Enhance colors to make them more vibrant like oil paintings
    result = cv2.convertScaleAbs(result, alpha=1.2, beta=10)
    
    # Apply color quantization for oil paint-like color regions
    Z = result.reshape((-1, 3))
    Z = np.float32(Z)
    
    # Define criteria and apply k-means clustering
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 20, 0.001)
    K = 8 + intensity // 2  # Number of colors depends on intensity
    ret, label, center = cv2.kmeans(Z, K, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)
    
    # Convert back to uint8 and reshape to original image
    center = np.uint8(center)
    res = center[label.flatten()]
    result = res.reshape(img.shape)
    
    # Add canvas texture
    result = cv2.addWeighted(result, 0.9, canvas, 0.1, 0)
    
    # Add subtle brush stroke texture
    edges = cv2.Canny(cv2.cvtColor(img, cv2.COLOR_BGR2GRAY), 50, 150)
    edges = cv2.dilate(edges, None)
    edges = cv2.cvtColor(edges, cv2.COLOR_GRAY2BGR)
    result = cv2.subtract(result, edges // intensity)
    
    return result`}</code>
              </pre>
            </div>
          </section>

          {/* Future Improvements */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Future Enhancements</h2>
            <div className="prose dark:prose-invert max-w-none">
              <p>
                We're constantly working to improve our oil paint style conversion. Here are some of the enhancements
                we're developing:
              </p>
              <ul>
                <li>
                  <strong>AI-Powered Brush Stroke Analysis:</strong> Using machine learning to analyze real oil
                  paintings and replicate their brush stroke patterns
                </li>
                <li>
                  <strong>Artist Style Presets:</strong> Options to convert your photos in the style of famous oil
                  painters like Van Gogh, Monet, or Rembrandt
                </li>
                <li>
                  <strong>Selective Area Processing:</strong> Apply different oil paint effects to specific areas of
                  your image
                </li>
                <li>
                  <strong>Real-time Preview:</strong> See the effects of different settings before finalizing your
                  conversion
                </li>
                <li>
                  <strong>Video Conversion:</strong> Transform videos into oil paint style animations with consistent
                  frame-to-frame styling
                </li>
              </ul>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center">
            <h2 className="text-2xl font-bold mb-6">Ready to Create Your Masterpiece?</h2>
            <p className="text-muted-foreground mb-8">
              Experience the power of our enhanced oil paint style conversion technology firsthand.
            </p>
            <Button asChild size="lg">
              <Link href="/convert">
                Transform Your Image Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </section>
        </div>
      </div>
      )}
    </div>
  )
}
