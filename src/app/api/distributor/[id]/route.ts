import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: number;
  role: string;
}

export async function PUT(req: NextRequest) {
  try {
    // ✅ Extract JWT token from cookies
    const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized - Token missing" }, { status: 401 });
    }

    let user: { id: number; role: string };
    try {
      user = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        if (!user) {
      return NextResponse.json({ error: "Unauthorized - User missing" }, { status: 401 });
    }
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    // ✅ Extract distributor ID from URL
    const distributorId = req.nextUrl.pathname.split("/").pop();
    if (!distributorId || isNaN(parseInt(distributorId, 10))) {
      return NextResponse.json({ error: "Distributor ID must be a number" }, { status: 400 });
    }

    const body = await req.json();

    // ✅ Check if distributor exists before updating
    const existingDistributor = await prisma.distributor.findUnique({
      where: { id: parseInt(distributorId, 10) },
    });

    if (!existingDistributor) {
      return NextResponse.json({ error: "Distributor not found" }, { status: 404 });
    }

    // ✅ Function to safely retrieve form data or keep existing values
    const safeGet = (field: keyof typeof existingDistributor) => {
      return body[field] !== undefined ? body[field] : existingDistributor[field];
    };

    // ✅ Collect Updated Fields
    const updatedData = {
      name: safeGet("name"),
      email: safeGet("email"),
      mobile: safeGet("mobile"),
      address: safeGet("address"),
      city: safeGet("city"),
      state: safeGet("state"),
      pinCode: safeGet("pinCode"),
      gstNumber: safeGet("gstNumber"),
      contactPerson: safeGet("contactPerson"),
      contactMobile: safeGet("contactMobile"),
      region: safeGet("region"),
      active: safeGet("active"),
      status: safeGet("status"),
      plan: safeGet("plan"),
      updatedAt: new Date(), // ✅ Ensure timestamp updates on every modification
    };

    // ✅ Perform Update
    const updatedDistributor = await prisma.distributor.update({
      where: { id: parseInt(distributorId, 10) },
      data: updatedData,
    });

    return NextResponse.json(updatedDistributor, { status: 200 });
  } catch (error) {
    console.error("[UPDATE_DISTRIBUTOR_ERROR]", error);
    return NextResponse.json({ error: "Distributor update failed" }, { status: 500 });
  }
}
export async function GET(req: NextRequest) {
  try {
    // ✅ Extract JWT token from cookie
    // const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];

    // if (!token) {
    //   return NextResponse.json({ error: "Unauthorized - Token missing" }, { status: 401 });
    // }

    // let user: { id: number; role: string };
    // try {
    //   user = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    // } catch {
    //   return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    // }

    // ✅ Extract dealer ID from the request URL
    const dealerId = req.nextUrl.pathname.split("/").pop();
    if (!dealerId || isNaN(parseInt(dealerId, 10))) {
      return NextResponse.json({ error: "Dealer ID is required and must be a number" }, { status: 400 });
    }

    // ✅ Retrieve dealer details from the database
    const dealer = await prisma.distributor.findUnique({
      where: { id: parseInt(dealerId, 10) },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        address: true,
        city: true,
        state: true,
        pinCode: true,
        gstNumber: true,
        contactPerson: true,
        contactMobile: true,
        region: true,
        plan: true,
      },
    });

    // ✅ Handle dealer not found
    if (!dealer) {
      return NextResponse.json({ error: "Dealer not found" }, { status: 404 });
    }

    return NextResponse.json(dealer, { status: 200 });
  } catch (error) {
    console.error("[GET_DEALER_ERROR]", error);
    return NextResponse.json({ error: "Failed to fetch dealer" }, { status: 500 });
  }
}
