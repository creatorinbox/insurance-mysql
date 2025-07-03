"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
//import jsPDF from "jspdf";
//import autoTable from "jspdf-autotable";

interface Insurance {
  id: string;
  policyNumber: string;
  productName: string;
  policyStatus: string;
  kitNumber: string;
  policyStartDate: string;
  expiryDate: string;
  policyPrice?: {
    ewYear: string;
    price: number;
  };
  dealerName: string;
  customer?:{
  customerName: string;
  address1: string;
  mobile: string;
  };
  brand: string;
  assetCategory: string;
  modelNo: string;
  serialNo: string;
  invoiceNo: string;
  assetInvoiceAmount: number;
}

export default function CustomerClient() {
  const params = useSearchParams();
  const mobile = params.get("mobile");
  const [insurances, setInsurances] = useState<Insurance[]>([]);

  useEffect(() => {
    const fetchInsurance = async () => {
      if (!mobile) return;
      const res = await fetch(`/api/customer?mobile=${mobile}`);
      const data = await res.json();
      setInsurances(data);
    };

    fetchInsurance();
  }, [mobile]);

//   const handlePDFDownload = (policy: Insurance) => {
//      try {
//     const doc = new jsPDF();

//     // ✅ Header Section
//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(16);
//     doc.text("QYK Shield - Membership Details cum Sales Proforma", 20, 20);

//     doc.setFontSize(12);
//     doc.setFont("helvetica", "normal");
//     doc.text(`Mr. ${policy.customer?.customerName}`, 20, 30);
//     doc.text(`${policy.customer?.address1}`, 20, 40);
//     doc.text(`Mob.: ${policy.customer?.mobile}`, 20, 50);
//     doc.text("Welcome to the QYK Care Family!", 20, 60);
//       const staticContent = `Mr. Sanskar Damle
// Kothrud, Pune, Maharashtra 411038
// Mob.: 9860072245

// Welcome to the QYK Care Family!
// Dear Mr. Sanskar Damle,

// Congratulations on purchasing your QYK Shield Kit, a comprehensive protection plan by Piranu Synergy India Pvt. Ltd. under the QYK Care brand.
// * Comprehensive Protection Plan: Extended Warranty or Accidental & Liquid Damage.
// * VAS Benefits: Premium services like Dental Care, Counselling, and more worth ₹1,00,000.
// * Simple Claim Support: Hassle-free claim registration and quick assistance.
// * Dedicated Helpline: We're just a call or email away.

// With your QYK Shield Kit, you gain access to:
// • Benefit Summary outlining the key features of your membership.
// • Easy step-by-step instructions on accessing value-added services.
// • Terms and Conditions detailing your membership benefits.
// `;

//   const contentLines = doc.splitTextToSize(staticContent, 180);
//   doc.text(contentLines, 20, 30);

//   // ✅ Positioning for Tables
//   let nextYPosition = doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : 110; // Adjusted based on content
//     doc.text("Your Membership Details:", 20, 80);

//     // ✅ Membership Details Table
//     autoTable(doc, {
//       startY: 90,
//       head: [["Field", "Details"]],
//       body: [
//         ["Membership No.", policy.policyNumber],
//         ["Type of Plan", policy.productName],
//         ["Membership Type", policy.policyStatus],
//         ["Dealer Name", policy.dealerName],
//         ["Kit Number", policy.kitNumber],
//         ["Start Date", policy.policyStartDate],
//         ["End Date", policy.expiryDate],
//         ["Policy Price", policy.policyPrice ? `₹${policy.policyPrice.price} (${policy.policyPrice.ewYear})` : "Not Available"],
//       ],
//     });

//      nextYPosition = doc.lastAutoTable.finalY + 15;

//     doc.text("Asset Details:", 20, nextYPosition);

//     // ✅ Asset Details Table
//     autoTable(doc, {
//       startY: nextYPosition + 10,
//       head: [["Field", "Details"]],
//       body: [
//         ["Brand", policy.brand],
//         ["Category", policy.assetCategory],
//         ["Model No.", policy.modelNo],
//         ["Serial No.", policy.serialNo],
//         ["Invoice No.", policy.invoiceNo],
//         ["Purchase Price", `₹${policy.assetInvoiceAmount}`],
//       ],
//     });

//     const tenurePosition = doc.lastAutoTable.finalY + 15;
//     doc.text("📅 QYK Membership Tenure Details:", 20, tenurePosition);

//     // ✅ Tenure Table
//     autoTable(doc, {
//       startY: tenurePosition + 10,
//       head: [["Year", "Coverage"]],
//       body: [
//         ["1st Year", "OEM Warranty"],
//         ["2nd Year", "QYK Care EW + ADLD"],
//         ["VAS Duration", "3 Months"],
//       ],
//     });

//     const depreciationPosition = doc.lastAutoTable.finalY + 15;
//     doc.text("📉 ADLD Depreciation Rate:", 20, depreciationPosition);

//     // ✅ Depreciation Table
//     autoTable(doc, {
//       startY: depreciationPosition + 10,
//       head: [["Age of Insured Gadget", "% of Purchase Value"]],
//       body: [
//         ["0-3 months", "10%"],
//         ["4-6 months", "25%"],
//         ["7-12 months", "40%"],
//       ],
//     });

//     const deductiblePosition = doc.lastAutoTable.finalY + 15;
//     doc.text("💰 Excess / Mandatory Deductible:", 20, deductiblePosition);

//     // ✅ Deductible Table
//     autoTable(doc, {
//       startY: deductiblePosition + 10,
//       head: [["Condition", "Deductible"]],
//       body: [
//         ["₹500 or 5% of asset value (whichever is higher)", "Applicable"],
//       ],
//     });

//     doc.text("Thank you for being a valued member of QYK Care!", 20, doc.lastAutoTable.finalY + 20);
//     doc.text("For support, contact support@qykcare.com", 20, doc.lastAutoTable.finalY + 30);

//     doc.save(`${policy.policyNumber}-Membership-Details.pdf`);
//   } catch (err) {
//     console.error("PDF generation failed:", err);
//     alert("PDF download failed — see console for details");
//   }
//   };
const handlePDFDownload = async (policy: Insurance) => {
  const res = await fetch("/api/generate-word", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(policy),
  });

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${policy.policyNumber}-Membership.docx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-5">
        📱 Customer Insurance Info for: {mobile}
      </h2>

      {insurances.length === 0 ? (
        <p className="text-gray-600">No policies found.</p>
      ) : (
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full bg-white border border-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Kit No</th>
                <th className="p-2 border">Policy No</th>
                <th className="p-2 border">Product</th>
                <th className="p-2 border">Premium</th>
                <th className="p-2 border">Dealer Name</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Expiry Date</th>
                <th className="p-2 border">Download PDF</th>
              </tr>
            </thead>
            <tbody>
              {insurances.map((policy) => (
                <tr key={policy.id} className="border-t">
                  <td className="p-2 border">{policy.kitNumber}</td>
                  <td className="p-2 border">{policy.policyNumber}</td>
                  <td className="p-2 border">{policy.productName}</td>
                  <td className="p-2 border">
                    {policy.policyPrice
                      ? `₹${policy.policyPrice.price} (${policy.policyPrice.ewYear})`
                      : "Not Available"}
                  </td>
                  <td className="p-2 border">{policy.dealerName}</td>
                  <td className="p-2 border">{policy.policyStatus}</td>
                  <td className="p-2 border">{new Date(policy.expiryDate).toLocaleDateString()}</td>
                  <td className="p-2 border">
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                       onClick={() => handlePDFDownload(policy)}
                    >
                      Download PDF
                    </button>
                    

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
