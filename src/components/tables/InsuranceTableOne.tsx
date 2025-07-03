"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";

interface Insurance {
  id: string;
  customerName: string;
  mobile: string;
  email: string;
  policyNumber: string;
  productName: string;
  productId: string;
  kitNumber: string;
  certificateNo: string;
  invoiceAmount:string;
  dueamount:string;
  tier: string;
  policyStatus: string;
  policyStartDate: string;
  expiryDate: string;
  dealerName: string;
  membershipFees: string;
  mobilenumber:string;
     policyType: string;
     paidstatus: string;
  policyPrice?:{ price:string;}|null;
    
  // policy?: {
  //   policynumber: string;
  //   productname: string;
  //   productid: string;
  //   certificateno: string;
  //   holder: string;
  //   tier: string;
  //   insuranceType: string;
  // } | null;
}

export default function InsuranceTable() {
  const [data, setData] = useState<Insurance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/insurance");
        const json = await res.json();
        setData(json);
        console.log('insurance',json);
      } catch (err) {
        console.error("Error fetching policies", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);
const handleUpdateStatus = async (policyId: string, newStatus: string) => {
  try {
    const res = await fetch(`/api/insurance/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ policyId, status: newStatus }),
    });

    if (res.ok) {
      setData((prevData) =>
        prevData.map((policy) =>
          policy.id === policyId ? { ...policy, policyStatus: newStatus } : policy
        )
      );
    } else {
      alert("Failed to update policy status.");
    }
  } catch (error) {
    console.error("Error updating policy status:", error);
  }
};
  if (loading) return <p className="p-4">Loading insurance policies...</p>;
  if (data.length === 0) return <p className="p-4">No insurance policies found.</p>;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <button
  onClick={() => window.open("/api/insurance/daily-report", "_blank")}
  className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
>
  Download Daily PDF
</button>
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1200px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-start text-gray-500 text-theme-xs dark:text-gray-400">Customer Name</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-start text-gray-500 text-theme-xs dark:text-gray-400">Mobile</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-start text-gray-500 text-theme-xs dark:text-gray-400">Policy Type</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-start text-gray-500 text-theme-xs dark:text-gray-400">Product</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-start text-gray-500 text-theme-xs dark:text-gray-400">Kit No</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-start text-gray-500 text-theme-xs dark:text-gray-400">Invoice Amount</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-start text-gray-500 text-theme-xs dark:text-gray-400">Expiry</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-start text-gray-500 text-theme-xs dark:text-gray-400">Policy Price</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-start text-gray-500 text-theme-xs dark:text-gray-400">Status</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="px-5 py-4 text-start">{item.customerName}</TableCell>
                  <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm dark:text-gray-400">{item.mobilenumber}</TableCell>
               <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm dark:text-gray-400">
  {(() => {
    switch (item.policyType) {
      case "adld":
        return "QYK Protect";
      case "combo1Year":
        return "QYK Max";
      case "ew1Year":
        return "QYK Shield 1 Year";
      case "ew2Year":
        return "QYK Shield 2 Year";
      case "ew3Year":
        return "QYK Shield 3 Year";
      default:
        return item.policyType;
    }
  })()}
</TableCell>
                  <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm dark:text-gray-400">{item.productName}</TableCell>
                  <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm dark:text-gray-400">{item.kitNumber}</TableCell>
                  <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm dark:text-gray-400">{item.invoiceAmount}</TableCell>

                  <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                    {new Date(item.expiryDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm dark:text-gray-400">{item.policyPrice?.price}</TableCell>

                  <TableCell className="px-4 py-3 text-start">
                    <Badge
                      size="sm"
                      color={
                        item.policyStatus === "Active"
                          ? "success"
                          : item.policyStatus === "Under Booking"
                          ? "warning"
                          : "error"
                      }
                    >
                      {item.policyStatus}
                    </Badge>
                     {item.policyStatus === "Under Booking" && (
    <div className="mt-2 flex gap-2">
      <button
        onClick={() => handleUpdateStatus(item.id, "Cancelled")}
        className="px-3 py-1 text-white bg-red-600 rounded hover:bg-red-700"
      >
        Cancel
      </button>
      <button
        onClick={() => handleUpdateStatus(item.id, "Reissued")}
        className="px-3 py-1 text-white bg-blue-600 rounded hover:bg-blue-700"
      >
        Reissue
      </button>
    </div>
  )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
