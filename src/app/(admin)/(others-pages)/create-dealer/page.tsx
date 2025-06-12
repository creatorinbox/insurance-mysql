"use client";

import React, { useEffect, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { ChevronDownIcon } from "@/icons";
import Select from "@/components/form/Select";

type PlanTier = {
  id: number;
  discountPercent: number;
  insuranceCount: number;
};

type Plan = {
  id: number;
  name: string;
  role: string;
  tiers: PlanTier[];
};

export default function CreateDealerPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
   // const [selectedLocationcode, setSelectedLocationcode] = useState<string>("");

const states = [
  { value: "01", label: "Andhra Pradesh" },
  { value: "02", label: "Arunachal Pradesh" },
  { value: "03", label: "Assam" },
  { value: "04", label: "Bihar" },
  { value: "05", label: "Chhattisgarh" },
  { value: "06", label: "Goa" },
  { value: "07", label: "Gujarat" },
  { value: "08", label: "Haryana" },
  { value: "09", label: "Himachal Pradesh" },
  { value: "10", label: "Jharkhand" },
  { value: "11", label: "Karnataka" },
  { value: "12", label: "Kerala" },
  { value: "13", label: "Madhya Pradesh" },
  { value: "14", label: "Maharashtra" },
  { value: "15", label: "Manipur" },
  { value: "16", label: "Meghalaya" },
  { value: "17", label: "Mizoram" },
  { value: "18", label: "Nagaland" },
  { value: "19", label: "Odisha" },
  { value: "20", label: "Punjab" },
  { value: "21", label: "Rajasthan" },
  { value: "22", label: "Sikkim" },
  { value: "23", label: "Tamil Nadu" },
  { value: "24", label: "Telangana" },
  { value: "25", label: "Tripura" },
  { value: "26", label: "Uttar Pradesh" },
  { value: "27", label: "Uttarakhand" },
  { value: "28", label: "West Bengal" },
  { value: "29", label: "Andaman and Nicobar Islands" },
  { value: "30", label: "Chandigarh" },
  { value: "31", label: "Dadra and Nagar Haveli" },
  { value: "32", label: "Daman and Diu" },
  { value: "33", label: "Delhi" },
  { value: "34", label: "Lakshadweep" },
  { value: "35", label: "Puducherry" },
];
  useEffect(() => {
    const fetchPlans = async () => {
      const res = await fetch("/api/plans");
      const data = await res.json();
      setPlans(data);
    };
    fetchPlans();
  }, []);

  const selectedPlan = plans.find((plan) => plan.id === parseInt(selectedPlanId,10));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget as HTMLFormElement);
    const password = form.get("password")?.toString() || "";

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/;

    if (!passwordRegex.test(password)) {
      alert(
        "Password must be at least 8 characters and include a capital letter, a number, and a special character."
      );
      return;
    }

    const res = await fetch("/api/dealer", {
      method: "POST",
      body: form,
    });

    if (!res.ok) {
      alert("Dealer creation failed");
    } else {
      alert("Dealer created successfully");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      <PageBreadcrumb pageTitle="Create Dealer" />
      <ComponentCard title="Dealer Information">
        <div className="space-y-4">
          {[
            { name: "salesChannel", label: "Sales Channel / Market" },
            { name: "dealerName", label: "Dealer Name" },
            { name: "email", label: "Email" },
            { name: "password", label: "Password" },
            { name: "dealerLocation", label: "Dealer Location" },
            { name: "dealerCode", label: "Dealer Code" },
            { name: "vas", label: "VAS Yes / No" },
            { name: "businessPartnerName", label: "Business Partner Name" },
            { name: "businessPartnerCategory", label: "Business Partner Category" },
            { name: "lanNumber", label: "LAN Number" },
            { name: "membershipFees", label: "Membership Fees" },
            { name: "brokerDetails", label: "Broker Details" },
         //   { name: "locationCode", label: "Location Code" },
            { name: "loanApiIntegration", label: "Loan API Integration" },
          ].map((field) => (
            <div key={field.name}>
              <Label>{field.label}</Label>
              <Input name={field.name} type="text" />
            </div>
          ))}

          <div>
            <Label>Policy Booking Date</Label>
            <Input name="policyBookingDate" type="date" />
          </div>
<div>
  <Label>State</Label>
  <div className="relative">
    <Select
      name="locationCode"
      options={states}
      placeholder="Select State"
     // onChange={(e) => setSelectedLocationcode(e.target.value)}
       onChange={() => {}}
      className="dark:bg-dark-900"
    />
    <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
      <ChevronDownIcon />
    </span>
  </div>
</div>

            <div>
              <Label>Tier</Label>
              <div className="relative">
                <Select
                  name="tier"
                  options={[
                    { value: "Tier1", label: "Tier 1" },
                    { value: "Tier2", label: "Tier 2" },
                    { value: "Tier3", label: "Tier 3" },
                  ]}
                  placeholder="Select tier"
                  onChange={() => {}}
                  className="dark:bg-dark-900"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronDownIcon />
                </span>
              </div>
            </div>
          <div>
            <Label>Select Plan</Label>
            <select
              name="planId"
              className="border px-3 py-2 rounded w-full"
              required
              onChange={(e) => setSelectedPlanId(e.target.value)}
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
          {selectedPlan && (
            <div className="border rounded p-4 bg-gray-50 mt-4">
              <p><strong>Plan Name:</strong> {selectedPlan.name}</p>
              <p><strong>Role:</strong> {selectedPlan.role}</p>
              <div className="mt-2">
                <p className="font-semibold mb-1">Tiers:</p>
                <ul className="list-disc pl-5">
                  {selectedPlan.tiers.map((tier) => (
                    <li key={tier.id}>
                      Discount: {tier.discountPercent}% | Insurance Count: {tier.insuranceCount}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </div>
      </ComponentCard>
    </form>
  );
}
