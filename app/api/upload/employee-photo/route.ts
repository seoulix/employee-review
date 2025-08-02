import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function POST(request: NextRequest) {
  try {
    console.log('📤 Employee photo upload request received');
    const formData = await request.formData()
    const file = formData.get("file") as File

    console.log('📄 File details:', {
      name: file?.name,
      size: file?.size,
      type: file?.type
    });

    if (!file) {
      console.log('❌ No file uploaded');
      return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        success: false, 
        message: "Invalid file type. Only JPEG, PNG, and WebP images are allowed." 
      }, { status: 400 })
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        success: false, 
        message: "File too large. Maximum size is 5MB." 
      }, { status: 400 })
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads")
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Create employees subdirectory
    const employeesDir = join(uploadsDir, "employees")
    if (!existsSync(employeesDir)) {
      await mkdir(employeesDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop()
    const fileName = `employee-photo-${timestamp}.${fileExtension}`
    const filePath = join(employeesDir, fileName)

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Return the public URL
    const publicUrl = `/uploads/employees/${fileName}`

    console.log('✅ Employee photo uploaded successfully:', {
      fileName,
      publicUrl,
      size: file.size,
      type: file.type
    });

    return NextResponse.json({
      success: true,
      data: {
        url: publicUrl,
        fileName: fileName,
        size: file.size,
        type: file.type
      },
      message: "Employee photo uploaded successfully"
    })

  } catch (error) {
    console.error("Error uploading employee photo:", error)
    return NextResponse.json({ 
      success: false, 
      message: "Error uploading employee photo" 
    }, { status: 500 })
  }
} 