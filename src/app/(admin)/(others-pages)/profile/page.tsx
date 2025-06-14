"use client";
import { useEffect, useState } from "react";

type UserRole = "SUPERADMIN" | "DEALER" | "DISTRIBUTOR";

interface UserProfile {
  role: UserRole;
  name?: string;
  email?: string;
  mobile?: string;
  address?: string;
  city?: string;
  state?: string;
  gstNumber?: string;
  contactPerson?: string;
  dealerName?: string;
  dealerLocation?: string;
  businessPartnerName?: string;
  status?: string;
  region?: string;
}

const editableFields: Record<UserRole, string[]> = {
  SUPERADMIN: ["name", "email", "mobile", "address", "city", "state", "gstNumber", "contactPerson"],
  DEALER: ["dealerName", "email", "mobile", "dealerLocation", "businessPartnerName", "status"],
  DISTRIBUTOR: ["name", "email", "mobile", "city", "state", "region", "contactPerson"]
};

export default function EditProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();
        console.log("Fetched Profile:", data); // ✅ Debugging line

        if (!data.error) {
          setProfile(data as UserProfile);
          setFormData(data);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  console.log("Sending Form Data:", formData); // ✅ Debugging step

  if (Object.keys(formData).length === 0) {
    alert("No fields to update.");
    return;
  }

  const updateData = { ...formData };
  delete updateData.role; // ✅ Remove 'role' instead of destructuring

  const res = await fetch(`/api/profile/update`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateData), // ✅ Send only valid fields
  });

  const responseData = await res.json();
  console.log("Response:", responseData); // ✅ Debugging step

  if (res.ok) {
    alert("Profile updated successfully!");
  } else {
    alert(`Failed to update profile: ${responseData.error}`);
  }
};

  if (loading) return <p>Loading...</p>;
  if (!profile || !profile.role) return <p>Profile not found.</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
     {Object.entries(formData)
  .filter(([key]) => profile.role && editableFields[profile.role]?.includes(key) && key !== "role") // ✅ Exclude role
  .map(([key, value]) => (
    <div key={key}>
      <label className="block mb-1 capitalize">{key.replace(/([A-Z])/g, " $1")}</label>
      <input
        type="text"
        name={key}
        value={value ?? ""}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
    </div>
  ))}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Update Profile
        </button>
      </form>
    </div>
  );
}
