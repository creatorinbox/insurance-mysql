import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: string;
  role: "SUPERADMIN" | "DISTRIBUTOR" | "DEALER";
}

export async function getUserFromToken(): Promise<JwtPayload | null> {
  const cookieStore = await cookies(); // ✅ await it!
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  } catch (error) {
    console.error("[TOKEN_VERIFY_FAILED]", error);
    return null;
  }
}
