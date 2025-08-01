import { type NextRequest,NextResponse } from "next/server";
import { Database } from "@/lib/database";

export async function GET(request: NextRequest) {
    const {searchParams} = new URL(request.url);
    const selection = searchParams.get("selection");
    const res = await Database.query(`SELECT ${selection} FROM feedback_settings`);
    return NextResponse.json({success:true,data:res});
}

export async function POST(request: NextRequest) {
    const {expiry_time,expiry_format} = await request.json();
    const res = await Database.query(`UPDATE feedback_settings SET expiry_time = ?, expiry_format = ?`,[expiry_time,expiry_format]);
    return NextResponse.json({success:true,data:res});
}