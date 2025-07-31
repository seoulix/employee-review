import { NextRequest, NextResponse } from "next/server";
import { compare, hash} from "bcryptjs";
import { getAdminUserByEmail } from "@/lib/models/admin-user"; // You may need to create this helper
import { serialize } from "cookie";
import jwt from "jsonwebtoken"
export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  // Fetch user from DB
  const user = await getAdminUserByEmail(email);
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Compare password
  const isValid = await compare(password, user.password_hash);
  console.log("Password",password,isValid,await hash(password, 10))
  if (!isValid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Set a simple session cookie (for demo; use JWT or NextAuth for production)

  const token = jwt.sign(
    { userId: user.id, email: user.email, hassPass:user.password_hash},
    process.env.NEXT_PUBLIC_JWT_SECRET!
  );

  const res = NextResponse.json({ success: true,"authToken":token });
  // res.headers.set("authToken", token);
  return res;
}
