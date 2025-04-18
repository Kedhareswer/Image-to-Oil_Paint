import { type NextRequest, NextResponse } from "next/server"
import { writeFile, readFile, mkdir, unlink } from "fs/promises"
import { join } from "path"
import { tmpdir } from "os"
import { v4 as uuidv4 } from "uuid"
import { spawn } from "child_process"

const TIMEOUT_MS = 30000; // 30 second timeout

export async function POST(request: NextRequest) {
  try {
    // Get the image data and parameters from the request
    const formData = await request.formData()
    const imageFile = formData.get("image") as File
    const intensity = formData.get("intensity") as string
    const brushSize = formData.get("brushSize") as string
    const colorVibrance = formData.get("colorVibrance") as string

    // Validate image size
    if (imageFile.size > 10 * 1024 * 1024) { // 10MB limit
      return NextResponse.json({ error: "Image too large. Maximum size is 10MB" }, { status: 400 })
    }

    if (!imageFile) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // Create a unique ID for this conversion
    const id = uuidv4()

    // Create temp directory for processing
    const tempDir = join(tmpdir(), "artifyai", id)
    await mkdir(tempDir, { recursive: true })

    // Save the uploaded image to the temp directory
    const inputPath = join(tempDir, "input.png")
    const outputPath = join(tempDir, "output.png")
    const scriptPath = join(process.cwd(), "scripts", "oil_paint_converter.py")

    // Write the input image to disk
    const bytes = await imageFile.arrayBuffer()
    await writeFile(inputPath, Buffer.from(bytes))

    // Calculate parameters for the Python script
    const radius = Math.max(3, Math.floor(parseInt(brushSize) / 20)) // Convert 0-100 to reasonable brush size
    const effectIntensity = Math.max(5, Math.floor(parseInt(intensity) / 10)) // Convert 0-100 to reasonable intensity
    const brushCount = 20 // Fixed brush count for consistent results
    const colorVibranceValue = Math.max(1, Math.min(200, parseInt(colorVibrance) || 100)) // Convert to number with default 100

    // Run the Python script with parameters and timeout
    await new Promise((resolve, reject) => {
      const process = spawn("python", [
        scriptPath,
        inputPath,
        outputPath,
        radius.toString(),
        effectIntensity.toString(),
        brushCount.toString(),
        colorVibranceValue.toString()
      ])

      // Set timeout
      const timeoutId = setTimeout(() => {
        process.kill()
        reject(new Error("Processing timeout exceeded"))
      }, TIMEOUT_MS)

      // Capture stdout and stderr
      let stdoutData = "";
      let stderrData = "";
      
      process.stdout.on("data", (data) => {
        stdoutData += data.toString();
      });
      
      process.stderr.on("data", (data) => {
        stderrData += data.toString();
        console.error("Python script error:", data.toString());
      });

      process.on("error", (err) => {
        reject(err)
      })

      process.on("exit", (code) => {
        if (code === 0) {
          resolve(null)
        } else {
          reject(new Error(`Process exited with code ${code}${stderrData ? ': ' + stderrData.trim() : ''}`))
        }
      })
    })

    // Read the output image
    const outputBuffer = await readFile(outputPath)

    // Clean up temporary files
    await Promise.all([
      unlink(inputPath),
      unlink(outputPath)
    ])

    // Return the converted image
    return new NextResponse(outputBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (error) {
    console.error("Error processing image:", error)
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 })
  }
}
