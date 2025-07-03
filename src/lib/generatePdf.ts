import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
interface InsuranceData {
  name: string;
  email: string;
  mobile: string;
  policyType: string;
  productName: string;
  invoiceAmount: string | number;
  SalesAmount: string | number;
  policyStatus: string;
  policyStartDate: string;
  expiryDate: string;
}
export async function generatePdf(data: InsuranceData[]): Promise<Uint8Array> {  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([841.89, 595.28]); // Landscape A4

  const { width, height } = page.getSize();
  const fontSize = 10;
  const margin = 30;
  const rowHeight = 25;
  let y = height - margin;

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Embed logo image (base64 or Uint8Array)
  const logoUrl = 'https://mpurl.in/qyk/logo-qyk-care.png'; // Replace with your image path or fetch logic
  const logoBytes = await fetch(logoUrl).then(res => res.arrayBuffer());
  const logoImage = await pdfDoc.embedPng(logoBytes);
  const logoHeight = 50; // Set desired logo height
  const logoScale = logoHeight / logoImage.height;
  const logoWidth = logoImage.width * logoScale;
  page.drawImage(logoImage, {
    x: margin,
    y: y - logoHeight,
    width: logoWidth,
    height: logoHeight,
  });

  // Draw centered title across full width
  const title = 'Insurance Report';
  const titleWidth = font.widthOfTextAtSize(title, 20);
  page.drawText(title, {
    x: (width - titleWidth) / 2,
    y: y - 20,
    size: 20,
    font,
    color: rgb(0, 0, 0),
  });

  y -= logoHeight + 30; // move y after logo and title

  // Define headers and 90% width across the page, centered
  const headers = ['Name', 'Email', 'mobile', 'policyType', 'productName', 'invoiceAmount', 'salesAmount', 'policyStatus','policyStartDate','expiryDate'];
  const tableWidth = width * 0.9;
  const colWidth = tableWidth / headers.length;
  const colWidths = Array(headers.length).fill(colWidth);
  const tableXStart = (width - tableWidth) / 2;

  // const drawRow = (row, y) => {

  //   let x = tableXStart;
  //   row.forEach((text, index) => {
  //     page.drawText(String(text), {
  //       x: x + 4,
  //       y: y - fontSize - 5,
  //       size: fontSize,
  //       font,
  //       color: rgb(0, 0, 0),
  //     });

  //     page.drawRectangle({
  //       x,
  //       y: y - rowHeight,
  //       width: colWidths[index],
  //       height: rowHeight,
  //       borderColor: rgb(0.75, 0.75, 0.75),
  //       borderWidth: 1,
  //     });

  //     x += colWidths[index];
  //   });
  // };
const drawRow = (row: (string | number)[], y: number) => {
  let x = tableXStart;
  row.forEach((text: string | number, index: number) => {
    page.drawText(String(text), {
      x: x + 4,
      y: y - fontSize - 5,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawRectangle({
      x,
      y: y - rowHeight,
      width: colWidths[index],
      height: rowHeight,
      borderColor: rgb(0.75, 0.75, 0.75),
      borderWidth: 1,
    });

    x += colWidths[index];
  });
};
  // Draw header row
  drawRow(headers, y);
  y -= rowHeight;
let item;
  // Draw data rows
  for ( item of data) {
    drawRow([
      item.name,
      item.email,
      item.mobile,
      item.policyType,
      item.productName,
      item.invoiceAmount,
      item.SalesAmount,
      item.policyStatus,
 item.policyStartDate,
 item.expiryDate
    ], y);
    y -= rowHeight;
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
