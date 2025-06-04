// import UserAddressCard from "@/components/user-profile/UserAddressCard";
// import UserInfoCard from "@/components/user-profile/UserInfoCard";
// import UserMetaCard from "@/components/user-profile/UserMetaCard";
// import { Metadata } from "next";
// import React from "react";

// export const metadata: Metadata = {
//   title: "Next.js Profile | TailAdmin - Next.js Dashboard Template",
//   description:
//     "This is Next.js Profile page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
// };

// export default function Profile() {
//   return (
//     <div>
//       <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
//         <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
//           Profile
//         </h3>
//         <div className="space-y-6">
//           <UserMetaCard />
//           <UserInfoCard />
//           <UserAddressCard />
//         </div>
//       </div>
//     </div>
//   );
// }
// app/profile/page.tsx
import { getUserFromToken } from "@/lib/getUserFromToken";
import { prisma } from "@/lib/prisma";
import type { dealer, distributor, superadmin } from "@prisma/client";

export default async function ProfilePage() {
  const user = await getUserFromToken();
  if (!user) {
    return <div className="p-6 text-red-600">Unauthorized</div>;
  }

let userData: dealer | distributor | superadmin | null = null;  if (user.role === "DEALER") {
    userData = await prisma.dealer.findUnique({ where: { id: parseInt(user.id,10) } });
  } else if (user.role === "DISTRIBUTOR") {
    userData = await prisma.distributor.findUnique({ where: { id: parseInt(user.id,10)} });
  } else if (user.role === "SUPERADMIN") {
    userData = await prisma.superadmin.findUnique({ where: { id: parseInt(user.id,10) } });
  }

  return (
 <div className="p-6">
  <h1 className="text-xl font-bold mb-4">My Profile</h1>
  <div className="space-y-2">
    <p>
      <strong>Name:</strong>{" "}
      {user.role === "DEALER" && userData && "dealerName" in userData
        ? userData.dealerName
        : user.role === "DISTRIBUTOR" && userData && "name" in userData
        ? userData.name
        : user.role === "SUPERADMIN" && userData && "name" in userData
        ? userData.name
        : "Unknown"}
    </p>
    <p><strong>Email:</strong> {userData?.email}</p>
    <p><strong>Role:</strong> {user.role}</p>
  </div>

  <div className="mt-6 space-x-4">
    <a href="/profile/edit" className="text-blue-600 underline">Edit Profile</a>
    <a href="/profile/change-password" className="text-blue-600 underline">Change Password</a>
  </div>
</div>

  );
}
