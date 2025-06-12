// src/app/(admin)/(others-pages)/insurance/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
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
  
}
export default function DealerInsurancePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  //const [insurances, setInsurances] = useState<Insurance[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Insurance[]>([]);
  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/dealer/${id}/insurances`, {
          credentials: "include",
        });
                console.log('result',res);

        if (!res.ok) throw new Error("Not found");
        const data= await res.json();
        setData(data);
      } catch (err) {
        console.error("Error fetching dealer insurances", err);
        //router.replace("/404");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, router]);
if (loading) return <p className="p-4">Loading insurance policies...</p>;
  if (data.length === 0) return <p className="p-4">No insurance policies found.</p>;
  

  return (
   <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
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
                <TableCell isHeader className="px-5 py-3 font-medium text-start text-gray-500 text-theme-xs dark:text-gray-400">Tier</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-start text-gray-500 text-theme-xs dark:text-gray-400">Invoice Amount</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-start text-gray-500 text-theme-xs dark:text-gray-400">Due Amount</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-start text-gray-500 text-theme-xs dark:text-gray-400">Start</TableCell>
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
        return "QYK Max";
      case "combo1Year":
        return "QYK Shield";
      case "ew1Year":
        return "QYK Pro 1 Year";
      case "ew2Year":
        return "QYK Pro 2 Year";
      case "ew3Year":
        return "QYK Pro 3 Year";
      default:
        return item.policyType;
    }
  })()}
</TableCell>
                  <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm dark:text-gray-400">{item.productName}</TableCell>
                  <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm dark:text-gray-400">{item.kitNumber}</TableCell>
                  <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm dark:text-gray-400">{item.tier}</TableCell>
                  <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm dark:text-gray-400">{item.invoiceAmount}</TableCell>
                  <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm dark:text-gray-400">{item.dueamount}</TableCell>

                  <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                    {new Date(item.policyStartDate).toLocaleDateString()}
                  </TableCell>
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
