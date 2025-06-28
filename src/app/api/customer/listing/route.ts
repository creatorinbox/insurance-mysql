// import { prisma } from "@/lib/prisma";
// import { NextResponse } from "next/server";
// export async function GET() {
//     try{
//     const customers = await prisma.customer.findMany();
//     return NextResponse.json(customers);
// } catch (error: unknown) {
//     const err = error as { message?: string };
//     console.error("[customers_GET_ERROR]", err?.message || error);
//     return NextResponse.json(
//       { error: "Failed to fetch customers" },
//       { status: 500 }
//     );
//   }
//   }
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie");
    const token = cookieHeader?.split("token=")[1]?.split(";")[0]?.trim();

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      role: string;
    };

    let customers;

    if (user.role === "SUPERADMIN") {
      // 🧑‍💼 Fetch all customers
      customers = await prisma.customer.findMany();
    } else if (user.role === "DEALER") {
      // 🧾 Only customers created by the current dealer
      customers = await prisma.customer.findMany({
        where: {
          userId: parseInt(user.id, 10),
        },
      });
    } else {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(customers);
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("[customers_GET_ERROR]", err?.message || error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}
