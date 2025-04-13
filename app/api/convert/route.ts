import { type NextRequest, NextResponse } from "next/server"
import { exec } from "child_process"
import { writeFile, readFile, mkdir } from "fs/promises"
import { join } from "path"
import { tmpdir } from "os"
import { v4 as uuidv4 } from "uuid"
import { promisify } from "util"

const execPromise = promisify(exec)

export async function POST(request: NextRequest) {
  try {
    // Get the image data from the request
    const formData = await request.formData()
    const imageFile = formData.get("image") as File

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

    const buffer = Buffer.from(await imageFile.arrayBuffer())
    await writeFile(inputPath, buffer)

    // Call the Python script to apply oil paint effect
    const scriptPath = join(process.cwd(), "scripts", "oil_paint_converter.py")
    const { stdout, stderr } = await execPromise(`python "${scriptPath}" "${inputPath}" "${outputPath}"`)
    
    if (stderr) {
      console.error("Python script error:", stderr)
      throw new Error("Failed to process image")
    }

    // Read the converted image
    const convertedImage = await readFile(outputPath)

    // Return the converted image
    return new NextResponse(convertedImage, {
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
