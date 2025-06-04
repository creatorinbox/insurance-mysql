import { PrismaClient, plan_role } from "@prisma/client";
//import { hash } from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const body = await req.json();
  //const hashedPassword = await hash(body.password, 10);
  
  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      password: body.password,
      mobile: body.mobile,
      role: body.role as plan_role,
      roleid:body.referenceId,
      status:  "ACTIVE", // or hardcode "ACTIVE" if you want
      updatedAt:new Date(),
    },
  });

  return Response.json(user);
}