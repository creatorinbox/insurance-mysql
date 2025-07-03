"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditSubUserPage() {
  const { id } = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    // city: "",
    // state: "",
    // pincode: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`/api/dealer/subusers/${id}`);
      const data = await res.json();
      setFormData(data);
    };

    fetchUser();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/dealer/subusers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert("User updated successfully");
      router.push("/dealer/user/list");
    } else {
      alert("Update failed");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Edit Sub User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {["name", "email", "mobile"].map((field) => (
          <div key={field}>
            <label className="block mb-1 capitalize">{field}</label>
            <input
              type="text"
              name={field}
              value={formData[field as keyof typeof formData]}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required={field !== "city" && field !== "state" && field !== "pincode"}
            />
          </div>
        ))}
        <button type="submit" className="px-6 py-2 text-white bg-blue-600 rounded">
          Update User
        </button>
      </form>
    </div>
  );
}
