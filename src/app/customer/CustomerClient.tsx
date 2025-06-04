// app/customer/CustomerClient.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface Insurance {
  id: string;
  policyNumber: string;
  productName: string;
  membershipFees: string;
  policyStartDate: string;
  expiryDate: string;
    policyPrice?: {
    ewYear: string;
    price: number;
  };
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
      console.log("res", data);
      setInsurances(data);
    };

    fetchInsurance();
  }, [mobile]);

  // const handleDownload = () => {
  //   const content = insurances
  //     .map(
  //       (i) =>
  //         `Policy: ${i.policyNumber}\nProduct: ${i.productName}\nPremium: ₹${i.membershipFees}\nValidity: ${i.policyStartDate} to ${i.expiryDate}`
  //     )
  //     .join("\n\n");

  //   const blob = new Blob([content], { type: "text/plain" });
  //   const url = URL.createObjectURL(blob);
  //   const link = document.createElement("a");
  //   link.href = url;
  //   link.download = "policy-details.txt";
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };
const handleDownload = () => {
  const content = insurances
    .map(
      (i) =>
        `Policy: ${i.policyNumber}
Product: ${i.productName}
Policy Price: ${i.policyPrice ? `₹${i.policyPrice.price} (${i.policyPrice.ewYear})` : "Not Available"}
Validity: ${i.policyStartDate} to ${i.expiryDate}`
    )
    .join("\n\n");

  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "policy-details.txt";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-5">
        📱 Customer Policy Info for: {mobile}
      </h2>

      {insurances.length === 0 ? (
        <p className="text-gray-600">No policies found.</p>
      ) : (
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full bg-white border border-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-2 border">Policy No</th>
                <th className="text-left p-2 border">Product</th>
                <th className="text-left p-2 border">Premium</th>
                <th className="text-left p-2 border">Start Date</th>
                <th className="text-left p-2 border">End Date</th>
              </tr>
            </thead>
            <tbody>
              {insurances.map((policy) => (
                <tr key={policy.id} className="border-t">
                  <td className="p-2 border">{policy.policyNumber}</td>
                  <td className="p-2 border">{policy.productName}</td>
                   <td className="p-2 border">
        {policy.policyPrice
          ? `₹${policy.policyPrice.price} (${policy.policyPrice.ewYear})`
          : "Not Available"}
      </td>
                  <td className="p-2 border">
                    {new Date(policy.policyStartDate).toLocaleDateString()}
                  </td>
                  <td className="p-2 border">
                    {new Date(policy.expiryDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button
        onClick={handleDownload}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        Download Policy Summary
      </button>
    </div>
  );
}
