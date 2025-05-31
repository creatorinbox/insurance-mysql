import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log("✅ Middleware executing for", pathname);

  // Skip auth checks for public routes
  const publicPaths = ['/login',  '/api', '/_next', '/favicon.ico'];
  const isPublic = publicPaths.some((path) => pathname.startsWith(path));

  if (isPublic) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/:path*'],
};
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { getUserIfPasswordExpired } from "@/lib/getUserIfPasswordExpired";

// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   const publicPaths = ["/login", "/api", "/_next", "/favicon.ico"];
//   const isPublic = publicPaths.some((path) => pathname.startsWith(path));

//   if (isPublic) {
//     return NextResponse.next();
//   }

//   const token = request.cookies.get("token")?.value;

//   if (!token) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   // ✅ Skip password check for reset-password page itself
//   if (!pathname.startsWith("/reset-password")) {
//     const { expired } = await getUserIfPasswordExpired(token);

//     if (expired) {
//       return NextResponse.redirect(new URL("/reset-password", request.url));
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"], // Only protect app routes
// };
