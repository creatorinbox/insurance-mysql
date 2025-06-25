'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreatePlanCode() {
  const router = useRouter()
  const [form, setForm] = useState({
    planCode: '',
    name: '',
    type: '',
    minAmount: '',
    maxAmount: '',
    priceAmount: ''
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    await fetch('/api/plan-codes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        planCode: form.planCode,
        minAmount: form.minAmount ? parseInt(form.minAmount) : null,
        maxAmount: form.maxAmount ? parseInt(form.maxAmount) : null,
        priceAmount: form.priceAmount ? parseInt(form.priceAmount) : null
      })
    })

    router.push('/plan-codes')
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Create New Plan Code</h2>

      {/* Plan Code */}
      <div className="mb-4">
        <label className="block mb-1">Plan Code</label>
        <input
          type="text"
          name="planCode"
          value={form.planCode}
          onChange={handleChange}
          className="w-full border px-3 py-2"
        />
      </div>

      {/* Name */}
      <div className="mb-4">
        <label className="block mb-1">Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border px-3 py-2"
        />
      </div>

      {/* Type Dropdown */}
      <div className="mb-4">
        <label className="block mb-1">Type</label>
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full border px-3 py-2"
        >
          <option value="">-- Select Type --</option>
          <option value="ADLD">ADLD</option>
          <option value="EW 1YEAR">EW 1YEAR</option>
          <option value="EW 2YEAR">EW 2YEAR</option>
          <option value="EW 3YEAR">EW 3YEAR</option>
        </select>
      </div>

      {/* Min & Max Amounts */}
      <div className="mb-4">
        <label className="block mb-1">Min Amount</label>
        <input
          type="number"
          name="minAmount"
          value={form.minAmount}
          onChange={handleChange}
          className="w-full border px-3 py-2"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Max Amount</label>
        <input
          type="number"
          name="maxAmount"
          value={form.maxAmount}
          onChange={handleChange}
          className="w-full border px-3 py-2"
        />
      </div>

      {/* Price Amount */}
      <div className="mb-6">
        <label className="block mb-1">Price Amount</label>
        <input
          type="number"
          name="priceAmount"
          value={form.priceAmount}
          onChange={handleChange}
          className="w-full border px-3 py-2"
        />
      </div>

      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        Create Plan
      </button>
    </form>
  )
}
