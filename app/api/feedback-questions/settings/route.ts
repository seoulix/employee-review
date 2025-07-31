import { NextRequest, NextResponse } from "next/server";
import Database from "@/lib/database";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { lucky_draw_enabled, feedback_required } = data;

    // Update or insert feedback settings
    await Database.update(
      `INSERT INTO feedback_settings (id, lucky_draw_enabled, feedback_required) 
       VALUES (1, ?, ?) 
       ON DUPLICATE KEY UPDATE 
       lucky_draw_enabled = VALUES(lucky_draw_enabled),
       feedback_required = VALUES(feedback_required)`,
      [lucky_draw_enabled, feedback_required]
    );

    return NextResponse.json({ 
      success: true, 
      message: "Settings updated successfully" 
    });
  } catch (error) {
    console.error("Error updating feedback settings:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to update settings" 
    }, { status: 500 });
  }
} 