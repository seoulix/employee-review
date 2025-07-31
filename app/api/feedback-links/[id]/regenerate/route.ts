import { NextRequest, NextResponse } from "next/server";
import Database from "@/lib/database";

// POST - Regenerate feedback link token
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;

    // Generate new unique token
    const newToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const baseUrl = process.env.APP_URL || 'http://localhost:3000';
    const newUrl = `${baseUrl}/outlet/feedback/${newToken}`;

    // Update the feedback link with new token
    await Database.update(
      `UPDATE feedback_links SET 
        token = ?, 
        url = ?, 
        created_at = NOW() 
       WHERE id = ?`,
      [newToken, newUrl, id]
    );

    return NextResponse.json({ 
      success: true, 
      data: { id: parseInt(id), token: newToken, url: newUrl },
      message: "Token regenerated successfully" 
    });
  } catch (error) {
    console.error("Error regenerating token:", error);
    return NextResponse.json({ success: false, message: "Failed to regenerate token" }, { status: 500 });
  }
}
