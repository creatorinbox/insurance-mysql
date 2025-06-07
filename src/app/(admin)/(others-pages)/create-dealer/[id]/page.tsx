"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Select from "@/components/form/Select";
import { useParams } from "next/navigation";

type PlanTier = {
  id: string;
  discountPercent: number;
  insuranceCount: number;
};

type Plan = {
  id: string;
  name: string;
  role: string;
  tiers: PlanTier[];
};

type DealerData = {
  id: string;
  salesChannel: string;
  dealerName: string;
  email: string;
  dealerLocation: string;
  dealerCode: string;
  vas: string;
  businessPartnerName: string;
  businessPartnerCategory: string;
  lanNumber: string;
  membershipFees: string;
  brokerDetails: string;
  loanApiIntegration: string;
  policyBookingDate: string;
  locationCode: string;
  planId: string;
};

export default function EditDealerPage() {
  const [dealer, setDealer] = useState<DealerData | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const router = useRouter();
  //const searchParams = useSearchParams();
  //const dealerId = searchParams.get("id");
const params = useParams();
const dealerId = params.id ;
  // ✅ Fetch Dealer Data
 useEffect(() => {
  const fetchDealer = async () => {
    if (!dealerId) return;
    const res = await fetch(`/api/dealer/${dealerId}`);
    const data = await res.json();
    console.log("Fetched Dealer Data:", data); // ✅ Debugging API response
    setDealer(data);
    setSelectedPlanId(data.planId);
  };

  const fetchPlans = async () => {
    const res = await fetch("/api/plans");
    const data = await res.json();
    console.log("Fetched Plans:", data); // ✅ Debugging Plan Data
    setPlans(data);
  };

  fetchDealer();
  fetchPlans();
}, [dealerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget as HTMLFormElement);

    const res = await fetch(`/api/dealer/${dealerId}`, {
      method: "PUT",
      body: form,
    });

    if (!res.ok) {
      alert("Failed to update dealer");
    } else {
      alert("Dealer updated successfully");
      router.push("/dealers");
    }
  };

  if (!dealer) {
    return <p className="p-6">Loading dealer details...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      <PageBreadcrumb pageTitle="Edit Dealer" />
      <ComponentCard title="Dealer Information">
        <div className="space-y-4">
          {[
            { name: "salesChannel", label: "Sales Channel / Market", value: dealer.salesChannel },
            { name: "dealerName", label: "Dealer Name", value: dealer.dealerName },
            { name: "email", label: "Email", value: dealer.email },
            { name: "dealerLocation", label: "Dealer Location", value: dealer.dealerLocation },
            { name: "dealerCode", label: "Dealer Code", value: dealer.dealerCode },
            { name: "vas", label: "VAS Yes / No", value: dealer.vas },
            { name: "businessPartnerName", label: "Business Partner Name", value: dealer.businessPartnerName },
            { name: "businessPartnerCategory", label: "Business Partner Category", value: dealer.businessPartnerCategory },
            { name: "lanNumber", label: "LAN Number", value: dealer.lanNumber },
            { name: "membershipFees", label: "Membership Fees", value: dealer.membershipFees },
            { name: "brokerDetails", label: "Broker Details", value: dealer.brokerDetails },
            { name: "loanApiIntegration", label: "Loan API Integration", value: dealer.loanApiIntegration },
          ].map((field) => (
            <div key={field.name}>
              <Label>{field.label}</Label>
              <Input name={field.name} type="text" defaultValue={field.value} />
            </div>
          ))}

          <div>
            <Label>Policy Booking Date</Label>
            <Input name="policyBookingDate" type="date" defaultValue={dealer.policyBookingDate} />
          </div>

          <div>
            <Label>State</Label>
 <Select
  name="locationCode"
  options={[
    { value: "01", label: "Andhra Pradesh" },
    { value: "14", label: "Maharashtra" },
    { value: "23", label: "Tamil Nadu" },
    { value: "27", label: "Uttarakhand" },
    { value: "33", label: "Delhi" },
  ]}
  defaultValue={dealer.locationCode}
  className="dark:bg-dark-900"
  onChange={(value: string) => setDealer({ ...dealer, locationCode: value })} // ✅ Pass string directly
/>
          </div>

          <div>
            <Label>Select Plan</Label>
       <select
  name="planId"
  className="border px-3 py-2 rounded w-full"
  required
  onChange={(e) => {
    setSelectedPlanId(e.target.value);
    const selectedPlan = plans.find((plan) => plan.id === e.target.value);
    console.log("Selected Plan Details:", selectedPlan); // ✅ Debug selected plan details
  }}
  value={selectedPlanId} // ✅ Ensure dropdown shows selected value
>
  <option value="">-- Select a plan --</option>
  {plans.map((plan) => (
    <option key={plan.id} value={plan.id}>
      {plan.name}
    </option>
  ))}
</select>
          </div>

          {/* Plan details section */}
    {selectedPlanId && plans.length > 0 && (
  <div className="border rounded p-4 bg-gray-50 mt-4">
    <p><strong>Plan Name:</strong> {plans.find((plan) => plan.id === selectedPlanId)?.name || "Unknown"}</p>
    <p><strong>Role:</strong> {plans.find((plan) => plan.id === selectedPlanId)?.role || "N/A"}</p>
    <div className="mt-2">
      <p className="font-semibold mb-1">Tiers:</p>
      <ul className="list-disc pl-5">
        {plans.find((plan) => plan.id === selectedPlanId)?.tiers.map((tier) => (
          <li key={tier.id}>
            Discount: {tier.discountPercent}% | Insurance Count: {tier.insuranceCount}
          </li>
        )) || <p>No tier details available</p>}
      </ul>
    </div>
  </div>
)}

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Update Dealer
            </button>
          </div>
        </div>
      </ComponentCard>
    </form>
  );
}
