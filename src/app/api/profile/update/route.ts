import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/getUserFromToken";
//import { redirect } from "next/navigation";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const user = await getUserFromToken();
    if (!user) return NextResponse.redirect(new URL("/signin", req.url));

    const userId = parseInt(user.id, 10);

    const form = await req.formData(); // ✅ use formData() instead of json()

    const file = form.get("image") as File | null;

  const activeRaw = form.get("active");
const isActive = activeRaw === "true"; 
    let profileImage = "";
    if (file && file.name) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), "public", "uploads");
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = path.join(uploadDir, fileName);

      await writeFile(filePath, buffer);
      profileImage = `/uploads/${fileName}`;
    }

    // ✅ Build update data safely
const updateFields: Record<string, string | number | boolean> = {};    form.forEach((value, key) => {
      if (key !== "image") {
        updateFields[key] = value.toString();
      }
    });

    if (profileImage) updateFields.profileImage = profileImage;
updateFields.active = isActive;
["userId", "plan"].forEach((key) => {
  if (key in updateFields) {
    updateFields[key] = parseInt(updateFields[key] as string);
  }
});
    // ✅ Update the correct table based on role
    let updatedProfile;
    if (user.role === "SUPERADMIN") {
      updatedProfile = await prisma.superadmin.update({
        where: { id: userId },
        data: updateFields,
      });
      
    } else if (user.role === "DEALER") {
      updatedProfile = await prisma.dealer.update({
        where: { id: userId },
        data: updateFields,
      });
    } else if (user.role === "DISTRIBUTOR") {
      updatedProfile = await prisma.distributor.update({
        where: { id: userId },
        data: updateFields,
      });

    } else {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }
  await prisma.userMeta.updateMany({
    where: { roleId: userId },
    data: {
      name: updateFields.name as string,
      email: updateFields.email as string,
      city: updateFields.city as string,
      state: updateFields.state as string,
    },
  });
    return NextResponse.json(updatedProfile);
  } catch (error) {
const err = error as Error | null;
console.error("Error updating profile:", err?.message || error);    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
