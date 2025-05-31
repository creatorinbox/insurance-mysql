// lib/getUserFromCookie.ts
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export  async function getUserFromCookie() {
  const cookieStore = await cookies();  // await here
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded as { id: string; email: string; role: string };
  } catch {
    return null;
  }
}
