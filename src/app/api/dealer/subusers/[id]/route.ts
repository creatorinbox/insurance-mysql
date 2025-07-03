import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.userMeta.findUnique({
      where: { id: parseInt(params.id, 10) },
    });

    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(user);
  } catch (error) {
        console.error("[UPDATE_SUBUSER_ERROR]", error);

    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);

    await prisma.userMeta.delete({ where: { id } });

    return NextResponse.json({ message: "User deleted" }, { status: 200 });
  } catch (error) {
    console.error("[DELETE_SUBUSER_ERROR]", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);
    const body = await req.json();

    const updated = await prisma.userMeta.update({
      where: { id },
      data: {
        name: body.name,
        email: body.email,
        mobile: body.mobile,
        city: body.city,
        state: body.state,
        pincode: body.pincode,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[UPDATE_SUBUSER_ERROR]", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}