import { PDFDocument, rgb, StandardFonts, PDFPage  } from 'pdf-lib';
import { PDFFont, RGB } from 'pdf-lib';
/**
 * A helper function to draw text with word wrapping. It now also handles page breaks.
 * @param doc The PDF document.
 * @param page The current PDF page.
 * @param text The text content to draw.
 * @param options Configuration for drawing the text.
 * @returns An object containing the updated page and y-coordinate.
 */
async function drawWrappedText(
  doc: PDFDocument,
  page: PDFPage,
  text: string,
  options: {
    x: number;
    y: number;
    font: PDFFont;
    size: number;
    lineHeight: number;
    maxWidth: number;
    color?: RGB;
    margin: number;
  }
): Promise<{ page: PDFPage; y: number }> {
  const { x, font, size, lineHeight, maxWidth, color, margin } = options;
  let { y } = options;
  let currentPage = page;

  const words = text.split(' ');
  let currentLine = '';

  for (const word of words) {
    // Check if we need a new page before drawing the next line
    if (y < margin) {
      currentPage = doc.addPage([595.28, 841.89]);
      y = currentPage.getSize().height - margin;
    }

    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = font.widthOfTextAtSize(testLine, size);

    if (testWidth > maxWidth) {
      currentPage.drawText(currentLine, { x, y, font, size, color });
      y -= lineHeight;
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  // Draw the last line
  if (currentLine) {
    if (y < margin) {
        currentPage = doc.addPage([595.28, 841.89]);
        y = currentPage.getSize().height - margin;
    }
    currentPage.drawText(currentLine, { x, y, font, size, color });
    y -= lineHeight;
  }

  return { page: currentPage, y };
}

/**
 * Draws the Terms & Conditions section, handling page breaks.
 * @param pdfDoc The PDF document instance.
 */
async function drawTermsAndConditions(pdfDoc: PDFDocument) {
    let page = pdfDoc.addPage([595.28, 841.89]); // A4 Portrait
    const { width, height } = page.getSize();
    const margin = 50;
    const contentWidth = width - 2 * margin;

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    let y = height - margin;

    // T&C Title
    page.drawText('Terms & Conditions', {
        x: margin,
        y,
        font: boldFont,
        size: 14,
        color: rgb(0, 0, 0),
    });
    y -= 30;

    // T&C Content
    const terms = [
        { title: '1. Eligibility:', content: 'Only customers with an active QYK Care protection plan that includes Dental Services are eligible to avail benefits under this Value-Added Service (VAS). Eligibility is determined by the plan tier (Silver, Gold, or Platinum).' },
        { title: '2. Appointment & Redemption Process:', content: [
            'a. Dental services are available only at designated partner clinics listed in the QYK Care service directory and website.',
            'b. Customers must book appointments in advance by contacting the clinic or via support from QYK Care.',
            'c. At the time of booking, a nominal non-refundable appointment fee is to be paid. This fee will be adjusted against the final bill if the customer avails any eligible service from the VAS partner.'
        ]},
        { title: '3. Coupon Validity & Appointment Window:', content: [
            'a. Vouchers are valid for 3 months from the date of issue.',
            'b. Customers may book appointments for future dates, subject to slot availability within the partner’s calendar.',
            'c. Most partners allow scheduling up to 2 months in advance. If an appointment is booked within the voucher validity, even for a date beyond expiry, it shall be honoured (up to 2 months ahead).'
        ]},
        { title: '4. Services Covered:', content: 'Only those services mentioned under the customer’s plan (e.g., Scaling, RCT, Crowns, Consultation, etc.) are eligible.' },
        { title: 'Exclusions for Implant procedures:', isSubSection: true, content: [
            'i. Sinus lift surgeries',
            'ii. Bone grafting',
            'iii. Temporary crowns/prosthesis',
            'iv. Any additional or complex surgical procedure deemed necessary by the clinic.'
        ]},
        { title: '5. Fee Payment Policy:', content: [
            'a. Payment structure and collection are governed by the respective VAS partner.',
            'b. After opting for a service and confirming the appointment, the customer must pay fees as per the partner’s standard process.',
            'c. Some partners may require full payment in advance, while others may follow a partial or staged payment model.'
        ]},
        { title: '6. Clinic Operations & Time Slots:', content: [
            'a. Each VAS partner operates independently with their own calendar and availability.',
            'b. QYK Care will assist in the scheduling process, but final confirmation of appointment time rests with the VAS partner.',
            'c. QYK Care has vetted clinic timelines and working hours to ensure they align with standard market practices.'
        ]},
        { title: '7. Emergency Handling & Rescheduling:', content: [
            'a. Emergency appointments may be accepted by the clinic at their discretion. However, QYK Care customers are often given preferred consideration.',
            'b. In rare cases, appointments may be rescheduled due to unforeseen or unavoidable circumstances, such as doctor unavailability, medical emergencies, or public health restrictions. Customers will be informed and supported accordingly.'
        ]},
        { title: '8. QYK Care’s Role & Responsibility:', content: [
            'a. QYK Care acts solely as a facilitator in connecting customers with high-quality dental partners.',
            'b. We do not assume liability for clinical procedures, quality of services, medical advice, or outcomes.',
            'c. That said, QYK Care ensures due diligence during onboarding of all VAS partners to maintain service standards.',
            'd. Our customer service team is always available to assist and coordinate in case of complaints or support needs.'
        ]},
        { title: '9. Non-Refundable Nature of Vouchers & Services:', content: [
            'a. Appointment fees are non-refundable.',
            'b. Once the service is availed, refunds or compensations (if any) are solely at the discretion of the VAS partner.'
        ]},
        { title: '10. Exclusive Authorization:', content: 'QYK Care is the exclusive authorized seller of these discount vouchers and has partnered with select clinics for preferred service pricing and priority scheduling.' },
    ];

    for (const term of terms) {
        const titleX = term.isSubSection ? margin + 15 : margin;
        const contentX = term.isSubSection ? margin + 30 : margin + 20;
        const contentMaxWidth = width - contentX - margin;
        
        // Check for page break before drawing a new section
        if (y < margin + 40) { // 40 is a safe buffer
            page = pdfDoc.addPage([595.28, 841.89]);
            y = page.getSize().height - margin;
        }

        // Draw the title of the term/condition
        page.drawText(term.title, {
            x: titleX,
            y,
            font: boldFont,
            size: 10,
            color: rgb(0, 0, 0),
        });
        y -= 15; // Space after title

        const drawOptions = {
            font,
            size: 10,
            lineHeight: 14,
            color: rgb(0.1, 0.1, 0.1),
            margin,
        };

        // Draw the content, handling both single strings and arrays of strings
        if (Array.isArray(term.content)) {
            for (const line of term.content) {
                const result = await drawWrappedText(pdfDoc, page, line, {
                    ...drawOptions,
                    x: contentX,
                    y,
                    maxWidth: contentMaxWidth,
                });
                page = result.page;
                y = result.y;
                y -= 5; // Extra space between list items
            }
        } else {
             const result = await drawWrappedText(pdfDoc, page, term.content, {
                ...drawOptions,
                x: margin,
                y,
                maxWidth: contentWidth,
            });
            page = result.page;
            y = result.y;
        }
        y -= 15; // Space after each major section
    }
}


export async function generateAcknowledgmentPdf(data: {
  customerName: string;
  address: string;
  policyNo: string;
  groupPolicy: string;
  startDate: string;
  endDate: string;
  manufacturer: string;
  model: string;
  invoiceNo: string;
  imei: string;
}) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 Portrait
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const { width } = page.getSize();
  let y = 800;
  
  // Embed and draw logo image
  const logoUrl = 'https://mpurl.in/qyk/logo-qyk-care.png';
  const logoBytes = await fetch(logoUrl).then(res => res.arrayBuffer());
  const logoImage = await pdfDoc.embedPng(logoBytes);
  const logoHeight = 50;
  const logoScale = logoHeight / logoImage.height;
  const logoWidth = logoImage.width * logoScale;

  // Draw logo
  page.drawImage(logoImage, {
    x: (width - logoWidth) / 2,
    y: y - logoHeight,
    width: logoWidth,
    height: logoHeight,
  });

  y -= logoHeight + 30; // Add extra padding below logo

  // Title
  const title = `QYK Care ${data.groupPolicy} Plan details`;
  const titleWidth = boldFont.widthOfTextAtSize(title, 14);
  page.drawText(title, {
    x: (width - titleWidth) / 2,
    y,
    size: 14,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  y -= 40;

  // Table drawing helper
  const drawTableRow = (label: string, value: string) => {
    const rowHeight = 25;
    page.drawRectangle({
      x: 45, y: y - rowHeight, width: 505, height: rowHeight,
      borderWidth: 1, borderColor: rgb(0.7, 0.7, 0.7)
    });
    page.drawLine({
      start: { x: 295, y: y }, end: { x: 295, y: y - rowHeight },
      thickness: 1, color: rgb(0.7, 0.7, 0.7)
    });
    // Use bold font for the label
    page.drawText(label, { x: 50, y: y - 15, size: 10, font: boldFont }); 
    // Use regular font for the value
    page.drawText(value, { x: 300, y: y - 15, size: 10, font }); 
    y -= rowHeight;
  };

  // Section drawing helper
  const drawSection = (title: string, rows: [string, string][]) => {
    // Use bold font for the section title
    page.drawText(title, { x: 50, y, size: 12, font: boldFont });
    y -= 20;
    rows.forEach(([label, value]) => drawTableRow(label, value));
    y -= 10;
  };

  // Draw content sections
  drawSection('Customer Details', [
    ['Name of Customer', data.customerName],
    ['Address', data.address],
  ]);

  drawSection('Policy Details', [
    ['WeConnect Care Kit Number', data.policyNo],
    ['Group Policy No', data.groupPolicy],
    ['ADLD Plan Start Date', data.startDate],
    ['ADLD Plan End Date', data.endDate],
  ]);

  drawSection('Asset Details', [
    ['Manufacturer', data.manufacturer],
    ['Model No', data.model],
    ['Invoice No', data.invoiceNo],
    ['IMEI / Serial No', data.imei],
  ]);

  page.drawText(`Subject otherwise to Terms and Conditions of qykCare ${data.groupPolicy} Plan.`, {
    x: 50,
    y,
    size: 10,
    font,
  });
  y -= 30;

  page.drawText('For Piranu Synergy India Pvt.Ltd.', {
    x: 50,
    y,
    size: 10,
    font,
  });

  // Signature
  try {
    const signatureUrl = 'https://www.pngall.com/wp-content/uploads/14/Signature-Transparent.png';
    const sigBytes = await fetch(signatureUrl).then(res => res.arrayBuffer());
    const sigImage = await pdfDoc.embedPng(sigBytes);
    const sigDims = sigImage.scale(0.15);
    page.drawImage(sigImage, {
      x: 50,
      y: y - sigDims.height - 10,
      width: sigDims.width,
      height: sigDims.height,
    });
    y -= sigDims.height + 15;
  } catch {
    y -= 20;
    page.drawText('[Signature]', { x: 50, y, size: 10, font });
  }

  page.drawText('Director', { x: 50, y: y - 15, size: 10, font });

  // *** ADD THE TERMS AND CONDITIONS PAGE(S) ***
  await drawTermsAndConditions(pdfDoc);

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
