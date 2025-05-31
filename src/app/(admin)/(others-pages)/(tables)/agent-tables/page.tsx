import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AgentTableOne from "@/components/tables/AgentTableOne";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js Basic Table | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Basic Table  page for TailAdmin  Tailwind CSS Admin Dashboard Template",
  // other metadata
};

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Agent List" />
      
      <div className="space-y-6">
        <ComponentCard title="Agent">
        <div className="flex justify-end mb-4">
            <Link 
              href="/create-agent" 
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
            >
              Create Agent
            </Link>
          </div>
          <AgentTableOne />
        </ComponentCard>
      </div>
    </div>
  );
}
