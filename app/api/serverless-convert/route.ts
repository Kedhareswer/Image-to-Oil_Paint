import { type NextRequest, NextResponse } from "next/server"

// Serverless function URL - replace with your actual deployed Lambda function URL
const SERVERLESS_FUNCTION_URL = process.env.SERVERLESS_FUNCTION_URL || "https://your-lambda-function-url.amazonaws.com/default/oil-paint-converter"

export async function POST(request: NextRequest) {
  try {
    // Get the image data and parameters from the request
    const formData = await request.formData()
    const imageFile = formData.get("image") as File
    const intensity = formData.get("intensity") as string
    const brushSize = formData.get("brushSize") as string
    const colorVibrance = formData.get("colorVibrance") as string
    
    if (!imageFile) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }
    
    // Convert image to base64
    const bytes = await imageFile.arrayBuffer()
    const base64Image = Buffer.from(bytes).toString('base64')
    
    console.log("Calling serverless function with parameters:", {
      intensity,
      brushSize,
      colorVibrance,
      imageSize: bytes.byteLength
    })
    
    // Call external API with the image and parameters
    const response = await fetch(SERVERLESS_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: base64Image,
        intensity: parseInt(intensity),
        brushSize: parseInt(brushSize),
        colorVibrance: parseInt(colorVibrance)
      })
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error("Serverless function error:", errorText)
      throw new Error(`External API request failed: ${response.status} ${response.statusText}`)
    }
    
    // Get the processed image back
    const responseData = await response.json()
    
    if (!responseData.image) {
      throw new Error('Invalid response from serverless function')
    }
    
    // Convert base64 back to buffer
    const processedImageData = Buffer.from(responseData.image, 'base64')
    
    // Return the converted image
    return new NextResponse(processedImageData, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (error) {
    console.error("Error processing image:", error)
    return NextResponse.json({ 
      error: "Failed to process image", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 })
  }
}