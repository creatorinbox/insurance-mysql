"use client";
import { useState, useEffect } from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";

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

export default function CreateDistributorPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
const [location, setLocation] = useState({ city: "", state: "" });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
      confirmPassword: "", // ✅ Add this
    mobile: "",
    address: "",
   // city: "",
    //state: "",
    gstNumber: "",
    contactPerson: "",
    contactMobile: "",
    region: "",
    planId: "",
        pinCode: "",

  });

  useEffect(() => {
    const fetchPlans = async () => {
      const res = await fetch("/api/plans");
      const data = await res.json();
      setPlans(data);
    };
    fetchPlans();
     console.log("📍 City:", location.city);
  console.log("📍 State:", location.state);
  }, [location]);

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "planId") {
      const plan = plans.find((p) => p.id === parseInt(value,10));
      setSelectedPlan(plan || null);
    }

  if (name === "pinCode" && value.length === 6) {
    try {
      const res = await fetch("/api/pincode-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pincode: value }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("locationres",data.city)
        setLocation({ city: data.city, state: data.state });
      }
    } catch (error:unknown) {
      console.error("Failed to fetch location", error);
    }
  }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/;

    if (!passwordRegex.test(formData.password)) {
      alert(
        "Password must be at least 8 characters long and include a capital letter, a lowercase letter, a number, and a special character."
      );
      return;
    }

  const payload = {
    ...formData,
    planId: parseInt(formData.planId, 10), // ✅ force planId to integer
    city: location.city,
  state: location.state,
  };
    const res = await fetch("/api/distributor", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      alert("Distributor created!");
      setFormData({
        name: "",
        email: "",
        password: "",
          confirmPassword: "", // ✅ Add this
        mobile: "",
        address: "",
       // city: "",
        //state: "",
        gstNumber: "",
        contactPerson: "",
        contactMobile: "",
        region: "",
        planId: "",
        pinCode: "",

      });
      setSelectedPlan(null);
    } else {
      alert("Failed to create distributor.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Create Distributor</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.entries(formData)
          .filter(([key]) => key !== "planId")
          .map(([key, val]) => (
            <div key={key}>
              <label className="block mb-1 capitalize">
                {key.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                type="text"
                name={key}
                value={val}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
        ))}

<div>
  <Label>City</Label>
  <Input name="city" type="text" defaultValue={location.city} onChange={handleChange} readOnly />
</div>

<div>
  <Label>State</Label>
  <Input name="state" type="text" defaultValue={location.state} onChange={handleChange} readOnly />
</div>


        <div>
          <Label>Select Plan</Label>
          <select
            name="planId"
            value={formData.planId}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
            required
          >
            <option value="">-- Select a plan --</option>
            {plans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name}
              </option>
            ))}
          </select>
        </div>

        {/* ✅ Display Selected Plan Details + Tiers */}
        {selectedPlan && (
          <div className="mt-4 p-4 border rounded bg-gray-50 text-sm space-y-2">
            <p><strong>Plan:</strong> {selectedPlan.name}</p>
            <p><strong>Role:</strong> {selectedPlan.role}</p>

            {selectedPlan.tiers.length > 0 && (
              <div>
                <p className="font-medium">Tiers:</p>
                <ul className="list-disc ml-5">
                  {selectedPlan.tiers.map((tier) => (
                    <li key={tier.id}>
                      {tier.insuranceCount} insurances - {tier.discountPercent}% discount
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
