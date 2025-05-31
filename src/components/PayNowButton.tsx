"use client";

import { useRouter } from "next/navigation";

interface Props {
  amount: number;
  base: number;
  discount: number;
}

export default function PayNowButton({ amount, base, discount }: Props) {
  const router = useRouter();

  const handleClick = async () => {
    const res = await fetch("/api/payments/pay-now", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, base, discount }),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      router.push("/payment/history");
    } else {
      alert(data.error || "Payment failed.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Pay Now
    </button>
  );
}
