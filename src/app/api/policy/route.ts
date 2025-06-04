import { prisma } from "@/lib/prisma";
//import { writeFile } from "fs/promises";
//import path from "path";
import {  NextResponse } from "next/server";
//import { ObjectId } from "mongodb";
//import jwt from "jsonwebtoken";
//import { getUserFromToken } from "@/lib/getUserFromToken";

// export async function POST(req: NextRequest) {
//   try {
//      const cookieHeader = req.headers.get("cookie");
//         const token = cookieHeader?.split("token=")[1]?.split(";")[0]?.trim();
    
//         if (!token) {
//           return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//         }
    
//         const user = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
//     const formData = await req.formData();
//     const userId = formData.get("userId")?.toString();
//     if (!userId) {
//       return NextResponse.json({ error: "Missing userId" }, { status: 400 });
//     }

//     //   const user = await prisma.user.findUnique({
//     //   where: { id: new ObjectId(userdata.id) }, // ✅ Fix here
//     // });
//     // if (!user) {
//     //   return NextResponse.json({ error: "Invalid user" }, { status: 404 });
//     // }

//     if (user.role === "CUSTOMER") {
//       return NextResponse.json({ error: "Customers cannot create policies" }, { status: 403 });
//     }

//     const file = formData.get("image") as File | null;
//     let imageUrl = "";

//     if (file && file.name) {
//       const bytes = await file.arrayBuffer();
//       const buffer = Buffer.from(bytes);
//       const uploadDir = "D:\\insurance_uploads";
//       const fileName = `${Date.now()}-${file.name}`;
//       const filePath = path.join(uploadDir, fileName);
//       await writeFile(filePath, buffer);
//       imageUrl = fileName;
//     }

//     const requestedStatus = formData.get("status")?.toString() || "pending";
//     const finalStatus = user.role === "SUPERADMIN" ? requestedStatus : "pending";

//     const newPolicy = await prisma.policy.create({
//       data: {
//         kitnumber: formData.get("kitnumber")?.toString() || "",
//         holder: formData.get("holder")?.toString() || "",
//         productname: formData.get("productname")?.toString() || "",
//         productid: formData.get("productid")?.toString() || "",
//         certificateno: formData.get("certificateno")?.toString() || "",
//         policyid: formData.get("policyid")?.toString() || "",
//         policynumber: formData.get("policynumber")?.toString() || "",
//         startDate: new Date(formData.get("startDate")?.toString() || new Date().toISOString()),
//         expiryDate: new Date(formData.get("expiryDate")?.toString() || new Date().toISOString()),
//         tier: formData.get("tier")?.toString() || "",
//         status: finalStatus,
//         insuranceType: formData.get("insuranceType")?.toString() || "",
//         imageUrl,
//         userId:user.id,
//       },
//     });

//     return NextResponse.json(newPolicy, { status: 201 });

//   } catch (error: any) {
//     console.error("[UPLOAD_POLICY_ERROR]", error?.message || error);
//     return NextResponse.json(
//       { error: error?.message || "Policy creation failed" },
//       { status: 500 }
//     );
//   }
// }
// export async function POST(req: Request) {
//   try {
//      const user = await getUserFromToken();
    
//         if (!user) {
//           return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
//         }
//     const body = await req.json();
//     const { category, invoiceAmount } = body;

//     const pricing = await prisma.policypricing.findFirst({
//       where: {
//         category,
//         minAmount: { lte: invoiceAmount },
//         maxAmount: { gte: invoiceAmount },
//       },
//     });

//     if (!pricing) {
//       return NextResponse.json({ error: "No pricing found" }, { status: 404 });
//     }

//     const newPolicy = await prisma.policy.create({
//       data: {
//         category,
//         invoiceAmount,
//         ew1Year: pricing.ew1Year,
//         ew2Year: pricing.ew2Year,
//         ew3Year: pricing.ew3Year,
//         adld: pricing.adld,
//         combo1Year: pricing.combo1Year,
//         slabMin: pricing.minAmount,
//         slabMax: pricing.maxAmount,
//         userId:user.id,
//       },
//     });

//     return NextResponse.json(newPolicy, { status: 201 });
//   } catch (err) {
//     console.error("[POLICY_CREATE_ERROR]", err);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }
export async function GET() {
  try {
    const policies = await prisma.policyPricing.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(policies, { status: 200 });
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("[POLICY_GET_ERROR]", err?.message || error);
    return NextResponse.json(
      { error: "Failed to fetch policies" },
      { status: 500 }
    );
  }
  
}