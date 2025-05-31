'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function MobileLoginPage() {
  const router = useRouter();
  const [mobile, setMobile] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile.match(/^\d{10}$/)) {
      alert("Enter valid 10-digit mobile number");
      return;
    }

    router.push(`/verify?mobile=${mobile}`);
  };

  return (
    <div className="p-10 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Enter Mobile Number</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="tel"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          placeholder="Mobile Number"
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Get OTP
        </button>
      </form>
    </div>
  );
}
