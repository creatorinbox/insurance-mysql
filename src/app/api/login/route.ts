// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import jwt from "jsonwebtoken";

// export async function POST(req: Request) {
//   const body = await req.json();
// // console.log('hj',body);
// //  const response1 = NextResponse.json({ message: "Login successful" });
// // return response1;
//     //const { email, password } = body || {};
//   const { email, password, role } = body || {};

//   let user = null;

//   switch (role) {
//     case "DEALER":
//       user = await prisma.dealer.findUnique({ where: { email } });
//       break;
//     case "DISTRIBUTOR":
//       user = await prisma.distributor.findUnique({ where: { email } });
//       break;
//     case "SUPERADMIN":
//        user = await prisma.superadmin.findUnique({
//       where: { email },
//     });

  
//       // user = await prisma.superadmin.findUnique({ where: { email } });
//        break;
//     default:
//       return NextResponse.json({ message: "Invalid role" }, { status: 400 });
//   }

//    if (!user || user.password !== password) {
//       return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
//     }


//   const token = jwt.sign(
//     { id: user.id, email: user.email, role: role },
//     process.env.JWT_SECRET!,
//     { expiresIn: "2h" }
//   );

//   const response = NextResponse.json({ message: "Login successful" });

//   // Save token (which includes user id) as httpOnly cookie
//   response.cookies.set("token", token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "lax",
//     path: "/",
//   });

//   return response;
// }
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body || {};

  // Step 1: Look up user in the userMeta table
  const meta = await prisma.userMeta.findFirst({
    where: {
      email
    }
  });

  if (!meta || meta.password !== password) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Step 2: Sign JWT
  const token = jwt.sign(
    { id: meta.roleId, email: meta.email, role: meta.role, name:meta.name,subuser:meta.subuser },
    process.env.JWT_SECRET!,
    { expiresIn: "2h" }
  );

  // Step 3: Send response with cookie
  const response = NextResponse.json({ message: "Login successful" });
  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/"
  });

  return response;
}
