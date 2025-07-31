import { NextRequest, NextResponse } from "next/server";
import Database from "@/lib/database";

// GET - Fetch all notifications (optionally filter by user_id)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");
    let notifications;
    if (userId) {
      notifications = await Database.query(
        `SELECT * FROM notification_logs WHERE user_id = ? ORDER BY created_at DESC`,
        [userId]
      );
    } else {
      notifications = await Database.query(
        `SELECT * FROM notification_logs WHERE is_read =  ORDER BY created_at DESC`
      );
    }
    return NextResponse.json({ success: true, data: notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch notifications" }, { status: 500 });
  }
}

// POST - Create a new notification log
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    // Required fields: user_id, title, message, type
    if (!data.user_id || !data.title || !data.message || !data.type) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }
    await Database.insert(
      `INSERT INTO notifications (user_id, title, message, type, is_read, created_at) VALUES (?, ?, ?, ?, 0, CURRENT_TIMESTAMP)`,
      [data.user_id, data.title, data.message, data.type]
    );
    return NextResponse.json({ success: true, message: "Notification created" });
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json({ success: false, message: "Failed to create notification" }, { status: 500 });
  }
}
