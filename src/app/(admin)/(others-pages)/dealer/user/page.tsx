"use client";
import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const res = await fetch("/api/dealer/userregister", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Something went wrong");
    } else {
      setSuccess("User registered successfully!");
      setForm({ name: "", email: "", mobile: "", password: "" });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Register User</h2>
      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {["name", "email", "mobile", "password"].map((field) => (
          <div key={field}>
            <label className="block capitalize mb-1">{field}</label>
            <input
              type={field === "password" ? "password" : "text"}
              name={field}
              value={form[field as keyof typeof form]}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Register
        </button>
      </form>
    </div>
  );
}
