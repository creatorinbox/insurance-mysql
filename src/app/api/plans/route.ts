import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/getUserFromToken";
import { redirect } from "next/navigation";

type AllowedRole = "DISTRIBUTOR" | "DEALER";
export async function GET() {
  const user = await getUserFromToken();

    if (!user ) {
                return redirect("/signin");
      
     // return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    let selectrole: AllowedRole | undefined;
    if(user.role=='SUPERADMIN')
    {
      selectrole='DISTRIBUTOR';
    } else if(user.role=='DISTRIBUTOR')
    
    {
     selectrole='DEALER';
    } 
  
  // const plans = await prisma.plan.findMany({
  //    where: {
  //     role: selectrole, // 🔥 Filter plans by user's role
  //   },
  //   select: { id: true, name: true },
  // });
   const plans = await prisma.plan.findMany({
     where: {
      role: selectrole, // 🔥 Filter plans by user's role
    },
      include: {
        tiers: true,
      },
    });

  return NextResponse.json(plans);
}
