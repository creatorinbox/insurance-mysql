// app/api/me/route.ts
import { getUserFromTokenname } from "@/lib/getUserFromTokenname";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getUserFromTokenname();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json(user);
}
