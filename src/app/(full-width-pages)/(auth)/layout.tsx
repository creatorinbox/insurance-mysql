"use client";

import { useEffect, useState } from "react";
import GridShape from "@/components/common/GridShape";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";

import { ThemeProvider } from "@/context/ThemeContext";
import Image from "next/image";
import Link from "next/link";
import React from "react";
interface CompanyDetailsdata {
  companyName: string;
    planName: string;
    logoUrl: string;
    colorCode: string;
    kitName: string;
}
export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const [companyDetails, setCompanyDetails] = useState<CompanyDetailsdata | undefined>(undefined);
    useEffect(() => {
   
    const fetchCompanyDetails = async () => {
          try {
            const res = await fetch("/api/company");
            if (!res.ok) throw new Error("Failed to fetch company details");
    
            const companyData = await res.json();
            console.log("Company Details:", companyData); // ✅ Debugging
            setCompanyDetails(companyData);
          } catch (error) {
            console.error("Error fetching company details:", error);
          }
        };
      fetchCompanyDetails(); 
    }, []);
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <ThemeProvider>
        <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col  dark:bg-gray-900 sm:p-0">
          {children}
          <div className="lg:w-1/2 w-full h-full bg-brand-950 dark:bg-white/5 lg:grid items-center hidden">
            <div className="relative items-center justify-center  flex z-1">
              {/* <!-- ===== Common Grid Shape Start ===== --> */}
              <GridShape />
         {companyDetails && (
  <div className="flex flex-col items-center max-w-xs">
    <Link href="/" className="block mb-4">
     <Image
  width={231}
  height={48}
  src={companyDetails.logoUrl || "/images/logo/default-logo.svg"}
  alt="Logo"
/>
    </Link>
    <p className="text-center text-gray-400 dark:text-white/60">
      {companyDetails.companyName} 
    </p>
  </div>
)}
            </div>
          </div>
          <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
            <ThemeTogglerTwo />
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}
