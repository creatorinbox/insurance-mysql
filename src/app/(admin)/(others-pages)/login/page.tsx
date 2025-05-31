"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("DEALER"); // Default role
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, role }),
    });

    if (res.ok) {
      router.push("/dashboard");
    } else {
      const json = await res.json();
      setError(json.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4">User Login</h2>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full mb-3 px-3 py-2 border rounded"
        >
          <option value="DEALER">Dealer</option>
          <option value="DISTRIBUTOR">Distributor</option>
          <option value="SUPERADMIN">Superadmin</option>
        </select>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 px-3 py-2 border rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded"
        />

        {error && <p className="text-red-600 mb-2">{error}</p>}

        <button onClick={handleLogin} className="w-full bg-blue-600 text-white py-2 rounded">
          Login
        </button>
      </div>
    </div>
  );
}
