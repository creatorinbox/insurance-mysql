"use client";

import { useState } from "react";

export default function ChangePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    if (!regex.test(password)) {
      setError("Password must include uppercase, lowercase, number, special character and be 8+ chars.");
      return;
    }

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      setSuccess(true);
    } else {
      setError("Failed to update password.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Change Password</h1>

      {success ? (
        <p className="text-green-600">Password updated successfully!</p>
      ) : (
        <>
          <input
            type="password"
            className="border p-2 rounded w-full"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            className="border p-2 rounded w-full"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          {error && <p className="text-red-600">{error}</p>}

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Change Password
          </button>
        </>
      )}
    </form>
  );
}
