"use client";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PolicyTableOne from "@/components/tables/PolicyTableOne";
import ImportPolicyModal from "@/components/common/ImportPolicyModal";
// import { Metadata } from "next";
import React from "react";
//import Link from "next/link";
import { useState } from "react";

// export const metadata: Metadata = {
//   title: "Next.js Basic Table | TailAdmin - Next.js Dashboard Template",
//   description:
//     "This is Next.js Basic Table  page for TailAdmin  Tailwind CSS Admin Dashboard Template",
//   // other metadata
// };
export default function BasicTables() {
   const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <PageBreadcrumb pageTitle="Policy List" />
      <div className="space-y-6">
      
        <ComponentCard title="Policy">
        <div className="flex justify-end mb-4">
            {/* <Link 
              href="/policy-pricing" 
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
            >
              Create Policy
            </Link> */}
             <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
            >
              Import Policy Plan
            </button>
          </div>

          <PolicyTableOne />
        </ComponentCard>
      </div>
       {/* Modal for Import */}
      <ImportPolicyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
