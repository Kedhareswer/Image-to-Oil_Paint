import { type NextRequest, NextResponse } from "next/server"
import { writeFile, readFile, mkdir, unlink } from "fs/promises"
import { join } from "path"
import { tmpdir } from "os"
import { v4 as uuidv4 } from "uuid"
import { spawn } from "child_process"

// Environment configuration
const pythonPath = process.env.PYTHON_PATH || 'python'
const tempDirBase = process.env.TEMP_DIR || tmpdir()
const debugMode = process.env.DEBUG_MODE === 'true'

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

    // Create a unique ID for this conversion
    const id = uuidv4()

    // Create temp directory for processing
    const tempDir = join(tempDirBase, "artifyai", id)
    
    if (debugMode) {
      console.log("Processing image with parameters:", {
        intensity,
        brushSize,
        colorVibrance,
        tempDir
      })
    }
    
    try {
      await mkdir(tempDir, { recursive: true })
    } catch (mkdirError) {
      console.error("Failed to create temp directory:", mkdirError)
      return NextResponse.json({ 
        error: "Failed to create temporary directory", 
        details: mkdirError instanceof Error ? mkdirError.message : String(mkdirError) 
      }, { status: 500 })
    }

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

    // Run the Python script with parameters
    await new Promise((resolve, reject) => {
      const pythonProcess = spawn(pythonPath, [
        scriptPath,
        inputPath,
        outputPath,
        radius.toString(),
        effectIntensity.toString(),
        brushCount.toString(),
        colorVibranceValue.toString() // Convert to string for command line argument
      ])

      // Capture stdout and stderr
      let stdoutData = "";
      let stderrData = "";
      
      pythonProcess.stdout.on("data", (data) => {
        stdoutData += data.toString();
        if (debugMode) {
          console.log("Python script output:", data.toString());
        }
      });
      
      pythonProcess.stderr.on("data", (data) => {
        stderrData += data.toString();
        console.error("Python script error:", data.toString());
      });

      pythonProcess.on("error", (err) => {
        console.error("Failed to start Python process:", err);
        reject(err);
      });
      
      // Set a timeout to prevent hanging processes
      const timeout = setTimeout(() => {
        pythonProcess.kill();
        reject(new Error("Python process timed out after 30 seconds"));
      }, 30000); // 30 second timeout

      pythonProcess.on("exit", (code) => {
        clearTimeout(timeout);
        if (code === 0) {
          resolve(null);
        } else {
          reject(new Error(`Process exited with code ${code}${stderrData ? ': ' + stderrData.trim() : ''}`));
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
    
    // Log more details about the environment
    console.error("Environment:", {
      cwd: process.cwd(),
      tempDir: tempDirBase,
      nodeEnv: process.env.NODE_ENV,
      pythonPath
    })
    
    return NextResponse.json({ 
      error: "Failed to process image", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 })
  }
}
