"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
interface CompanyDetailsdata {
  companyName: string;
    planName: string;
    logoUrl: string;
    colorCode: string;
    kitName: string;
}
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [companyDetails, setCompanyDetails] = useState<CompanyDetailsdata | undefined>(undefined);
  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";
const router = useRouter();

useEffect(() => {
  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include", // Ensure cookies/session are sent
      });

      if (!res.ok) {
        throw new Error("User not authenticated");
      }

      const userData = await res.json();

      if (userData) {
        setIsAuthenticated(true);
      } else {
        router.push("/signin"); // Redirect if not authenticated
      }
    } catch (error) {
      console.error("Auth Check Failed:", error);
     // router.push("/signin"); // Redirect on failure
    }
  };
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
  checkAuth();
  fetchCompanyDetails(); 
}, []);
  return (
    <div className="min-h-screen xl:flex">
      {/* Sidebar and Backdrop */}
      
             {isAuthenticated && <AppSidebar companyDetails={companyDetails || undefined} />} {/*Load sidebar only if logged in */}
          
      <Backdrop />
      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Header */}
        <AppHeader companyDetails={companyDetails || undefined} />
        {/* Page Content */}
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">{children}</div>
      </div>
    </div>
  );
}
