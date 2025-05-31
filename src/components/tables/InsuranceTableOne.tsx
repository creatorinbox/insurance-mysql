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
                <TableCell isHeader className="px-5 py-3 font-medium text-start text-gray-500 text-theme-xs dark:text-gray-400">Sales Amount</TableCell>
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
                  <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm dark:text-gray-400">{item.policyType}</TableCell>
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
                        item.paidstatus === "PAID"
                          ? "success"
                          : item.paidstatus === "pending"
                          ? "warning"
                          : "error"
                      }
                    >
                      {item.paidstatus}
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
