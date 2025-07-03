import path from "path";
import fs from "fs";
import { NextResponse } from "next/server";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

export async function POST(req: Request) {
  const body = await req.json();

  try {
    const templatePath = path.join(process.cwd(), "public", "kit.docx");
    const content = fs.readFileSync(templatePath, "binary");

    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    doc.render({
      customerName: body.customer.customerName,
      policyNumber: body.policyNumber,
      productName: body.productName,
      plan: body.policyType,
      startDate: body.policyStartDate,
      endDate: body.expiryDate,
      price: body.policyPrice,
      imeiNumber:body.imeiNumber,
      invoiceAmount:body.invoiceAmount,
      kitNumber:body.kitNumber,
      modelNo:body.modelNo,
      invoiceNo:body.invoiceNo,
      make:body.make,
      city:body.customer.city,
      mobile:body.customer.mobile,
            state:body.customer.state,
            address1:body.customer.address1,
            dealermobile:body.dealermobile,
            dealerName:body.dealerName,
            salesAmount:body.salesAmount,
            dueamount:body.dueamount,


    });

    const buffer = doc.getZip().generate({ type: "nodebuffer" });

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename=${body.policyNumber}-Membership.docx`,
      },
    });
  } catch (error) {
    console.error("Docx render error:", error);
    return NextResponse.json({ error: "Failed to generate document" }, { status: 500 });
  }
}
