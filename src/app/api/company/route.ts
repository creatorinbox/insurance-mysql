import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";



export async function GET() {
  try {
    // ✅ Extract JWT token for authentication (optional)
    // const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];

    // if (!token) {
    //    return redirect("/signin");
    //   //return NextResponse.json({ error: "Unauthorized - Token missing" }, { status: 401 });
    // }

    // let user: { id: number; role: string };
    // try {
    //   user = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    //    if (!user) {
    //   return NextResponse.json({ error: "Unauthorized - User missing" }, { status: 401 });
    // }
    // } catch {
    //   return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    // }

    // ✅ Fetch company details from database
    const company = await prisma.companyBranding.findFirst({
      select: {
        companyName: true,
        planName: true,
        logoUrl: true,
        colorCode: true,
        kitName: true,
      },
    });

    // ✅ Handle case when no company data exists
    if (!company) {
      return NextResponse.json({ error: "Company details not found" }, { status: 404 });
    }

    return NextResponse.json(company, { status: 200 });
  } catch (error) {
    console.error("[GET_COMPANY_ERROR]", error);
    return NextResponse.json({ error: "Failed to fetch company details" }, { status: 500 });
  }
}
