import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async  function getUserFromCookie() {
 const cookieStore = await cookies();  // await here
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded; // contains { id, email, role }
  } catch {
    return null;
  }
}
