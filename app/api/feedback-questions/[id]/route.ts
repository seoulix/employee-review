import { type NextRequest, NextResponse } from "next/server"
import Database from "@/lib/database"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()

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



await Promise.all(
  data.outlet_ids.map(async (outlet_id:string)=>{
    await Database.query("INSERT IGNORE INTO outlet_wise_custom_question (question_id,outlet_id) VALUES (?,?)",[params.id,outlet_id])
  })
)

    await Database.update(
      `
      UPDATE feedback_questions SET
        question = ?, type = ?, required = ?, options = ?,
        min_value = ?, max_value = ?, placeholder = ?, is_active = ?
      WHERE id = ?
    `,
      [
        data.question,
        data.type,
        data.required || false,
        JSON.stringify(data.options || []),
        minValue,
        maxValue,
        data.placeholder || null,
        data.is_active !== false,
        params.id,
      ],
    )

    return NextResponse.json({ 
      success: true, 
      message: "Question updated successfully" 
    })
  } catch (error) {
    console.error("Error updating feedback question:", error)
    return NextResponse.json({ success: false, message: "Failed to update question" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await Database.delete(`DELETE FROM feedback_questions WHERE id = ?`, [params.id])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting feedback question:", error)
    return NextResponse.json({ success: false, message: "Failed to delete question" }, { status: 500 })
  }
}
