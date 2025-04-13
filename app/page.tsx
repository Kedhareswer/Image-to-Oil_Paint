import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Palette, Zap, ImageIcon } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 noise-bg"></div>
        <div className="container relative z-10">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Transform Photos into <span className="gradient-text">Oil Paintings</span> in Seconds
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
              ArtifyAI uses cutting-edge computer vision to transform your ordinary photos into extraordinary oil paint
              style artwork.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="text-base">
                <Link href="/convert">
                  Try It Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base">
                <Link href="/model">Learn How It Works</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold">Features that make ArtifyAI special</h2>
            <p className="mt-4 text-muted-foreground">
              Our platform offers a unique set of features designed to give you the best oil paint conversion
              experience.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-background rounded-lg p-6 shadow-sm border">
              <div className="h-12 w-12 rounded-full gradient-bg flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">Instant Conversion</h3>
              <p className="mt-2 text-muted-foreground">
                Transform your photos into oil paintings in just seconds with our optimized algorithms.
              </p>
            </div>

            <div className="bg-background rounded-lg p-6 shadow-sm border">
              <div className="h-12 w-12 rounded-full gradient-bg flex items-center justify-center">
                <Palette className="h-6 w-6 text-white" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">Artistic Quality</h3>
              <p className="mt-2 text-muted-foreground">
                Our model creates stunning oil paint effects with realistic brush strokes and texture.
              </p>
            </div>

            <div className="bg-background rounded-lg p-6 shadow-sm border">
              <div className="h-12 w-12 rounded-full gradient-bg flex items-center justify-center">
                <ImageIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">High Resolution</h3>
              <p className="mt-2 text-muted-foreground">
                Download your oil paint style images in high resolution for printing or sharing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Example Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold">See the transformation</h2>
            <p className="mt-4 text-muted-foreground">
              Check out these before and after examples of our oil paint style conversion.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
            <div className="space-y-4">
              <div className="aspect-square relative rounded-lg overflow-hidden border">
                <Image src="/placeholder.svg?height=600&width=600" alt="Original photo" fill className="object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-3 text-center">
                  Original Photo
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="aspect-square relative rounded-lg overflow-hidden border">
                <Image
                  src="/placeholder.svg?height=600&width=600"
                  alt="Oil paint style"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-3 text-center">
                  Oil Paint Style
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button asChild size="lg">
              <Link href="/convert">
                Try It Yourself <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold">What our users say</h2>
            <p className="mt-4 text-muted-foreground">
              Don't just take our word for it - hear from some of our satisfied users.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background rounded-lg p-6 shadow-sm border">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="font-semibold text-primary">JD</span>
                </div>
                <div>
                  <h4 className="font-semibold">Jamie Doe</h4>
                  <p className="text-sm text-muted-foreground">Digital Artist</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "ArtifyAI has become an essential part of my creative workflow. The oil paint conversions are stunning
                and save me hours of work!"
              </p>
            </div>

            <div className="bg-background rounded-lg p-6 shadow-sm border">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="font-semibold text-primary">AS</span>
                </div>
                <div>
                  <h4 className="font-semibold">Alex Smith</h4>
                  <p className="text-sm text-muted-foreground">Photographer</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "I've tried many similar tools, but ArtifyAI produces the most realistic oil paint effects. My clients
                love the results!"
              </p>
            </div>

            <div className="bg-background rounded-lg p-6 shadow-sm border">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="font-semibold text-primary">MJ</span>
                </div>
                <div>
                  <h4 className="font-semibold">Morgan Jones</h4>
                  <p className="text-sm text-muted-foreground">Student</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "Super easy to use and the results are amazing! I've been using ArtifyAI for my art projects and
                everyone thinks I painted them myself."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="rounded-2xl gradient-bg p-8 md:p-16 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to transform your photos?</h2>
            <p className="mt-4 max-w-2xl mx-auto">
              Join thousands of users who are already creating stunning oil paint style artwork with ArtifyAI.
            </p>
            <Button asChild size="lg" variant="secondary" className="mt-8">
              <Link href="/convert">
                Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
