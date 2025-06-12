"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditCustomerPage() {
  const { id } = useParams(); // /customer/edit/[id]
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

  // ✅ Fetch customer data on mount
  useEffect(() => {
    const fetchCustomer = async () => {
      const res = await fetch(`/api/customer/edit/${id}`);
      if (!res.ok) {
        setError("Failed to load customer details");
        return;
      }
      const data = await res.json();
      setForm({
        title: data.title || "",
        customerName: data.customerName || "",
        mobile: data.mobile || "",
        address1: data.address1 || "",
        address2: data.address2 || "",
        address3: data.address3 || "",
        city: data.city || "",
        state: data.state || "",
        postCode: data.postCode || "",
        email: data.email || "",
        kyc: data.kyc || "",
        dateOfBirth: data.dateOfBirth?.split("T")[0] || "", // trim timestamp
      });
    };

    fetchCustomer();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const res = await fetch(`/api/customer/edit/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Something went wrong");
    } else {
      setSuccess("Customer updated successfully!");
      router.push("/customer-tables");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Edit Customer</h1>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          "title",
          "customerName",
          "mobile",
          "address1",
          "address2",
          "address3",
          "city",
          "state",
          "postCode",
          "email",
          "kyc",
        ].map((field) => (
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
          Update
        </button>
      </form>
    </div>
  );
}
