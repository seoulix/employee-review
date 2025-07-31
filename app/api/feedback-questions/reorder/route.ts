import { NextRequest, NextResponse } from "next/server";
import Database from "@/lib/database";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { questions } = data;

    // Update order for each question
    for (const question of questions) {
      await Database.update(
        `UPDATE feedback_questions SET order_index = ? WHERE id = ?`,
        [question.order_index, question.id]
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: "Question order updated successfully" 
    });
  } catch (error) {
    console.error("Error updating question order:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to update question order" 
    }, { status: 500 });
  }
} 