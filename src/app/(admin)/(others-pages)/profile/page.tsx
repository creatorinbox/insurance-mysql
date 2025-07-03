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
  profileImage?: string; // ✅ optional
  brokerDetails?:string;
}

const editableFields: Record<UserRole, string[]> = {
  SUPERADMIN: ["name", "email", "mobile", "address", "city", "state", "gstNumber", "contactPerson","brokerDetails"],
  DEALER: ["dealerName", "email", "mobile", "dealerLocation", "businessPartnerName", "status"],
  DISTRIBUTOR: ["name", "email", "mobile", "city", "state", "region", "contactPerson"],
};

export default function EditProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();

        if (!data.error) {
          setProfile(data as UserProfile);
          setFormData(data);

          if (data.profileImage) {
            setPreviewUrl(data.profileImage.startsWith("http") ? data.profileImage : `${data.profileImage}`);
          }
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formPayload = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "role" &&  key !== "id" && key !== "profileImage" && value !== undefined) {
        formPayload.append(key, value);
      }
    });

    if (selectedImage) {
      formPayload.append("image", selectedImage); // ✅ name="image" matches backend
    }

    const res = await fetch("/api/profile/update", {
      method: "POST",
      body: formPayload,
    });

    const responseData = await res.json();
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
          .filter(
            ([key]) => profile.role &&
            editableFields[profile.role]?.includes(key) &&
            key !== "role"
          )
          .map(([key, value]) => (
            <div key={key}>
              <label className="block mb-1 capitalize">
                {key.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                type="text"
                name={key}
                value={value ?? ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          ))}

        <div className="mb-4 text-center">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="h-32 w-32 mx-auto rounded-full object-cover"
            />
          ) : (
            <div className="h-32 w-32 mx-auto rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            name="image"
            onChange={handleImageChange}
            className="mt-2"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
}
