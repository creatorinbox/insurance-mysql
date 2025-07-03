import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
//import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

// Replace this with your real JWT secret
//const JWT_SECRET = process.env.JWT_SECRET!;
interface JwtPayload {
  id: number;
  role: string;
  subuser:string;
  // any other fields you embed in the token
}
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();

   const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];
   
     if (!token) {
             return redirect("/signin");
      
      // return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
     }
   
     let user: { id: number; role: string;subuser:string; };
     try {
       user = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
         if (!user) {
      return NextResponse.json({ error: "Unauthorized - User missing" }, { status: 401 });
    }
     } catch {
       return NextResponse.json({ message: "Invalid token" }, { status: 403 });
     }
    const getSafeDate = (input: FormDataEntryValue | null) => {
      const value = input?.toString() || "";
      const date = new Date(value);
      return isNaN(date.getTime()) ? new Date() : date;
    };
    const mobile = form.get("lanNumber")?.toString();

if (!mobile) {
  return NextResponse.json({ error: "Mobile is required" }, { status: 400 });
}
    // // Validate unique mobile
        const existing = await prisma.userMeta.findUnique({
          where: { mobile:mobile, },
        });
    
        if (existing) {
          return NextResponse.json({ error: "Mobile number already exists" }, { status: 409 });
        }
        // Validate unique mobile
        const existingemail = await prisma.userMeta.findUnique({
          where: { email:form.get("email")?.toString() },
        });
    
        if (existingemail) {
          return NextResponse.json({ error: "Email already exists" }, { status: 409 });
        }
        const generateDealerCode = async () => {
  // Count existing dealers (or use a dealer sequence table if needed)
  const count = await prisma.dealer.count();
  const nextNumber = count + 1;

  // Format as a 5-digit string (e.g. "00042")
  return `DLR${String(nextNumber).padStart(5, "0")}`;
};
const autoDealerCode = await generateDealerCode();
    const dealer = await prisma.dealer.create({
      data: {
        salesChannel: form.get("salesChannel")?.toString() || "",
        dealerName: form.get("dealerName")?.toString() || "",
        dealerLocation: form.get("dealerLocation")?.toString() || "UNKNOWN",
        dealerCode: autoDealerCode || "",
        vas: form.get("vas")?.toString() || "",
        businessPartnerName: form.get("businessPartnerName")?.toString() || "",
        businessPartnerCategory: form.get("businessPartnerCategory")?.toString() || "",
        lanNumber: form.get("lanNumber")?.toString() || "UNKNOWN",
        policyBookingDate: getSafeDate(form.get("policyBookingDate"))|| new Date(),
        membershipFees: form.get("membershipFees")?.toString() || "",
        brokerDetails: form.get("brokerDetails")?.toString() || "",
        locationCode: form.get("locationCode")?.toString() || "",
        loanApiIntegration: form.get("loanApiIntegration")?.toString() || "",
       plan: parseInt(form.get("planId")?.toString() || "0", 10),
         email: form.get("email")?.toString() || "",
        password: form.get("password")?.toString() || "",
       status:"ACTIVE",
       tier:form.get("tier")?.toString() || "",
        userId:user.id,
        updatedAt:new Date(),
        city:form.get("city")?.toString() || "",
                state:form.get("state")?.toString() || "",

                        pinCode:form.get("pincode")?.toString() || "",

                                note:form.get("note")?.toString() || "",
                                profileImage:"",

      },
    });
    let subusername;
    if(user.subuser==='DISTRIBUTOR')
    {
      subusername='DEALER';

    }else if(user.subuser==='LFR' ||user.subuser==='NBFC' ||user.subuser==='BANK')
    {
      subusername='STORE';

    }
await prisma.userMeta.create({
      data: {
         role: 'DEALER',
      roleId: dealer.id,
      name: dealer.dealerName,
      email: dealer.email,
      password:dealer.password,
      city:dealer.city,
      state:dealer.state,
      mobile:dealer.lanNumber,
      pincode:dealer.pinCode,
      subuser:subusername,
updatedAt:new Date(),

          },
    });
    return NextResponse.json(dealer, { status: 201 });
  } catch (error) {
   // console.error("[DEALER_CREATE_ERROR]", JSON.stringify(error?.message, null, 2));

    console.error("[DEALER_CREATE_ERROR]", error);
    return NextResponse.json({ error: "Dealer creation failed" }, { status: 500 });
  }
}



export async function GET(req: Request) {
  const cookieHeader = req.headers.get("cookie");
  const token = cookieHeader
    ?.split("token=")[1]
    ?.split(";")[0]
    ?.trim();

  if (!token) {
           return redirect("/signin");
    
  //  return NextResponse.json({ message: "Unauthorized - Token missing" }, { status: 401 });
  }

  let user: { id: number; role: string };
  try {
    user = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    if (!user) {
       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
     }
  } catch  {
    return NextResponse.json({ message: "Invalid token" }, { status: 403 });
  }
  try {
 const dealers = await prisma.dealer.findMany({
      where: {
        userId: user.id,
      },
    });
  return NextResponse.json(dealers, { status: 200 });
} catch (error: unknown) {
  const err = error as { message?: string };
  console.error("[Dealer_GET_ERROR]", err?.message || error);
  return NextResponse.json(
    { error: "Failed to fetch Dealer" },
    { status: 500 }
  );
}
  // Now continue with your logic...
}
