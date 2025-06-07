"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Label from "@/components/form/Label";

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

type DistributorData = {
  id: string;
  name: string;
  email: string;
  password: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  gstNumber: string;
  contactPerson: string;
  contactMobile: string;
  region: string;
  planId: string;
};

export default function EditDistributorPage() {
  const [distributor, setDistributor] = useState<DistributorData | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const router = useRouter();
  const { id } = useParams(); // ✅ Get distributor ID from URL

  useEffect(() => {
    const fetchDistributor = async () => {
      if (!id) return;
      console.log('id',id);
      const res = await fetch(`/api/distributor/${id}`);
      const data = await res.json();
      console.log("Fetched Distributor Data:", data); // ✅ Debugging API response
      setDistributor(data);
      setSelectedPlan(plans.find((p) => p.id === data.planId) || null);
    };

    const fetchPlans = async () => {
      const res = await fetch("/api/plans");
      const data = await res.json();
      setPlans(data);
    };

    fetchDistributor();
    fetchPlans();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDistributor((prev) => prev ? { ...prev, [name]: value } : prev);

    if (name === "planId") {
      setSelectedPlan(plans.find((p) => p.id === value) || null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/distributor/${id}`, {
      method: "PUT",
      body: JSON.stringify(distributor),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      alert("Distributor updated successfully!");
      router.push("/distributor-tables");
    } else {
      alert("Failed to update distributor.");
    }
  };

  if (!distributor) {
    return <p className="p-6">Loading distributor details...</p>;
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Edit Distributor</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.entries(distributor)
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
          <Label>Select Plan</Label>
          <select
            name="planId"
            value={distributor.planId}
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
          Update Distributor
        </button>
      </form>
    </div>
  );
}
