import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/getUserFromToken";
import { redirect } from "next/navigation";



export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie");
    const token = cookieHeader?.split("token=")[1]?.split(";")[0]?.trim();

    if (!token) {
                 return redirect("/signin");

    //  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const user = await getUserFromToken();
    if (!user) return redirect("/signin");
 const userId = parseInt(user.id, 10);
    let profile;
    if (user.role === "SUPERADMIN") {
      profile = await prisma.superadmin.findUnique({ where: { id: userId } });
    } else if (user.role === "DEALER") {
      profile = await prisma.dealer.findUnique({ where: { id: userId } });
    } else if (user.role === "DISTRIBUTOR") {
      profile = await prisma.distributor.findUnique({ where: { id: userId} });
    } else {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({ ...profile, role: user.role }); // ✅ Ensures role exists
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
