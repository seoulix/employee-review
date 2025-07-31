import { type NextRequest, NextResponse } from "next/server"
import { BrandModel } from "@/lib/models/brand"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const brand = await BrandModel.getById(id)

    if (!brand) {
      return NextResponse.json({ success: false, error: "Brand not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: brand })
  } catch (error) {
    console.error("Error fetching brand:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch brand" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const data = await request.json()

    const affectedRows = await BrandModel.update(id, data)

    if (affectedRows === 0) {
      return NextResponse.json({ success: false, error: "Brand not found or no changes made" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Brand updated successfully",
    })
  } catch (error) {
    console.error("Error updating brand:", error)
    return NextResponse.json({ success: false, error: "Failed to update brand" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const affectedRows = await BrandModel.delete(id)

    if (affectedRows === 0) {
      return NextResponse.json({ success: false, error: "Brand not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Brand deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting brand:", error)
    return NextResponse.json({ success: false, error: "Failed to delete brand" }, { status: 500 })
  }
}
