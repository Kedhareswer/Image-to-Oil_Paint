"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, X, Camera, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import ImageConverter from "@/components/image-converter"

export default function ConvertPage() {
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("upload")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (event) => {
          setOriginalImage(event.target?.result as string)
        }
        reader.readAsDataURL(file)
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (JPEG, PNG, etc.)",
          variant: "destructive",
        })
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setOriginalImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, etc.)",
        variant: "destructive",
      })
    }
  }

  const handleCameraCapture = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()

          // Wait a bit for camera to initialize
          setTimeout(() => {
            if (videoRef.current && canvasRef.current) {
              const canvas = canvasRef.current
              const context = canvas.getContext("2d")

              if (context) {
                canvas.width = videoRef.current.videoWidth
                canvas.height = videoRef.current.videoHeight
                context.drawImage(videoRef.current, 0, 0)

                const imageDataUrl = canvas.toDataURL("image/png")
                setOriginalImage(imageDataUrl)

                // Stop the camera stream
                const tracks = stream.getTracks()
                tracks.forEach((track) => track.stop())
                if (videoRef.current) {
                  videoRef.current.srcObject = null
                }
              }
            }
          }, 1000)
        }
      } else {
        toast({
          title: "Camera not available",
          description: "Your device doesn't support camera access or permission was denied.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Camera error",
        description: "Failed to access camera. Please check permissions.",
        variant: "destructive",
      })
    }
  }

  const resetImages = () => {
    setOriginalImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold">Transform Your Photos</h1>
          <p className="mt-4 text-muted-foreground">
            Upload your photo and watch it transform into a beautiful oil paint style artwork with enhanced texture and
            depth.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload Image</TabsTrigger>
            <TabsTrigger value="camera">Use Camera</TabsTrigger>
          </TabsList>
          <TabsContent value="upload" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div
                  className="border-2 border-dashed rounded-lg p-12 text-center hover:bg-muted/50 transition-colors cursor-pointer"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {!originalImage ? (
                    <div className="flex flex-col items-center">
                      <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">Drag & drop your image here</h3>
                      <p className="text-sm text-muted-foreground mt-2">or click to browse your files</p>
                      <p className="text-xs text-muted-foreground mt-4">Supports JPG, PNG, WEBP (max 10MB)</p>
                    </div>
                  ) : (
                    <div className="relative">
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 z-10"
                        onClick={(e) => {
                          e.stopPropagation()
                          resetImages()
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Image
                        src={originalImage || "/placeholder.svg"}
                        alt="Original image"
                        width={400}
                        height={400}
                        className="mx-auto max-h-[400px] w-auto object-contain"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="camera" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  {!originalImage ? (
                    <div>
                      <Button onClick={handleCameraCapture} className="mb-4">
                        <Camera className="mr-2 h-4 w-4" />
                        Take Photo
                      </Button>
                      <p className="text-sm text-muted-foreground">Click the button to take a photo with your camera</p>
                      <video ref={videoRef} className="mt-4 mx-auto max-h-[400px] w-auto hidden" />
                      <canvas ref={canvasRef} className="hidden" />
                    </div>
                  ) : (
                    <div className="relative">
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 z-10"
                        onClick={resetImages}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Image
                        src={originalImage || "/placeholder.svg"}
                        alt="Original image"
                        width={400}
                        height={400}
                        className="mx-auto max-h-[400px] w-auto object-contain"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {originalImage && <ImageConverter originalImage={originalImage} onReset={resetImages} />}

        <div className="mt-12 bg-muted/50 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <Info className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-lg">Tips for best results</h3>
              <ul className="mt-2 space-y-2 text-muted-foreground">
                <li>• Use clear, well-lit photos with good contrast</li>
                <li>• Portraits and landscapes work especially well</li>
                <li>• Images with distinct subjects and simple backgrounds produce the best results</li>
                <li>• Adjust the intensity sliders to fine-tune the oil paint effect</li>
                <li>• Try different brush sizes for varying artistic styles</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
