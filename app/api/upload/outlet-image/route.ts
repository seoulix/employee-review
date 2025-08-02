import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ 
        success: false, 
        message: "No file uploaded" 
      }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        success: false, 
        message: "Only JPEG, PNG, and WebP images are allowed" 
      }, { status: 400 })
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        success: false, 
        message: "File size must be less than 5MB" 
      }, { status: 400 })
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads")
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Create outlets directory
    const outletsDir = join(uploadsDir, "outlets")
    if (!existsSync(outletsDir)) {
      await mkdir(outletsDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const fileExtension = file.name.split(".").pop()
    const fileName = `outlet-image-${timestamp}.${fileExtension}`

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filePath = join(outletsDir, fileName)
    await writeFile(filePath, buffer)

    // Return public URL
    const publicUrl = `/uploads/outlets/${fileName}`

    return NextResponse.json({
      success: true,
      data: {
        url: publicUrl,
        fileName: fileName
      },
      message: "Outlet image uploaded successfully"
    })
  } catch (error) {
    console.error("Error uploading outlet image:", error)
    return NextResponse.json({ 
      success: false, 
      message: "Failed to upload outlet image" 
    }, { status: 500 })
  }
} 