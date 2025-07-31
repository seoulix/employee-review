import { NextRequest, NextResponse } from "next/server";
import Database from "@/lib/database";
import sendMail from "./email/nodemailer";
import sendWhatsAppMessage from "./whatsapp/sendWhatsappMessage";

// GET - Fetch all notifications (optionally filter by user_id)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const feedback_id = searchParams.get("feedback_id");
    let feedback;
    
      feedback = await Database.queryOne(
        `SELECT * FROM feedback_submissions JOIN employees ON feedback_submissions.employee_id = employees.id WHERE feedback_submissions.id = ?`,
        [feedback_id]
      );
// Implement the nodemailer and whatsapp api here
const resutlSendMail = await sendMail(feedback.customer_name, feedback.customer_email, feedback.customer_phone, feedback.feedback_text, feedback);
const resultWhatsappAlert = await sendWhatsAppMessage(feedback.customer_name, feedback.customer_email, feedback.customer_phone, feedback.feedback_text, feedback);
    console.log(resutlSendMail);
    console.log(resultWhatsappAlert);
    return NextResponse.json({ success: true, data: feedback });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch notifications" }, { status: 500 });
  }
}