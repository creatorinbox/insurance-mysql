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
const [brokerDetials, setBrokerDetials] = useState<string>("");
const [isEditing, setIsEditing] = useState(false);
const [editText, setEditText] = useState("");
  useEffect(() => {
    async function fetchPolicies() {
      const res = await fetch("/api/policy");
      const data = await res.json();
      setPolicies(data);
      if (data.length > 0) {
        setActiveTab(data[0].category); // Set default tab to the first category
      }
    }

 async function fetchBrokerDetails() {
    const res = await fetch("/api/policy/broker");
    const data = await res.json();
console.log('broker',data)
    if (res.ok) {
      setBrokerDetials(data.brokerDetails || "");
    } else {
      console.error("Failed to fetch broker info:", data.error);
    }
  }

  fetchBrokerDetails();
    fetchPolicies();
  }, []);
const handleBrokerEdit = () => {
  setEditText(brokerDetials);
  setIsEditing(true);
};

const handleSave = async () => {
  const res = await fetch("/api/policy/broker", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ brokerDetails: editText }),
  });

  const data = await res.json();
  if (res.ok) {
    setBrokerDetials(data.brokerDetails);
    setIsEditing(false);
  } else {
    alert(data.error || "Update failed");
  }
};
  const categories = [...new Set(policies.map((p) => p.category))];

  const renderTable = (category: string) => {
    const filtered = policies.filter((p) => p.category === category);

    return (
      <div className="mt-4">
         <div className=" items-center justify-between mb-4">
  <div>
    {userRole === "SUPERADMIN" ? (<>
<div className="flex items-center justify-between mb-4">
    
      <div className="w-full">
    <h2 className="text-sm">Broker Details</h2>
    {isEditing ? (
      <textarea
        value={editText}
        onChange={(e) => setEditText(e.target.value)}
        className="w-full p-2 border text-lg font-semibold  mt-1 "
        rows={2}
      />
    ) : (
      <p className="text-xl font-semibold">
        {brokerDetials || "No details available"}
      </p>
    )}
  </div>
  <div className="ml-4 shrink-0">
    {isEditing ? (
      <button
        onClick={handleSave}
        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Save
      </button>
  ) : (
      <button
        onClick={handleBrokerEdit}
        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Edit
      </button>
    )}
  </div>
</div>
   
                   </>   ) : (
                      <>
                      <div></div> </>)}
</div>
</div>
        <div className="overflow-hidden rounded-xl border border-gray-400  border-1">
        
          <div className="max-w-full overflow-x-auto">
            <div className="">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-200">
                    {userRole === "SUPERADMIN" ? (
                      <>
                                          <TableCell className="border-1 border-gray-400" isHeader>Invoice Value</TableCell>

                        <TableCell className="border-1 border-gray-400" isHeader>ADLD-1Yr</TableCell>
                        <TableCell className="border-1 border-gray-400" isHeader>EW-1Yr</TableCell>
                        <TableCell className="border-1 border-gray-400"isHeader>EW-2Yrs</TableCell>
                        <TableCell className="border-1 border-gray-400" isHeader>EW-3Yrs</TableCell>
                        <TableCell className="border-1 border-gray-400" isHeader>COMBO-1Yr</TableCell>
                      </>
                    ) : (
                      <>
                                          <TableCell className="border-1 border-gray-400" isHeader>Invoice Value</TableCell>

                        <TableCell className="border-1 border-gray-400" isHeader>QYK Protect-1Yr</TableCell>
                        <TableCell className="border-1 border-gray-400" isHeader>QYK Shield-1Yr</TableCell>
                        <TableCell className="border-1 border-gray-400" isHeader>QYK Shield-2Yrs</TableCell>
                        <TableCell className="border-1 border-gray-400" isHeader>QYK Shield-3Yrs</TableCell>
                        <TableCell  className="border-1 border-gray-400" isHeader>QYK Max-1Yr</TableCell>
                      </>
                    )}
                    {/* <TableCell isHeader>Broker Details</TableCell>
                    <TableCell isHeader>Action</TableCell> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((policy) => (
                    <TableRow  key={policy.id}>
                      <TableCell className="border-1 border-gray-400 text-center">₹ {policy.minAmount} - ₹ {policy.maxAmount}</TableCell>
                      <TableCell className="border-1 border-gray-400 text-center">{policy.adld ?'₹'+policy.adld:'-' }
                      
                        </TableCell>
                        <TableCell className="border-1 border-gray-400 text-center"> {policy.ew1Year ? '₹'+ policy.ew1Year:'-' }</TableCell>
                      <TableCell className="border-1 border-gray-400 text-center"> {policy.ew2Year ? '₹'+ policy.ew2Year:'-' }</TableCell>
                      <TableCell className="border-1 border-gray-400 text-center">{policy.ew3Year ? '₹'+ policy.ew3Year:'-' }</TableCell>
                      <TableCell className="border-1 border-gray-400 text-center">{policy.combo1Year ? '₹'+ policy.combo1Year:'-' }</TableCell>
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
      <div className=" space-x-4 border-b pb-2">
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
