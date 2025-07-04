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
  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [selectedTier, setSelectedTier] = useState("Tier1");

  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
   // const [selectedLocationcode, setSelectedLocationcode] = useState<string>("");
const [location, setLocation] = useState<{ cities: string[]; state: string }>({
  cities: [],
  state: "",
});
const [errors, setErrors] = useState<{ [key: string]: string }>({});
const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
const [selectedCity, setSelectedCity] = useState<string>("");
  useEffect(() => {
    const fetchPlans = async () => {
      const res = await fetch("/api/plans");
      const data = await res.json();
      setPlans(data);
    };
    fetchPlans();
  }, [location]);

  const selectedPlan = plans.find((plan) => plan.id === parseInt(selectedPlanId,10));
const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;

  if (name === "pincode" && value.length === 6) {
    try {
      const res = await fetch("/api/pincode-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pincode: value }),
      });

      const data = await res.json();
 if (res.ok && Array.isArray(data.cities)) {
      setLocation({ cities: data.cities, state: data.state });
      setSelectedCity(data.cities[0] || "");
    }
    } catch (error:unknown) {
      console.error("Failed to fetch location", error);
    }
  }
};
const validateForm = (form: FormData) => {
  const newErrors: { [key: string]: string } = {};

  const nameRegex = /^[A-Za-z\s]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mobileRegex = /^\d{10}$/;
  const pincodeRegex = /^\d{6}$/;

  const dealerName = form.get("dealerName")?.toString() || "";
  const email = form.get("email")?.toString() || "";
  const ownerName = form.get("businessPartnerName")?.toString() || "";
  const ownerNumber = form.get("businessPartnerCategory")?.toString() || "";
  const pincode = form.get("pincode")?.toString() || "";
const lanNumber = form.get("lanNumber")?.toString() || "";
  if (!nameRegex.test(dealerName)) {
    newErrors.dealerName = "Dealer name must contain only letters.";
  }

  if (!emailRegex.test(email)) {
    newErrors.email = "Invalid email format.";
  }

  if (!nameRegex.test(ownerName)) {
    newErrors.businessPartnerName = "Owner name must contain only letters.";
  }

  if (!mobileRegex.test(ownerNumber)) {
    newErrors.businessPartnerCategory = "Owner number must be exactly 10 digits.";
  }
  if (!mobileRegex.test(lanNumber)) {
    newErrors.lanNumber = "Lan number must be exactly 10 digits.";
  }

  if (!pincodeRegex.test(pincode)) {
    newErrors.pincode = "Pincode must be exactly 6 digits.";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
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
const confirmPassword = form.get("confirmPassword")?.toString() || "";
if (!validateForm(form)) return;
if (password !== confirmPassword) {
  alert("Passwords do not match.");
  return;
}
form.append("tier", selectedTier);
form.append("city", selectedCity);
form.append("state", location.state);
    const res = await fetch("/api/dealer", {
      method: "POST",
      body: form,
    });
const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Something went wrong");
     // alert("Dealer creation failed");
    } else {
       setSuccess("Dealer created successfully!"); 
    }
  };

  return (
    
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      <PageBreadcrumb pageTitle="Create Dealer" />
        {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}
      <ComponentCard title="Dealer Information">
        <div className="space-y-4">
          {[
           // { name: "salesChannel", label: "Sales Channel / Market" },
            { name: "dealerName", label: "Shop Name" },
            { name: "email", label: "Email" },
           // { name: "dealerLocation", label: "Dealer Location" },
            // { name: "dealerCode", label: "Dealer Code" },
            //{ name: "vas", label: "VAS Yes / No" },
            { name: "businessPartnerName", label: "Owener Name" },
            { name: "businessPartnerCategory", label: "Owner number" },
                       // { name: "password", label: "Password" },

            { name: "lanNumber", label: "LAN Number" },
            // { name: "membershipFees", label: "Membership Fees" },
            // { name: "brokerDetails", label: "Broker Details" },
         //   { name: "locationCode", label: "Location Code" },
            // { name: "loanApiIntegration", label: "Loan API Integration" },
          ].map((field) => (
            <div key={field.name}>
              <Label>{field.label}</Label>
              <Input name={field.name} type="text" />
               {errors[field.name] && (
      <p className="text-sm text-red-600 mt-1">{errors[field.name]}</p>
    )}
            </div>
            
          ))}
           <div>
         <Label>Password</Label>
<div className="relative">
  <Input
    name="password"
    type={showPassword ? "text" : "password"}
    className="pr-10"
  />
  <button
    type="button"
    onClick={() => setShowPassword((prev) => !prev)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
  >
    {showPassword ? "🙈" : "👁️"}
  </button>
</div>   
           <Label>Confirm Password</Label>
<div className="relative">
  <Input
    name="confirmPassword"
    type={showConfirmPassword ? "text" : "password"}
    className="pr-10"
  />
  <button
    type="button"
    onClick={() => setShowConfirmPassword((prev) => !prev)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
  >
    {showConfirmPassword ? "🙈" : "👁️"}
  </button>
</div>

  <Label>VAS</Label>
  <div className="flex gap-4">
    <label className="flex items-center gap-2">
      <input type="radio" name="vas" value="yes" className="accent-blue-600" defaultChecked />
      Yes
    </label>
    <label className="flex items-center gap-2">
      <input type="radio" name="vas" value="no" className="accent-blue-600" />
      No
    </label>
  </div>
</div>
          {/* <div>
            <Label>Policy Booking Date</Label>
            <Input name="policyBookingDate" type="date" />
          </div> */}
{/* <div>
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
</div> */}
<div>
  <Label>Sales Channel / Market</Label>
  <select
    name="salesChannel"
    required
    className="w-full border px-3 py-2 rounded"
  >
    <option value="">Select Market</option>
    <option value="Dealer">Dealer</option>
        <option value="LFR">LFR</option>
    <option value="NBFC">NBFC</option>
    <option value="Bank">Bank</option>
  </select>
</div>
<div>
  <Label>Pincode</Label>
  <Input name="pincode" type="text" onChange={handleChange} />
</div>
<div>
  <Label>City</Label>
  <select
    name="city"
    value={selectedCity}
    onChange={(e) => setSelectedCity(e.target.value)}
    className="w-full border px-3 py-2 rounded"
    required
  >
    <option value="">-- Select City --</option>
    {location.cities.map((city) => (
      <option key={city} value={city}>
        {city}
      </option>
    ))}
  </select>
</div>

<div>
  <Label>State</Label>
  <Input name="state" type="text" defaultValue={location.state} readOnly />
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
  defaultValue={selectedTier} // 🔹 bind the selected value
  onChange={(val: string) => setSelectedTier(val)} // 🔹 update state on change
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
