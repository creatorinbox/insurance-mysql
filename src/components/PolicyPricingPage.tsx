"use client";

import { useState } from "react";
import { createPolicyPricing, deletePolicyPricing, updatePolicyPricing } from "@/app/(admin)/(others-pages)/policy-pricing/actions";

type Pricing = {
  id: string;
  category: string;
  minAmount: number;
  maxAmount: number;
  ew1Year?: number;
  ew2Year?: number;
  ew3Year?: number;
  adld?: number;
  combo1Year?: number;
};

export default function PolicyPricingPage({ items }: { items: Pricing[] }) {
  const [form, setForm] = useState<Omit<Pricing, "id">>({
    category: "",
    minAmount: 0,
    maxAmount: 0,
    ew1Year: undefined,
    ew2Year: undefined,
    ew3Year: undefined,
    adld: undefined,
    combo1Year: undefined,
  });

  const handleCreate = async () => {
    await createPolicyPricing(form);
    setForm({
      category: "",
      minAmount: 0,
      maxAmount: 0,
      ew1Year: undefined,
      ew2Year: undefined,
      ew3Year: undefined,
      adld: undefined,
      combo1Year: undefined,
    });
  };

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm({ ...form, [field]: value === "" ? undefined : Number(value) });
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Policy Pricing Management</h1>

      {/* Create Form */}
      <div className="bg-white p-4 rounded shadow space-y-2">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <input
            placeholder="Category"
            className="border px-3 py-2 rounded"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <input
            placeholder="Min ₹"
            type="number"
            className="border px-3 py-2 rounded"
            value={form.minAmount}
            onChange={(e) => setForm({ ...form, minAmount: +e.target.value })}
          />
          <input
            placeholder="Max ₹"
            type="number"
            className="border px-3 py-2 rounded"
            value={form.maxAmount}
            onChange={(e) => setForm({ ...form, maxAmount: +e.target.value })}
          />
          <input
            placeholder="EW 1 Yr ₹"
            type="number"
            className="border px-3 py-2 rounded"
            value={form.ew1Year || ""}
            onChange={(e) => handleChange("ew1Year", e.target.value)}
          />
          <input
            placeholder="EW 2 Yr ₹"
            type="number"
            className="border px-3 py-2 rounded"
            value={form.ew2Year || ""}
            onChange={(e) => handleChange("ew2Year", e.target.value)}
          />
          <input
            placeholder="EW 3 Yr ₹"
            type="number"
            className="border px-3 py-2 rounded"
            value={form.ew3Year || ""}
            onChange={(e) => handleChange("ew3Year", e.target.value)}
          />
          <input
            placeholder="ADLD ₹"
            type="number"
            className="border px-3 py-2 rounded"
            value={form.adld || ""}
            onChange={(e) => handleChange("adld", e.target.value)}
          />
          <input
            placeholder="Combo 1 Yr ₹"
            type="number"
            className="border px-3 py-2 rounded"
            value={form.combo1Year || ""}
            onChange={(e) => handleChange("combo1Year", e.target.value)}
          />
        </div>
        <button onClick={handleCreate} className="bg-blue-600 text-white px-6 py-2 rounded">
          + Add Policy Pricing
        </button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {items.map((item) => (
          <PricingRow key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function PricingRow({ item }: { item: Pricing }) {
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<Omit<Pricing, "id">>({ ...item });

  const handleUpdate = async () => {
    await updatePolicyPricing(item.id, editData);
    setEditing(false);
  };

  return (
    <div className="bg-white p-4 rounded border shadow-sm flex justify-between items-center gap-4">
      {editing ? (
        <div className="flex flex-wrap gap-2 w-full">
          <input
            value={editData.category}
            onChange={(e) => setEditData({ ...editData, category: e.target.value })}
            className="border px-2 py-1 rounded"
          />
          <input
            type="number"
            value={editData.minAmount}
            onChange={(e) => setEditData({ ...editData, minAmount: +e.target.value })}
            className="border px-2 py-1 rounded"
          />
          <input
            type="number"
            value={editData.maxAmount}
            onChange={(e) => setEditData({ ...editData, maxAmount: +e.target.value })}
            className="border px-2 py-1 rounded"
          />
          <input
            type="number"
            value={editData.ew1Year || ""}
            onChange={(e) => setEditData({ ...editData, ew1Year: +e.target.value })}
            className="border px-2 py-1 rounded"
          />
          <input
            type="number"
            value={editData.ew2Year || ""}
            onChange={(e) => setEditData({ ...editData, ew2Year: +e.target.value })}
            className="border px-2 py-1 rounded"
          />
          <input
            type="number"
            value={editData.ew3Year || ""}
            onChange={(e) => setEditData({ ...editData, ew3Year: +e.target.value })}
            className="border px-2 py-1 rounded"
          />
          <input
            type="number"
            value={editData.adld || ""}
            onChange={(e) => setEditData({ ...editData, adld: +e.target.value })}
            className="border px-2 py-1 rounded"
          />
          <input
            type="number"
            value={editData.combo1Year || ""}
            onChange={(e) => setEditData({ ...editData, combo1Year: +e.target.value })}
            className="border px-2 py-1 rounded"
          />
        </div>
      ) : (
        <div className="flex flex-wrap gap-3 text-sm">
          <span className="font-medium">{item.category}</span>
          <span>₹{item.minAmount} - ₹{item.maxAmount}</span>
          <span>EW1Y: ₹{item.ew1Year || "-"}</span>
          <span>EW2Y: ₹{item.ew2Year || "-"}</span>
          <span>EW3Y: ₹{item.ew3Year || "-"}</span>
          <span>ADLD: ₹{item.adld || "-"}</span>
          <span>Combo1Y: ₹{item.combo1Year || "-"}</span>
        </div>
      )}

      <div className="flex gap-2">
        {editing ? (
          <>
            <button onClick={handleUpdate} className="text-green-600 px-3 py-1 border rounded">Save</button>
            <button onClick={() => setEditing(false)} className="text-gray-600 px-3 py-1 border rounded">Cancel</button>
          </>
        ) : (
          <>
            <button onClick={() => setEditing(true)} className="text-yellow-600 px-3 py-1 border rounded">Edit</button>
            <button
              onClick={() => deletePolicyPricing(item.id)}
              className="text-red-600 px-3 py-1 border rounded"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
