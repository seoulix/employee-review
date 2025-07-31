import { NextRequest, NextResponse } from "next/server";
import Database from "@/lib/database";

export async function GET(request: NextRequest, { params }) {
  const feedbackId = params.id;
  try {
    // 1. Get main feedback submission
    const feedback = await Database.queryOne(
      `SELECT * FROM feedback_submissions WHERE id = ?`,
      [feedbackId]
    );
    if (!feedback) {
      return NextResponse.json({ success: false, message: "Feedback not found" }, { status: 404 });
    }

    // 2. Get all feedback responses (deep feedback answers)
    const responses = await Database.query(
      `SELECT fr.question_id, fr.response_value, fq.question, fq.type
       FROM feedback_responses fr
       JOIN feedback_questions fq ON fr.question_id = fq.id
       WHERE fr.feedback_submission_id = ?`,
      [feedbackId]
    );

    return NextResponse.json({
      success: true,
      data: {
        feedback,
        responses, // array of {question_id, response_value, question, type}
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch feedback details" }, { status: 500 });
  }
}
