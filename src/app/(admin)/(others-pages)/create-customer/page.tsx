"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CustomerForm() {
        const router = useRouter();
  
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
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
        {["title", "customerName", "mobile", "address1", "address2", "address3", "city", "state", "postCode", "email", "kyc"].map((field) => (
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
