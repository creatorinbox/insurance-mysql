"use client";
import { useEffect, useState } from "react";
interface SubUser {
  id: number;
  name: string;
  email: string;
  mobile: string;
  city?: string;
  state?: string;
}

export default function SubUserListPage() {
const [users, setUsers] = useState<SubUser[]>([]);
  useEffect(() => {
    const fetchSubUsers = async () => {
      const res = await fetch("/api/dealer/subusers");
      const data = await res.json();
      setUsers(data);
    };

    fetchSubUsers();
  }, []);
const handleEdit = (id: number) => {
  window.location.href = `/dealer/user/edit/${id}`; // Or use router.push()
};

const handleDelete = async (id: number) => {
  if (!confirm("Are you sure you want to delete this user?")) return;

  const res = await fetch(`/api/dealer/subusers/${id}`, {
    method: "DELETE",
  });

  if (res.ok) {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    alert("User deleted successfully");
  } else {
    alert("Failed to delete user");
  }
};

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Sub Users</h2>
      <table className="w-full border">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Actions</th>
            
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.mobile}</td>
             <td>
  <button
    onClick={() => handleEdit(u.id)}
    className="text-blue-600 hover:underline mr-2"
  >
    Edit
  </button>
  <button
    onClick={() => handleDelete(u.id)}
    className="text-red-600 hover:underline"
  >
    Delete
  </button>
</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
