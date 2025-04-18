import { type NextRequest, NextResponse } from "next/server"
import { writeFile, readFile, mkdir, unlink } from "fs/promises"
import { join } from "path"
import { tmpdir } from "os"
import { v4 as uuidv4 } from "uuid"
import { spawn } from "child_process"

export async function POST(request: NextRequest) {
  let tempDir: string | undefined;
  let inputPath: string | undefined;
  let outputPath: string | undefined;

  try {
    // Get the image data and parameters from the request
    const formData = await request.formData()
    const imageFile = formData.get("image") as File
    const intensity = formData.get("intensity") as string
    const brushSize = formData.get("brushSize") as string
    const colorVibrance = formData.get("colorVibrance") as string

    // Validate input parameters
    if (!imageFile) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // Validate file type and size
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(imageFile.type)) {
      return NextResponse.json({ error: "Invalid image format. Supported formats: JPG, PNG, WebP" }, { status: 400 })
    }

    const maxSize = 10 * 1024 * 1024 // 10MB
    if (imageFile.size > maxSize) {
      return NextResponse.json({ error: "Image size exceeds 10MB limit" }, { status: 400 })
    }

    // Create a unique ID for this conversion
    const id = uuidv4()

    // Create temp directory for processing
    tempDir = join(tmpdir(), "artifyai", id)
    await mkdir(tempDir, { recursive: true })

    // Save the uploaded image to the temp directory
    inputPath = join(tempDir, "input.png")
    outputPath = join(tempDir, "output.png")
    const scriptPath = join(process.cwd(), "scripts", "oil_paint_converter.py")

    // Write the input image to disk
    const bytes = await imageFile.arrayBuffer()
    await writeFile(inputPath, Buffer.from(bytes))

    // Calculate parameters for the Python script
    const radius = Math.max(3, Math.floor(parseInt(brushSize) / 20)) // Convert 0-100 to reasonable brush size
    const effectIntensity = Math.max(5, Math.floor(parseInt(intensity) / 10)) // Convert 0-100 to reasonable intensity
    const brushCount = 20 // Fixed brush count for consistent results
    const colorVibranceValue = Math.max(1, Math.min(200, parseInt(colorVibrance) || 100)) // Convert to number with default 100

    // Run the Python script with parameters
    await new Promise<void>((resolve, reject) => {
      const process = spawn("python", [
        scriptPath,
        inputPath!,
        outputPath!,
        radius.toString(),
        effectIntensity.toString(),
        brushCount.toString(),
        colorVibranceValue.toString() // Convert to string for command line argument
      ], { stdio: ['ignore', 'pipe', 'pipe'] }); // Ensure stdio streams are available

      // Capture stdout and stderr
      let stdoutData = "";
      let stderrData = "";
      
      process.stdout?.on("data", (data: Buffer) => {
        stdoutData += data.toString();
      });
      
      process.stderr?.on("data", (data: Buffer) => {
        stderrData += data.toString();
        console.error("Python script error:", data.toString());
      });

      process.on("error", (err: Error) => {
        reject(err)
      })

      process.on("exit", (code: number) => {
        if (code === 0) {
          resolve()
        } else {
          reject(new Error(`Process exited with code ${code}${stderrData ? ': ' + stderrData.trim() : ''}`))
        }
      })
    })

    // Read the output image
    const outputBuffer = await readFile(outputPath!)

    // Clean up temporary files
    await Promise.all([
      unlink(inputPath!),
      unlink(outputPath!)
    ])

    // Return the converted image with optimized headers
    return new NextResponse(outputBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Length": outputBuffer.length.toString(),
        "Accept-Ranges": "bytes",
        "Vary": "Accept",
        "X-Content-Type-Options": "nosniff"
      },
    })
  } catch (error) {
    console.error("Error processing image:", error)
    let errorMessage = "Failed to process image"
    let statusCode = 500

    if (error instanceof Error) {
      if (error.message.includes("Python script")) {
        errorMessage = "Image processing failed"
      } else if (error.message.includes("ENOENT")) {
        errorMessage = "Required resources not found"
        statusCode = 503
      }
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode })
  } finally {
    // Ensure cleanup of temporary directory
    try {
      if (tempDir) {
        await Promise.all([
          unlink(inputPath!).catch(() => {}),
          unlink(outputPath!).catch(() => {})
        ])
      }
    } catch {}
  }
}
