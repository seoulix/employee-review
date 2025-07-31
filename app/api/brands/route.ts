import { type NextRequest, NextResponse } from "next/server"
import { BrandModel } from "@/lib/models/brand"

export async function GET() {
  try {
    const brands = await BrandModel.getBrandsWithStats()
    return NextResponse.json({ success: true, data: brands })
  } catch (error) {
    console.error("Error fetching brands:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch brands" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.description) {
      return NextResponse.json({ success: false, error: "Name and description are required" }, { status: 400 })
    }

    const brandId = await BrandModel.create({
      name: data.name,
      description: data.description,
      logo_url: data.logo_url,
      status: data.status || "Active",
    })

    return NextResponse.json({
      success: true,
      data: { id: brandId },
      message: "Brand created successfully",
    })
  } catch (error) {
    console.error("Error creating brand:", error)
    return NextResponse.json({ success: false, error: "Failed to create brand" }, { status: 500 })
  }
}
