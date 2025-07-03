import { prisma } from "@/lib/prisma"; // update path if needed
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

// Replace this with your real JWT secret
//const JWT_SECRET = process.env.JWT_SECRET!;
interface JwtPayload {
  id: number;
  role: string;
  // any other fields you embed in the token
}
export async function POST(req: Request) {
  const { name, email, mobile, password } = await req.json();

  if (!email || !mobile || !name || !password) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }
const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];
   
     if (!token) {
             return redirect("/signin");
      
      // return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
     }
   
     let user: { id: number; role: string };
     try {
       user = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
         if (!user) {
      return NextResponse.json({ error: "Unauthorized - User missing" }, { status: 401 });
    }
     } catch {
       return NextResponse.json({ message: "Invalid token" }, { status: 403 });
     }
  // Check if email or mobile already exists
  const existing = await prisma.userMeta.findFirst({
    where: {
      OR: [{ email }, { mobile }],
    },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Email or mobile already registered" },
      { status: 409 }
    );
  }

  // Insert user
  const userdata = await prisma.userMeta.create({
    data: { name:name, email:email, mobile:mobile, password:password, role:'DEALER', roleId:user.id, subuser:"1" }, // consider hashing password
  });

  return NextResponse.json({ message: "User created", userdata });
}
