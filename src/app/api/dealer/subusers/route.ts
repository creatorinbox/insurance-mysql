import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/getUserFromToken";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getUserFromToken();

    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subUsers = await prisma.userMeta.findMany({
      where: {
        roleId: parseInt(user.id,10),
        subuser: "1",
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(subUsers);
  } catch (error) {
    console.error("[GET_SUBUSER_LIST_ERROR]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
