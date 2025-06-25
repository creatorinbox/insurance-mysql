"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useRouter } from "next/navigation"
//import Badge from "../ui/badge/Badge";
//import Image from "next/image";
import { useEffect, useState } from "react";

interface Policy {
  id: string;
  category: string;
  minAmount: number;
  maxAmount: number;
  ew1Year?: number;
  ew2Year?: number;
  ew3Year?: number;
  adld?: number;
  combo1Year?: number;
  invoiceAmount:number
  createdAt: Date;
  updatedAt: Date;
  brokerDetials?:string;
}
interface PolicyTableOneProps {
  userRole: string | null;
}
// export default function PolicyTableOne() {
export default function PolicyTableOne({ userRole }: PolicyTableOneProps) {
  const [policies, setPolicies] = useState<Policy[]>([]);
  //const CURRENT_USER_ROLE = "SUPERADMIN";
const router = useRouter()

  useEffect(() => {
    async function fetchPolicies() {
      const res = await fetch("/api/policy");
      const data = await res.json();
      setPolicies(data);
    }

    fetchPolicies();
  }, []);
  // const handleApprove = async (id: string) => {
  //   try {
  //     const res = await fetch(`/api/policy/approve/${id}`, {
  //       method: "PATCH",
  //     });

  //     if (!res.ok) throw new Error("Approval failed");

  //     // Update state optimistically
  //     setPolicies((prev) =>
  //       prev.map((policy) =>
  //         policy.id === id ? { ...policy, status: "active" } : policy
  //       )
  //     );
  //   } catch (err) {
  //     console.error("Approval error:", err);
  //   }
  // };
 return (
  // <div className="space-y-10">
  //   {Object.entries(
  //     policies.reduce((acc, policy) => {
  //       if (!acc[policy.category]) acc[policy.category] = [];
  //       acc[policy.category].push(policy);
  //       return acc;
  //     }, {} as Record<string, Policy[]>)
  //   ).map(([category, categoryPolicies]) => (
  //     <div key={category}>
  //       <h2 className="text-lg font-semibold mb-2">{category} Policies</h2>
  //       <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
  //         <div className="max-w-full overflow-x-auto">
  //           <div className="min-w-[1102px]">
  //             <Table>
  //               <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
  //                 <TableRow>
  //                   <TableCell isHeader className="px-5 py-3 font-medium text-start text-gray-500 text-theme-xs dark:text-gray-400">ADLD</TableCell>
  //                   <TableCell isHeader className="px-5 py-3 font-medium text-start text-gray-500 text-theme-xs dark:text-gray-400">COMBO</TableCell>
  //                   <TableCell isHeader className="px-5 py-3 font-medium text-start text-gray-500 text-theme-xs dark:text-gray-400">Min Amount</TableCell>
  //                   <TableCell isHeader className="px-5 py-3 font-medium text-start text-gray-500 text-theme-xs dark:text-gray-400">Max Amount</TableCell>
  //                   <TableCell isHeader className="px-5 py-3 font-medium text-start text-gray-500 text-theme-xs dark:text-gray-400">ew1Year</TableCell>
  //                   <TableCell isHeader className="px-5 py-3 font-medium text-start text-gray-500 text-theme-xs dark:text-gray-400">ew2Year</TableCell>
  //                   <TableCell isHeader className="px-5 py-3 font-medium text-start text-gray-500 text-theme-xs dark:text-gray-400">ew3Year</TableCell>
  //                   <TableCell isHeader className="px-5 py-3 font-medium text-start text-gray-500 text-theme-xs dark:text-gray-400">Created Date</TableCell>
  //                 </TableRow>
  //               </TableHeader>
  //               <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
  //                 {categoryPolicies.map((policy) => (
  //                   <TableRow key={policy.id}>
  //                     <TableCell className="px-4 py-3">{policy.adld}</TableCell>
  //                     <TableCell className="px-4 py-3">{policy.combo1Year}</TableCell>
  //                     <TableCell className="px-4 py-3">{policy.minAmount}</TableCell>
  //                     <TableCell className="px-4 py-3">{policy.maxAmount}</TableCell>
  //                     <TableCell className="px-4 py-3">{policy.ew1Year}</TableCell>
  //                     <TableCell className="px-4 py-3">{policy.ew2Year}</TableCell>
  //                     <TableCell className="px-4 py-3">{policy.ew3Year}</TableCell>
  //                     <TableCell className="px-4 py-3">
  //                       {new Date(policy.createdAt).toLocaleDateString()}
  //                     </TableCell>
  //                   </TableRow>
  //                 ))}
  //               </TableBody>
  //             </Table>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   ))}
  // </div>
  <div className="space-y-10">
    {Object.entries(
      policies.reduce((acc, policy) => {
        if (!acc[policy.category]) acc[policy.category] = [];
        acc[policy.category].push(policy);
        return acc;
      }, {} as Record<string, Policy[]>)
    ).map(([category, categoryPolicies]) => (
      <div key={category}>
        <h2 className="text-lg font-semibold mb-2">{category}</h2>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <div className="min-w-[1102px]">
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell isHeader className="px-5 py-3 font-medium text-start text-gray-500 text-theme-xs dark:text-gray-400">Invoice Value</TableCell>
                   

  {userRole === "SUPERADMIN" ? (
    <>
        <TableCell isHeader className="px-5 py-3 font-medium text-start text-gray-500 text-theme-xs dark:text-gray-400">ADLD-1Yr</TableCell>

                    <TableCell isHeader className="px-5 py-3 font-medium text-start text-gray-500 text-theme-xs dark:text-gray-400">EW-1Yr</TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-start text-gray-500 text-theme-xs dark:text-gray-400">EW-2Yrs</TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-start text-gray-500 text-theme-xs dark:text-gray-400">EW-3Yrs</TableCell>
       <TableCell isHeader className="px-5 py-3 font-medium text-start text-gray-500 text-theme-xs dark:text-gray-400">COMBO-1Yr</TableCell>
                 </> ) : (<>
      <TableCell isHeader className="px-5 py-3 font-medium text-start text-gray-500 text-theme-xs dark:text-gray-400">QYK Max-1Yr</TableCell>

                    <TableCell isHeader className="px-5 py-3 font-medium text-start text-gray-500 text-theme-xs dark:text-gray-400">QYK Protect-1Yr</TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-start text-gray-500 text-theme-xs dark:text-gray-400">QYK Protect-2Yrs</TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-start text-gray-500 text-theme-xs dark:text-gray-400">QYK Protect-3Yrs</TableCell>
       <TableCell isHeader className="px-5 py-3 font-medium text-start text-gray-500 text-theme-xs dark:text-gray-400">QYK Shield-1Yr</TableCell>
     </> )}
     <TableCell isHeader className="px-5 py-3 font-medium text-start text-gray-500 text-theme-xs dark:text-gray-400">
  Broker Details
</TableCell>    
            <TableCell isHeader className="px-5 py-3 font-medium text-start text-gray-500 text-theme-xs dark:text-gray-400">
  Action
</TableCell>      
                    {/* <TableCell isHeader className="px-5 py-3 font-medium text-start text-gray-500 text-theme-xs dark:text-gray-400">Created Date</TableCell> */}
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {categoryPolicies.map((policy) => (
                    <TableRow key={policy.id}>
                      <TableCell className="px-4 py-3">₹ {policy.minAmount/1000}K - ₹ {policy.maxAmount/1000}K</TableCell>
                      <TableCell className="px-4 py-3">{policy.adld}</TableCell>
                      <TableCell className="px-4 py-3">{policy.ew1Year}</TableCell>
                      <TableCell className="px-4 py-3">{policy.ew2Year}</TableCell>
                      <TableCell className="px-4 py-3">{policy.ew3Year}</TableCell>
                      <TableCell className="px-4 py-3">{policy.combo1Year}</TableCell>
                                            <TableCell className="px-4 py-3">{policy.brokerDetials}</TableCell>

                      {/* <TableCell className="px-4 py-3">
                        {new Date(policy.createdAt).toLocaleDateString()}
                      </TableCell> */}
                      <TableCell className="px-4 py-3">
  <button
    onClick={() => router.push(`/policy/edit/${policy.id}`)}
    className="text-blue-600 hover:underline"
  >
    Edit
  </button>
</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);
}