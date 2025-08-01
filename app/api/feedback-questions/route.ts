import { type NextRequest, NextResponse } from "next/server"
import Database from "@/lib/database"

export async function GET() {
  try {
    const questions = await Database.query(`
SELECT 
fq.*,
  fq.id AS question_id,
  GROUP_CONCAT(owcq.outlet_id) AS outlet_ids
FROM feedback_questions fq
LEFT JOIN outlet_wise_custom_question owcq 
  ON fq.id = owcq.question_id
GROUP BY fq.id, fq.question
      ORDER BY order_index ASC
    `)

    
    const settings = await Database.queryOne(`
      SELECT lucky_draw_enabled, feedback_required 
      FROM feedback_settings 
      WHERE id = 1
    `)

    return NextResponse.json({
      success: true,
      questions,
      settings: settings || { lucky_draw_enabled: true, feedback_required: false },
    })
  } catch (error) {
    console.error("Error fetching feedback questions:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch questions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const outlet_ids = data.outlet_ids || []
   
    // Validate required fields
    if (!data.question || !data.type) {
      return NextResponse.json({ 
        success: false, 
        message: "Question text and type are required" 
      }, { status: 400 });
    }

    // Set default values for slider/star types
    let minValue = data.min_value;
    let maxValue = data.max_value;
    
    if (data.type === 'slider' || data.type === 'star') {
      minValue = data.min_value || 1;
      maxValue = data.max_value || 5;
    }

    const [{ next_order_index }] = await Database.query(`
      SELECT COALESCE(MAX(order_index), 0) + 1 AS next_order_index FROM feedback_questions
    `)

    const questionId = await Database.insert(
      `
      INSERT INTO feedback_questions (
        question, type, required, options, min_value, max_value, 
        placeholder, order_index, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        data.question,
        data.type,
        data.required || false,
        JSON.stringify(data.options || []),
        minValue,
        maxValue,
        data.placeholder || null,
        next_order_index,
        data.is_active !== false,
      ],
    )
    await Promise.all(
      outlet_ids.map(async (outlet_id:string)=>{
        await Database.query("INSERT INTO outlet_wise_custom_question (question_id,outlet_id) VALUES (?,?)",[questionId,outlet_id])
      })
    )

    return NextResponse.json({
      success: true,
      data: { id: questionId },
      message: "Question created successfully"
    })
  } catch (error) {
    console.error("Error creating feedback question:", error)
    return NextResponse.json({ success: false, message: "Failed to create question" }, { status: 500 })
  }
}
