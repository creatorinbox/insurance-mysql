// app/api/me/route.ts
import { getUserFromTokenname } from "@/lib/getUserFromTokenname";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

export async function GET() {
  const user = await getUserFromTokenname();
  if (!user)  return redirect("/signin");
    ///return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json(user);
}
