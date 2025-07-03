// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
// export async function GET() {
//   try {
//     const todayStart = new Date();
//     todayStart.setHours(0, 0, 0, 0);

//     const todayEnd = new Date();
//     todayEnd.setHours(23, 59, 59, 999);

//     const insurances = await prisma.insurance.findMany({
//       where: {
//         policyStartDate: {
//           gte: todayStart,
//           lt: todayEnd,
//         },
//       },
//     });

//     const enriched = await Promise.all(
//       insurances.map(async (insurance) => {
//         const customer = await prisma.customer.findFirst({
//           where: { mobile: insurance.mobile },
//         });

//         const amount = parseFloat(String(insurance.invoiceAmount ?? "0"));

//         const policyPrice = await prisma.policyPricing.findFirst({
//           where: {
//             category: insurance.productName,
//             minAmount: { lte: amount },
//             maxAmount: { gte: amount },
//           },
//         });

//         return { ...insurance, customer, policyPrice };
//       })
//     );

//     const pdfDoc = await PDFDocument.create();
//     let page = pdfDoc.addPage();
//     const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
//     const fontSize = 9;
//     let y = page.getHeight() - 40;

//     // Define columns
//     const headers = [
//       "Customer",
//       "Mobile",
//       "Policy Type",
//       "Product",
//       "Invoice",
//       "Price",
//       "Status",
//       "Start Date",
//       "Expiry",
//     ];

//     const colX = [40, 120, 200, 270, 340, 400, 450, 500, 560];

//     // Draw header row
//     headers.forEach((header, i) => {
//       page.drawText(header, { x: colX[i], y, size: fontSize, font });
//     });

//     y -= 15;

//     // for (const item of enriched) {
//     //   const row = [
//     //     item.customer?.customerName || "-",
//     //     item.mobile,
//     //     item.policyType,
//     //     item.productName,
//     //     `Rs. ${item.invoiceAmount}`,
//     //     item.SalesAmount || "-",
//     //     item.policyStatus,
//     //     new Date(item.policyStartDate).toLocaleDateString(),
//     //     new Date(item.expiryDate).toLocaleDateString(),
//     //   ];

//     //   row.forEach((text, i) => {
//     //     page.drawText(String(text), { x: colX[i], y, size: fontSize, font });
//     //   });

//     //   y -= 14;

//     //   if (y < 40) {
//     //     y = page.getHeight() - 40;
//     //     page = pdfDoc.addPage();
//     //   }
//     // }
// for (const item of enriched) {
//   const row = [
//     item.customer?.customerName || "-",
//     item.mobile,
//     item.policyType,
//     item.productName,
//     `Rs. ${item.invoiceAmount}`,
//     item.SalesAmount || "-",
//     item.policyStatus,
//     new Date(item.policyStartDate).toLocaleDateString(),
//     new Date(item.expiryDate).toLocaleDateString(),
//   ];

//   const rowHeight = 14;
//   const cellHeight = rowHeight + 4;
//   const rowTop = y + 2;
//   const rowBottom = y - rowHeight;

//   // Draw cell text and column borders
//   row.forEach((text, i) => {
//     const x = colX[i];
//     const nextX = colX[i + 1] ?? 600;

//     // Cell background (optional)
//     // page.drawRectangle({ x, y: rowBottom, width: nextX - x, height: cellHeight, color: rgb(0.98, 0.98, 0.98) });

//     // Cell border
//     page.drawRectangle({
//       x:rowTop,
//       y: rowBottom,
//       width: nextX - x,
//       height: cellHeight,
//   borderColor: rgb(0, 0, 0), // black border
//     borderWidth: 1,
//     });

//     page.drawText(String(text), {
//       x: x + 2,
//       y,
//       size: fontSize,
//       font,
//     });
//   });

//   y -= cellHeight;

//   if (y < 40) {
//     y = page.getHeight() - 40;
//     page = pdfDoc.addPage();
//   }
// }

//     const pdfBytes = await pdfDoc.save();
//     return new NextResponse(Buffer.from(pdfBytes), {
//       status: 200,
//       headers: {
//         "Content-Type": "application/pdf",
//         "Content-Disposition": "attachment; filename=daily-insurance-table.pdf",
//       },
//     });
//   } catch (error) {
//     console.error("PDF generation failed:", error);
//     return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
//   }
// }
import { NextResponse } from 'next/server';
import { generatePdf } from '@/lib/generatePdf';
import { prisma } from '@/lib/prisma'; // adjust path as needed

export async function GET() {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const records = await prisma.insurance.findMany({
    where: {
      createdAt: {
        gte: todayStart,
        lte: todayEnd,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formattedData = [];

  for (const item of records) {
    const customer = await prisma.customer.findFirst({
      where: { mobile: item.mobile },
    });

    formattedData.push({
      name: customer?.customerName || 'Unknown',
      email: customer?.email || 'unknown',
      mobile: item.mobile,
      policyType: item.policyType,
      productName: item.productName,
      invoiceAmount: `Rs. ${item.invoiceAmount}`,
      SalesAmount: item.SalesAmount || '-',
      policyStatus: item.policyStatus,
      policyStartDate: new Date(item.policyStartDate).toLocaleDateString(),
      expiryDate: new Date(item.expiryDate).toLocaleDateString(),
    });
  }

  const pdfBytes = await generatePdf(formattedData);

  return new NextResponse(pdfBytes, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="insurance-report.pdf"',
    },
  });
}
