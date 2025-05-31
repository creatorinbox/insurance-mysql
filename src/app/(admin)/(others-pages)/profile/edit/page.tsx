"use client";

import { useEffect, useState } from "react";

export default function EditProfilePage() {
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/me").then(async (res) => {
      const data = await res.json();
      setForm({ name: data.name || "", email: data.email || "" });
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch("/api/profile/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Profile updated");
    } else {
      alert("Failed to update profile");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Edit Profile</h1>

      <input
        type="text"
        className="border p-2 rounded w-full"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
      <input
        type="email"
        className="border p-2 rounded w-full"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Save Changes
      </button>
    </form>
  );
}
