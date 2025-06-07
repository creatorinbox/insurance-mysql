"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
//import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PolicyTableOne from "@/components/tables/PolicyTableOne";
import ImportPolicyModal from "@/components/common/ImportPolicyModal";

export default function BasicTables() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null); // Track user role
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include", // Ensures cookies/session are sent
        });

        if (!res.ok) {
          throw new Error("User not authenticated");
        }

        const userData = await res.json();

        if (userData && userData.role) {
          setUserRole(userData.role); // Store the user role
        } else {
          router.push("/signin"); // Redirect if authentication fails
        }
      } catch (error) {
        console.error("Auth Check Failed:", error);
        router.push("/signin");
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div>
      <div className="space-y-6">
        <div className="flex justify-between mb-4">
          <PageBreadcrumb pageTitle="Products" />

          {/* Show "Import Products" button only if userRole is "superadmin" */}
          {userRole === "SUPERADMIN" && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
            >
              Import Products
            </button>
          )}
        </div>

        <PolicyTableOne userRole={userRole} />
      </div>

      {/* Modal for Import */}
      <ImportPolicyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
