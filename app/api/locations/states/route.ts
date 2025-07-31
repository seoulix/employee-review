import { NextRequest, NextResponse } from "next/server";
import Database from "@/lib/database";
import { LocationModel } from "@/lib/models/location";

export async function GET() {
  try {
    const states = await LocationModel.getStatesWithStats()
    return NextResponse.json({ success: true, data: states })
  } catch (error) {
    console.error("Error fetching states:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch states" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    if (!data.name || !data.code) {
      return NextResponse.json({ success: false, error: "Name and code are required" }, { status: 400 })
    }

    const stateId = await LocationModel.createState({
      name: data.name,
      code: data.code,
      status: data.status || "Active",
    })

    return NextResponse.json({
      success: true,
      data: { id: stateId },
      message: "State created successfully",
    })
  } catch (error) {
    console.error("Error creating state:", error)
    return NextResponse.json({ success: false, error: "Failed to create state" }, { status: 500 })
  }
}
