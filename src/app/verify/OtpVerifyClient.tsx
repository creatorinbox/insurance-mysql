// app/verify/OtpVerifyClient.tsx
"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function OtpVerifyClient() {
  const router = useRouter();
  const params = useSearchParams();
  const mobile = params.get("mobile");

  const [otp, setOtp] = useState('');

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === '123456') {
      router.push(`/customer?mobile=${mobile}`);
    } else {
      alert('Invalid OTP. Try 123456');
    }
  };

  return (
    <div className="p-10 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Enter OTP</h2>
      <p className="mb-2">Sent to: {mobile}</p>
      <form onSubmit={handleVerify} className="space-y-4">
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Verify OTP
        </button>
      </form>
    </div>
  );
}
