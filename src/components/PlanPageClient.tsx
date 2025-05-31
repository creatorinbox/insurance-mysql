"use client";

import { useState, useTransition } from "react";
import { createPlan, updatePlan, deletePlan } from "@/app/(admin)/(others-pages)/plans/actions";
import Label from "@/components/form/Label";

// type Plan = {
//   id: string;
//   name: string;
//    role: "DEALER" | "DISTRIBUTOR";
//   tiers: {
//     discountPercent: number;
//     insuranceCount: number;
//     id: string;
//   }[];
// };
type Plan = {
  id: number;
  name: string;
  role: "DEALER" | "DISTRIBUTOR" | "NBFC" | "BANK"; // <-- add NBFC here if supported
  tiers: {
    discountPercent: number;
    insuranceCount: number;
    id: number;
  }[];
};
export default function PlanPageClient({ plans }: { plans: Plan[] }) {
  const [name, setName] = useState("");
    const [role, setRole] = useState<"DEALER" | "DISTRIBUTOR">("DEALER");

  const [tiers, setTiers] = useState([{ discount: 0, insuranceCount: 0 }]);

  const handleAddTier = () =>
    setTiers([...tiers, { discount: 0, insuranceCount: 0 }]);

  const handleRemoveTier = (index: number) => {
    const updated = [...tiers];
    updated.splice(index, 1);
    setTiers(updated);
  };

  const handleTierChange = (
    index: number,
    field: "discount" | "insuranceCount",
    value: number
  ) => {
    const updated = [...tiers];
    updated[index][field] = value;
    setTiers(updated);
  };

  const handleSubmit = async () => {
    await createPlan({ name,role, tiers });
    window.location.reload();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Plan Management</h1>

      <div className="bg-white shadow p-4 rounded mb-6 space-y-4">
         <Label>Plan Name</Label>
        <input
          placeholder="Plan Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
         <Label>Select Role</Label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as "DEALER" | "DISTRIBUTOR")}
          className="border px-3 py-2 rounded w-full"
        >
          <option value="DEALER">Dealer</option>
          <option value="DISTRIBUTOR">Distributor</option>
        </select>
        
        {tiers.map((tier, index) => (
          <div key={index} className="flex gap-4 items-center">
             <Label>Select Monthly Discount</Label>
            <input
              type="number"
              placeholder="Discount %"
              value={tier.discount}
              onChange={(e) =>
                handleTierChange(index, "discount", parseFloat(e.target.value))
              }
              className="border px-3 py-2 rounded w-full"
            />
             <Label>Select Monthly Insurance Count</Label>
            <input
              type="number"
              placeholder="Insurance Count"
              value={tier.insuranceCount}
              onChange={(e) =>
                handleTierChange(index, "insuranceCount", parseInt(e.target.value))
              }
              className="border px-3 py-2 rounded w-full"
            />
            {tiers.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveTier(index)}
                className="text-red-600 border border-red-500 px-2 py-1 rounded"
              >
                ✕
              </button>
            )}
          </div>
        ))}

        <button
          onClick={handleAddTier}
          className="bg-gray-200 px-4 py-2 rounded"
        >
          + Add Tier
        </button>

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Create Plan
        </button>
      </div>

      <div className="space-y-4">
        {plans.map((plan) => (
          <PlanRow key={plan.id} plan={plan} />
        ))}
      </div>
    </div>
  );
}

function PlanRow({ plan }: { plan: Plan }) {
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState(plan.name);
const [editRole, setEditRole] = useState<"DEALER" | "DISTRIBUTOR">(plan.role as "DEALER" | "DISTRIBUTOR");

  const [tiers, setTiers] = useState(
    plan.tiers.map((t) => ({
      discount: t.discountPercent,
      insuranceCount: t.insuranceCount,
    }))
  );
 // const [ startTransition] = useTransition();
const [, startTransition] = useTransition();  const handleSave = () => {
    startTransition(async () => {
      await updatePlan(plan.id, {
        name: editName,
                role: editRole,

        tiers,
      });
      setEditMode(false);
    });
  };

  const handleTierChange = (
    index: number,
    field: "discount" | "insuranceCount",
    value: number
  ) => {
    const newTiers = [...tiers];
    newTiers[index][field] = value;
    setTiers(newTiers);
  };

  return (
    <div className="bg-white border p-4 rounded shadow">
      {editMode ? (
        <div className="space-y-2">
          <input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          />
        <select
            value={editRole}
            onChange={(e) => setEditRole(e.target.value as "DEALER" | "DISTRIBUTOR")}
            className="border px-3 py-2 rounded w-full"
          >
            <option value="DEALER">Dealer</option>
            <option value="DISTRIBUTOR">Distributor</option>
          </select>
          {tiers.map((tier, index) => (
            <div key={index} className="flex gap-4 items-center">
              <input
                type="number"
                value={tier.discount}
                onChange={(e) =>
                  handleTierChange(index, "discount", parseFloat(e.target.value))
                }
                className="border px-3 py-1 rounded w-full"
              />
              <input
                type="number"
                value={tier.insuranceCount}
                onChange={(e) =>
                  handleTierChange(index, "insuranceCount", parseInt(e.target.value))
                }
                className="border px-3 py-1 rounded w-full"
              />
            </div>
          ))}

          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="text-gray-600 px-3 py-1 border rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <div>
            <div className="font-semibold">{plan.name}</div>
            <div className="text-sm text-gray-600">
              {plan.tiers.map((tier) => (
                <div key={tier.id}>
                  {tier.insuranceCount} ➜ {tier.discountPercent}% discount
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setEditMode(true)}
              className="bg-yellow-500 text-white px-3 py-1 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => startTransition(() => deletePlan(plan.id))}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
