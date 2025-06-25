'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function EditPolicy() {
  const { id } = useParams()
  const router = useRouter()

  const [form, setForm] = useState({
    category: '',
    minAmount: '',
    maxAmount: '',
    adld: '',
    ew1Year: '',
    ew2Year: '',
    ew3Year: '',
    combo1Year: '',
      brokerDetails: ''
  })

  useEffect(() => {
    fetch(`/api/policy/${id}`)
      .then(res => res.json())
      .then(data => {
        setForm({
          category: data.category,
          minAmount: data.minAmount.toString(),
          maxAmount: data.maxAmount.toString(),
          adld: data.adld?.toString() || '',
          ew1Year: data.ew1Year?.toString() || '',
          ew2Year: data.ew2Year?.toString() || '',
          ew3Year: data.ew3Year?.toString() || '',
          combo1Year: data.combo1Year?.toString() || '',
            brokerDetails: data.brokerDetials?.toString() || '',
        })
      })
  }, [id])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await fetch(`/api/policy/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: form.category,
        minAmount: Number(form.minAmount),
        maxAmount: Number(form.maxAmount),
        adld: form.adld ? Number(form.adld) : null,
        ew1Year: form.ew1Year ? Number(form.ew1Year) : null,
        ew2Year: form.ew2Year ? Number(form.ew2Year) : null,
        ew3Year: form.ew3Year ? Number(form.ew3Year) : null,
        combo1Year: form.combo1Year ? Number(form.combo1Year) : null,
        brokerDetials: form.brokerDetails ||  null, // <-- add this
        updatedAt: new Date(),
      })
    })
    router.push('/policy-tables')
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl p-6 mx-auto space-y-4">
      <h2 className="text-xl font-semibold">Edit Policy</h2>
      {Object.entries(form).map(([key, value]) => (
        <div key={key}>
          <label className="block mb-1 capitalize">{key}</label>
          <input
            type="text"
            name={key}
            value={value}
            onChange={handleChange}
            className="w-full border px-3 py-2"
          />
        </div>
      ))}

      <button className="px-4 py-2 text-white bg-blue-600 rounded">Update</button>
    </form>
  )
}
