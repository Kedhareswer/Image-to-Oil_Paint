"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Loader2, Download, RefreshCw, Palette } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

interface ImageConverterProps {
  originalImage: string
  onReset: () => void
}

export default function ImageConverter({ originalImage, onReset }: ImageConverterProps) {
  const [convertedImage, setConvertedImage] = useState<string | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [intensity, setIntensity] = useState(50)
  const [brushSize, setBrushSize] = useState(50)
  const [colorVibrance, setColorVibrance] = useState(50)
  const { toast } = useToast()

  const convertImage = async () => {
    if (!originalImage) return

    setIsConverting(true)

    try {
      // Create a FormData object to send the image
      const formData = new FormData()

      // Convert the base64 image to a blob
      const response = await fetch(originalImage)
      const blob = await response.blob()
      formData.append("image", blob, "image.png")

      // Add conversion parameters
      formData.append("intensity", intensity.toString())
      formData.append("brushSize", brushSize.toString())
      formData.append("colorVibrance", colorVibrance.toString())

      // Call the API endpoint for image conversion
      const apiResponse = await fetch("/api/python-convert", {
        method: "POST",
        body: formData,
      })

      if (!apiResponse.ok) {
        throw new Error('API request failed')
      }

      const convertedImageBlob = await apiResponse.blob()
      const convertedImageUrl = URL.createObjectURL(convertedImageBlob)
      setConvertedImage(convertedImageUrl)

      toast({
        title: "Conversion complete!",
        description: "Your image has been transformed into oil paint style.",
      })
    } catch (error) {
      toast({
        title: "Conversion failed",
        description: "There was an error converting your image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsConverting(false)
    }
  }

  const downloadImage = () => {
    if (!convertedImage) return

    const link = document.createElement("a")
    link.href = convertedImage
    link.download = "artify-oil-painting.png"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div>
      {!convertedImage ? (
        <div className="mt-8">
          <div className="bg-background rounded-lg border p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Customize Your Oil Paint Style</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="intensity">Effect Intensity</Label>
                  <span className="text-sm text-muted-foreground">{intensity}%</span>
                </div>
                <Slider
                  id="intensity"
                  min={0}
                  max={100}
                  step={1}
                  value={[intensity]}
                  onValueChange={(value) => setIntensity(value[0])}
                />
                <p className="text-xs text-muted-foreground">Controls the overall strength of the oil paint effect</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="brushSize">Brush Size</Label>
                  <span className="text-sm text-muted-foreground">{brushSize}%</span>
                </div>
                <Slider
                  id="brushSize"
                  min={0}
                  max={100}
                  step={1}
                  value={[brushSize]}
                  onValueChange={(value) => setBrushSize(value[0])}
                />
                <p className="text-xs text-muted-foreground">Adjusts the size of brush strokes in the painting</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="colorVibrance">Color Vibrance</Label>
                  <span className="text-sm text-muted-foreground">{colorVibrance}%</span>
                </div>
                <Slider
                  id="colorVibrance"
                  min={0}
                  max={100}
                  step={1}
                  value={[colorVibrance]}
                  onValueChange={(value) => setColorVibrance(value[0])}
                />
                <p className="text-xs text-muted-foreground">Enhances the richness and saturation of colors</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button
              onClick={convertImage}
              disabled={isConverting || !originalImage}
              size="lg"
              className="w-full sm:w-auto"
            >
              {isConverting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Masterpiece...
                </>
              ) : (
                <>
                  <Palette className="mr-2 h-4 w-4" />
                  Transform to Oil Painting
                </>
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-center mb-6">Your Oil Paint Masterpiece</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-background rounded-lg p-4 border">
              <div className="aspect-square relative">
                <Image src={originalImage || "/placeholder.svg"} alt="Original image" fill className="object-contain" />
              </div>
              <div className="mt-4 text-center text-sm font-medium">Original Photo</div>
            </div>
            <div className="bg-background rounded-lg p-4 border">
              <div className="aspect-square relative">
                <Image
                  src={convertedImage || "/placeholder.svg"}
                  alt="Oil paint style"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="mt-4 text-center text-sm font-medium">Oil Paint Masterpiece</div>
            </div>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={downloadImage} className="flex-1 sm:flex-initial">
              <Download className="mr-2 h-4 w-4" />
              Download Artwork
            </Button>
            <Button variant="outline" onClick={onReset} className="flex-1 sm:flex-initial">
              <RefreshCw className="mr-2 h-4 w-4" />
              Create Another
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
