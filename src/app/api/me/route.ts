import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return redirect("/signin");
    //return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.json({ user: decoded });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }
}
