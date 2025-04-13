import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold">About ArtifyAI</h1>
          <p className="mt-4 text-muted-foreground">Learn about our mission and the team behind the technology</p>
        </div>

        <div className="space-y-16">
          {/* Our Story */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Our Story</h2>
            <div className="prose dark:prose-invert max-w-none">
              <p>
                ArtifyAI was born from a passion for art and technology. Our founder, an art enthusiast with a
                background in computer vision, wanted to make artistic transformations accessible to everyone,
                regardless of their artistic abilities.
              </p>
              <p>
                What started as a personal project quickly evolved into a powerful tool that could transform ordinary
                photos into stunning oil paint style artwork with just a few clicks. After sharing early versions with
                friends and receiving overwhelmingly positive feedback, we decided to develop it into a full-fledged
                platform.
              </p>
              <p>
                Today, ArtifyAI is used by thousands of people worldwide, from casual users who want to create unique
                artwork from their photos to professional photographers looking to offer new creative options to their
                clients.
              </p>
            </div>
          </section>

          {/* Our Mission */}
          <section className="bg-muted/50 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Our Mission</h2>
            <blockquote className="text-xl italic border-l-4 border-primary pl-4">
              "To democratize artistic expression by making advanced image transformation technology accessible to
              everyone."
            </blockquote>
            <p className="mt-6 text-muted-foreground">
              We believe that everyone should be able to express their creativity, even if they don't have traditional
              artistic skills. Our goal is to build tools that empower people to transform their ideas and memories into
              beautiful works of art.
            </p>
          </section>

          {/* Team Section */}
          <section>
            <h2 className="text-2xl font-bold mb-8">Meet Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <div className="text-center transition-all duration-300 hover:scale-105">
                <div className="aspect-square relative rounded-full overflow-hidden w-40 h-40 mx-auto mb-4 border-4 border-primary/20 shadow-lg">
                  <Image src="/me.jpeg" alt="Kedhareswer Naidu" fill className="object-cover" />
                </div>
                <h3 className="font-semibold text-lg">Kedhareswer Naidu</h3>
                <p className="text-sm text-muted-foreground">Founder & CEO</p>
                <p className="mt-2 text-sm">ML Engineer and UI/UX Designer with expertise in computer vision and artistic design.</p>
                <div className="mt-4 space-x-2">
                  <Link href="#" className="text-sm text-primary hover:underline">LinkedIn</Link>
                  <span className="text-muted-foreground">•</span>
                  <Link href="#" className="text-sm text-primary hover:underline">GitHub</Link>
                </div>
              </div>

              <div className="text-center transition-all duration-300 hover:scale-105">
                <div className="aspect-square relative rounded-full overflow-hidden w-40 h-40 mx-auto mb-4 border-4 border-primary/20 shadow-lg">
                  <Image src="/suhail.jpg" alt="Mahamad Suhail" fill className="object-cover" />
                </div>
                <h3 className="font-semibold text-lg">Mahamad Suhail</h3>
                <p className="text-sm text-muted-foreground">Lead Developer</p>
                <p className="mt-2 text-sm">Lead Developer and UI/UX Designer specializing in web development and user experience.</p>
                <div className="mt-4 space-x-2">
                  <Link href="#" className="text-sm text-primary hover:underline">LinkedIn</Link>
                  <span className="text-muted-foreground">•</span>
                  <Link href="#" className="text-sm text-primary hover:underline">GitHub</Link>
                </div>
              </div>
            </div>
          </section>

          {/* Values */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-background rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold mb-3">Innovation</h3>
                <p className="text-muted-foreground">
                  We're constantly pushing the boundaries of what's possible with image transformation technology.
                </p>
              </div>

              <div className="bg-background rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold mb-3">Accessibility</h3>
                <p className="text-muted-foreground">
                  We believe powerful creative tools should be accessible to everyone, regardless of technical skill.
                </p>
              </div>

              <div className="bg-background rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold mb-3">Quality</h3>
                <p className="text-muted-foreground">
                  We're committed to delivering the highest quality transformations that truly capture the essence of
                  oil paintings.
                </p>
              </div>

              <div className="bg-background rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold mb-3">Community</h3>
                <p className="text-muted-foreground">
                  We value the feedback and contributions of our user community in shaping the future of ArtifyAI.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
            <div className="bg-muted/50 rounded-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 mr-3 text-primary" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-muted-foreground">hello@artifyai.com</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 mr-3 text-primary" />
                      <div>
                        <p className="font-medium">Address</p>
                        <p className="text-muted-foreground">123 Innovation Drive, Tech City, CA 94043</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 mr-3 text-primary" />
                      <div>
                        <p className="font-medium">Phone</p>
                        <p className="text-muted-foreground">+1 (555) 123-4567</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Send Us a Message</h3>
                  <p className="text-muted-foreground mb-4">Have questions or feedback? We'd love to hear from you!</p>
                  <Button asChild>
                    <Link href="mailto:hello@artifyai.com">
                      Contact Us <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div className="bg-background rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold mb-2">Is ArtifyAI free to use?</h3>
                <p className="text-muted-foreground">
                  Yes, ArtifyAI is currently free to use with basic features. We plan to introduce premium options in
                  the future for advanced features.
                </p>
              </div>
              <div className="bg-background rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold mb-2">How do you handle my uploaded images?</h3>
                <p className="text-muted-foreground">
                  We respect your privacy. Your images are processed securely and are not stored permanently on our
                  servers unless you explicitly choose to save them.
                </p>
              </div>
              <div className="bg-background rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold mb-2">Can I use the converted images commercially?</h3>
                <p className="text-muted-foreground">
                  Yes, you retain all rights to both your original images and the converted artwork. You're free to use
                  them for personal or commercial purposes.
                </p>
              </div>
              <div className="bg-background rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold mb-2">Do you offer API access for developers?</h3>
                <p className="text-muted-foreground">
                  We're currently developing an API for developers. If you're interested in integrating our technology
                  into your application, please contact us.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center">
            <h2 className="text-2xl font-bold mb-6">Ready to Transform Your Photos?</h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of users who are already creating stunning oil paint style artwork with ArtifyAI.
            </p>
            <Button asChild size="lg">
              <Link href="/convert">
                Try ArtifyAI Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </section>
        </div>
      </div>
    </div>
  )
}
