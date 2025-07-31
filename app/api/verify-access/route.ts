// app/api/verify-token/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Database from "@/lib/database";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return NextResponse.json({ valid: false, error: "Missing token" }, { status: 401 });
  }

  try {
    const decoded =  jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET!);
    console.log(decoded)
    const verifyAdmin = await Database.query(
      `SELECT id, full_name,email, role FROM admin_users WHERE email = ? AND password_hash = ?`,
      [decoded.email, decoded.hassPass]
    );
    return NextResponse.json({ valid: true, user: {verifyAdmin} });
  } catch (err) {
    return NextResponse.json({ valid: false, error: "Invalid token" }, { status: 401 });
  }
}
