"use client";

import { useState, useTransition } from "react";
import { createPlan, updatePlan, deletePlan } from "@/app/(admin)/(others-pages)/plans/actions";
import Label from "@/components/form/Label";
import { PencilIcon, TrashBinIcon } from "@/icons";

type Plan = {
  id: number;
  name: string;
  role: "DEALER" | "DISTRIBUTOR" | "NBFC" | "BANK";
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

  const handleAddTier = () => setTiers([...tiers, { discount: 0, insuranceCount: 0 }]);
  const handleRemoveTier = (index: number) => setTiers(tiers.filter((_, i) => i !== index));
  const handleTierChange = (index: number, field: "discount" | "insuranceCount", value: number) => {
    const updated = [...tiers];
    updated[index][field] = value;
    setTiers(updated);
  };

  const handleSubmit = async () => {
    await createPlan({ name, role, tiers });
    window.location.reload();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Set Monthly Sales Target</h1>
      <div className="grid grid-cols-2 gap-5">
        <div className="bg-white shadow p-4 rounded mb-6 space-y-4">
          <Label>Sales Target Name</Label>
          <input
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          />
          <Label>Assign Role</Label>
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
              <div>
                <Label>Sales Target (Insurance Count Upto)</Label>
                <input
                  type="number"
                  placeholder="Insurance Count"
                  value={tier.insuranceCount}
                  onChange={(e) => handleTierChange(index, "insuranceCount", parseInt(e.target.value))}
                  className="border px-3 py-2 rounded w-full"
                />
              </div>
              <div>
                <Label>Achieve discount (percentage)</Label>
                <input
                  type="number"
                  placeholder="Discount %"
                  value={tier.discount}
                  onChange={(e) => handleTierChange(index, "discount", parseFloat(e.target.value))}
                  className="border px-3 py-2 rounded w-full"
                />
              </div>
              {tiers.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveTier(index)}
                  className="text-white border bg-red-500 w-8 h-8 rounded"
                >
                  <TrashBinIcon />
                </button>
              )}
            </div>
          ))}

          <div className="mt-10 flex justify-end gap-4">
            <button onClick={handleAddTier} className="bg-gray-200 px-4 py-2 rounded">
              Add Target Rule
            </button>
            <button onClick={handleSubmit} className="bg-blue-600 text-white px-6 py-2 rounded">
              Create Sales Target
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {plans.map((plan) => (
            <PlanRow key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ✅ Edit Feature in `PlanRow`
function PlanRow({ plan }: { plan: Plan }) {
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState(plan.name);
  const [editRole, setEditRole] = useState(plan.role as "DEALER" | "DISTRIBUTOR");
  const [tiers, setTiers] = useState(plan.tiers.map((t) => ({ discount: t.discountPercent, insuranceCount: t.insuranceCount })));
  const [, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      await updatePlan(plan.id, { name: editName, role: editRole, tiers });
      setEditMode(false);
    });
  };

  const handleTierChange = (index: number, field: "discount" | "insuranceCount", value: number) => {
    const newTiers = [...tiers];
    newTiers[index][field] = value;
    setTiers(newTiers);
  };

  return (
    <div className="flex gap-2 bg-white border p-4 rounded shadow">
      {editMode ? (
        <div className="w-full space-y-4">
          <Label>Plan Name</Label>
          <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="border px-3 py-2 rounded w-full" />
          <Label>Assign Role</Label>
          <select value={editRole} onChange={(e) => setEditRole(e.target.value as "DEALER" | "DISTRIBUTOR")} className="border px-3 py-2 rounded w-full">
            <option value="DEALER">Dealer</option>
            <option value="DISTRIBUTOR">Distributor</option>
          </select>

          {tiers.map((tier, index) => (
            <div key={index} className="flex gap-4 items-center">
              <Label>insuranceCount</Label>
              <input type="number" value={tier.insuranceCount} onChange={(e) => handleTierChange(index, "insuranceCount", parseInt(e.target.value))} className="border px-3 py-2 rounded w-full" />
             <Label>discount</Label>
              <input type="number" value={tier.discount} onChange={(e) => handleTierChange(index, "discount", parseFloat(e.target.value))} className="border px-3 py-2 rounded w-full" />
            </div>
          ))}

          <div className="flex gap-4">
            <button onClick={() => setEditMode(false)} className="bg-gray-500 text-white px-6 py-2 rounded">
              Cancel
            </button>
            <button onClick={handleSave} className="bg-green-600 text-white px-6 py-2 rounded">
              Save Changes
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="w-full">
            <h2 className="text-lg font-semibold capitalize mb-2">{plan.name}</h2>
            {plan.tiers.map((tier, idx) => (
              <p key={tier.id} className="p-2 bg-blue-100 text-gray-600">{idx + 1}. {tier.insuranceCount} insurance sales qualify for {tier.discountPercent}% discount.</p>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setEditMode(true)} className="bg-yellow-500 text-white w-8 h-8 rounded"><PencilIcon /></button>
            <button onClick={() => deletePlan(plan.id)} className="bg-red-600 text-white w-8 h-8 rounded"><TrashBinIcon /></button>
          </div>
        </>
      )}
    </div>
  );
}
