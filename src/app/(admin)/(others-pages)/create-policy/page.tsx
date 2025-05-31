"use client";

import { useState } from "react";
interface PolicyResult {
  id: string;
  category: string;
  invoiceAmount: number;
  price: number;
}
export default function CreatePolicyPage() {
  const [category, setCategory] = useState("Television");
  const [invoiceAmount, setInvoiceAmount] = useState<number>(0);
  const [result, setResult] = useState<PolicyResult | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    try {
      const res = await fetch("/api/policy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, invoiceAmount }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create policy");
      } else {
        setResult(data);
      }
    } catch {
      setError("Unexpected error");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 space-y-4 bg-white shadow mt-8 rounded">
      <h1 className="text-2xl font-bold">Create Policy</h1>

      <select
        className="w-full border px-3 py-2 rounded"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option>Television</option>
        <option>Refrigerator</option>
        <option>Mobile</option>
        {/* Extend as needed */}
      </select>

      <input
        type="number"
        value={invoiceAmount}
        onChange={(e) => setInvoiceAmount(Number(e.target.value))}
        placeholder="Invoice Amount"
        className="w-full border px-3 py-2 rounded"
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        Create Policy
      </button>

      {error && <p className="text-red-600">{error}</p>}

      {result && (
        <div className="bg-gray-100 p-4 mt-4 rounded">
          <p className="font-bold">Policy Created</p>
          {/* <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre> */}
        </div>
      )}
    </div>
  );
}
