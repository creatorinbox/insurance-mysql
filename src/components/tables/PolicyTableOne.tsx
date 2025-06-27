"use client";

import React, { useEffect, useState } from "react";
//import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

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
  invoiceAmount: number;
  createdAt: Date;
  updatedAt: Date;
  brokerDetials?: string;
}

interface PolicyTableOneProps {
  userRole: string | null;
}

export default function PolicyTableOne({ userRole }: PolicyTableOneProps) {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");
 // const router = useRouter();

  useEffect(() => {
    async function fetchPolicies() {
      const res = await fetch("/api/policy");
      const data = await res.json();
      setPolicies(data);
      if (data.length > 0) {
        setActiveTab(data[0].category); // Set default tab to the first category
      }
    }

    fetchPolicies();
  }, []);

  const categories = [...new Set(policies.map((p) => p.category))];

  const renderTable = (category: string) => {
    const filtered = policies.filter((p) => p.category === category);

    return (
      <div className="mt-4">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <div className="">
              <Table>
                <TableHeader>
                  <TableRow>
                    {userRole === "SUPERADMIN" ? (
                      <>
                                          <TableCell isHeader>Invoice Value</TableCell>

                        <TableCell isHeader>ADLD-1Yr</TableCell>
                        <TableCell isHeader>EW-1Yr</TableCell>
                        <TableCell isHeader>EW-2Yrs</TableCell>
                        <TableCell isHeader>EW-3Yrs</TableCell>
                        <TableCell isHeader>COMBO-1Yr</TableCell>
                      </>
                    ) : (
                      <>
                                          <TableCell isHeader>Invoice Value</TableCell>

                        <TableCell isHeader>QYK Max-1Yr</TableCell>
                        <TableCell isHeader>QYK Protect-1Yr</TableCell>
                        <TableCell isHeader>QYK Protect-2Yrs</TableCell>
                        <TableCell isHeader>QYK Protect-3Yrs</TableCell>
                        <TableCell isHeader>QYK Shield-1Yr</TableCell>
                      </>
                    )}
                    {/* <TableCell isHeader>Broker Details</TableCell>
                    <TableCell isHeader>Action</TableCell> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((policy) => (
                    <TableRow key={policy.id}>
                      <TableCell>₹ {policy.minAmount} - ₹ {policy.maxAmount}</TableCell>
                      <TableCell>{policy.adld ?policy.adld:'-' }
                      
                        </TableCell>
                      <TableCell>{policy.ew1Year ? '₹'+ policy.ew1Year:'-' } </TableCell>
                      <TableCell> {policy.ew2Year ? '₹'+ policy.ew2Year:'-' }</TableCell>
                      <TableCell>{policy.ew3Year ? '₹'+ policy.ew3Year:'-' }</TableCell>
                      <TableCell>{policy.combo1Year ? '₹'+ policy.combo1Year:'-' }</TableCell>
                      {/* <TableCell>{policy.brokerDetials}</TableCell>
                      <TableCell>
                        <button
                          onClick={() => router.push(`/policy/edit/${policy.id}`)}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                      </TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex space-x-4 border-b pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveTab(category)}
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === category
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-blue-500"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      {activeTab && renderTable(activeTab)}
    </div>
  );
}
