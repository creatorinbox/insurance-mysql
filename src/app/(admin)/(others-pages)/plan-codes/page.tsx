// pages/plan-codes/index.tsx
"use client";
import { useEffect, useState } from 'react'
import Link from 'next/link'
//import { useRouter } from "next/navigation";
type PlanCode = {
  id: number;
  planCode: string;
  name: string;
  type: string;
};
export default function PlanList() {
const [plans, setPlans] = useState<PlanCode[]>([])  
//const router = useRouter()

  useEffect(() => {
    fetch('/api/plan-codes')
      .then(res => res.json())
      .then(setPlans)
  }, [])

  async function deletePlan(id: number) {
    await fetch(`/api/plan-codes/${id}`, { method: 'DELETE' })
    setPlans(plans.filter((p) => p.id !== id))
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Plan Code List</h1>
      <Link href="/plan-codes/create" className="bg-blue-600 text-white px-4 py-2 rounded">+ Add Plan</Link>
      <table className="w-full mt-6 border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Code</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {plans.map((plan) => (
            <tr key={plan.id}>
              <td className="border p-2">{plan.planCode}</td>
              <td className="border p-2">{plan.name}</td>
              <td className="border p-2">{plan.type}</td>
              <td className="border p-2">
                <Link href={`/plan-codes/edit/${plan.id}`} className="text-blue-500 mr-4">Edit</Link>
                <button onClick={() => deletePlan(plan.id)} className="text-red-500">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
