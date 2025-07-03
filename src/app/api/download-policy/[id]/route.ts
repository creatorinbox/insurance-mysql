import { NextResponse } from 'next/server';
import { generateAcknowledgmentPdf } from '@/lib/generateAcknowledgmentPdf';
import { prisma } from "@/lib/prisma";

// Simulate DB call (Replace this with actual fetch logic)
async function getInsuranceById(id: string) {
  // Replace this mock with a real DB query
  const insurance = await prisma.insurance.findUnique({
    where: { id:parseInt(id) },
  });

  if (!insurance) return null;

  // 2. Fetch customer using insurance.mobile
  const customer = await prisma.customer.findFirst({
    where: { mobile: insurance.mobile },
  });

  if (!customer) return null;

  // 3. Combine and return the necessary fields for the PDF
  return {
    customerName: customer.customerName,
    address: customer.address1, // or combine address fields if needed
    policyNo: insurance.kitNumber,
    Policytype: insurance.policyType,
    startDate: insurance.policyStartDate,
    endDate: insurance.expiryDate,
    manufacturer: insurance.make,
    model: insurance.modelNo,
    invoiceNo: insurance.invoiceNo,
    imei: insurance.imeiNumber,
  };
  // return {
  //   customerName: 'NAVEEN AGARWAL',
  //   address1: '25, BEHIND PANCHAYAT LAXMIYA, SIKAR, Rajasthan - 332400',
  //   policyNo: 'ADLD001666',
  //   groupPolicy: 'CITIZENCENTERTECH/001/11234568/ADLD',
  //   startDate: '16 Jul 2024',
  //   endDate: '15 Jul 2025',
  //   make: 'SAMSUNG',
  //   modelNo: 'A34',
  //   invoiceNo: '258',
  //   imeiNumber: '35083868730910',
  // };
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
 // const { id } = params;

  if (!params.id) {
    return NextResponse.json({ error: 'Insurance ID is required' }, { status: 400 });
  }

  const insurance = await getInsuranceById(params.id);

  if (!insurance) {
    return NextResponse.json({ error: 'Insurance not found' }, { status: 404 });
  }

  const pdfBytes = await generateAcknowledgmentPdf({
    customerName: insurance.customerName,
    address: insurance.address,
    policyNo: insurance.policyNo,
  groupPolicy: insurance.Policytype,
    startDate: insurance.startDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }),
  endDate: insurance.endDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }),
    manufacturer: insurance.manufacturer,
    model: insurance.model,
    invoiceNo: insurance.invoiceNo,
    imei: insurance.imei,
  });

  return new NextResponse(pdfBytes, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="policy-acknowledgment.pdf"',
    },
  });
}
