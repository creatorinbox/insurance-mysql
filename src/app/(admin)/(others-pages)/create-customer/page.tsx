"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CustomerForm() {
        const router = useRouter();
  const [cities, setCities] = useState<string[]>([]);
  const [form, setForm] = useState({
    title: "",
    customerName: "",
    mobile: "",
    address1: "",
    address2: "",
    address3: "",
    city: "",
    state: "",
    postCode: "",
    email: "",
    kyc: "",
    dateOfBirth: "",
    kycNumber:"",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setForm({ ...form, [e.target.name]: e.target.value });
  // };
// const handleChange = (
//   e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
// ) => {
//   setForm({ ...form, [e.target.name]: e.target.value });
// };

const handleChange = async (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;
  setForm({ ...form, [name]: value });

  if (name === 'postCode' && value.length === 6) {
    try {
      const res = await fetch('/api/pincode-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pincode: value }),
      });

      const data = await res.json();
 if (res.ok && Array.isArray(data.cities)) {
      setCities(data.cities);
      setForm((prev) => ({
        ...prev,
        city: data.cities[0] || "",
        state: data.state,
      }));
    }
    } catch (error:unknown) {
      console.error('Failed to lookup pincode', error);
    }
  }
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const res = await fetch("/api/customer/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form) ,
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Something went wrong");
    } else {
      setSuccess("Customer created successfully!");
      setForm({
        title: "",
        customerName: "",
        mobile: "",
        address1: "",
        address2: "",
        address3: "",
        city: "",
        state: "",
        postCode: "",
        email: "",
        kyc: "",
        dateOfBirth: "",
        kycNumber:"",
      });
                  router.push("/customer-tables");

    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Add Customer</h1>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
  <label className="block font-medium">Title</label>
  <select
    name="title"
    value={form.title}
onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange(e)}
    required
    className="w-full p-2 border rounded"
  >
    <option value="">Select Title</option>
    <option value="Mr.">Mr.</option>
    <option value="Mrs.">Mrs.</option>
    <option value="Ms.">Ms.</option>
  </select>
</div>
        {[ "customerName", "mobile", "address1", "address2", "address3",  "email","postCode"].map((field) => (
          <div key={field}>
            <label className="block font-medium capitalize">{field}</label>
            <input
              type="text"
              name={field}
              value={form[field as keyof typeof form]}
              onChange={handleChange}
              required={field !== "address2" && field !== "address3"}
              className="w-full p-2 border rounded"
            />
          </div>
        ))}
<div>
  <label className="block font-medium">City</label>
  <select
    name="city"
    value={form.city}
    onChange={handleChange}
    required
    className="w-full p-2 border rounded"
  >
    <option value="">-- Select City --</option>
    {cities.map((city) => (
      <option key={city} value={city}>
        {city}
      </option>
    ))}
  </select>
</div>
<label className="block font-medium">State</label>

<input
  type="text"
  name="state"
  value={form.state}
  onChange={handleChange}
  required
  readOnly
  className="w-full p-2 border rounded bg-gray-100"
/>
<div>
  <label className="block font-medium">KYC Type</label>
  <select
    name="kyc"
    value={form.kyc}
    onChange={handleChange}
    required
    className="w-full p-2 border rounded"
  >
    <option value="">Select KYC Type</option>
    <option value="PAN Card">PAN Card</option>
    <option value="Aadhaar">Aadhaar</option>
    <option value="Voter ID">Voter ID</option>
    <option value="Passport">Passport</option>
  </select>
</div>

{form.kyc && (
  <div>
    <label className="block font-medium">KYC Number</label>
    <input
      type="text"
      name="kycNumber"
      value={form.kycNumber || ""}
      onChange={(e) =>
        setForm({ ...form, kycNumber: e.target.value })
      }
      required
      className="w-full p-2 border rounded"
    />
  </div>
)}

        <div>
          <label className="block font-medium">Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={form.dateOfBirth}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
