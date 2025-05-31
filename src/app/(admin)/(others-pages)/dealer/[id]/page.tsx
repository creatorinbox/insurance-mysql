"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Dealer {
  id: string;
  dealerName: string;
  dealerLocation: string;
  dealerCode: string;
  salesChannel: string;
  status: string;
  vas: string;
  businessPartnerName: string;
  businessPartnerCategory: string;
  lanNumber: string;
  policyBookingDate: string;
  membershipFees: string;
  brokerDetails: string;
  locationCode: string;
  loanApiIntegration: string;
  createdAt: string;
  updatedAt: string;
}

export default function DealerPage() {
  const { id } = useParams();
  const router = useRouter();
  const [dealer, setDealer] = useState<Dealer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/dealer/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data: Dealer) => setDealer(data))
      .catch(() => router.replace("/404"))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return <p className="p-8">Loading...</p>;
  }
  if (!dealer) {
    return null;
  }

  const Detail = ({ label, value }: { label: string; value?: string }) => (
    <div className="flex justify-between border-b py-2">
      <span className="font-semibold text-gray-700">{label}:</span>
      <span className="text-gray-800">{value || "-"}</span>
    </div>
  );

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Dealer Details</h1>
      <div className="space-y-3">
        <Detail label="Dealer Name" value={dealer.dealerName} />
        <Detail label="Location" value={dealer.dealerLocation} />
        <Detail label="Code" value={dealer.dealerCode} />
        <Detail label="Sales Channel" value={dealer.salesChannel} />
        <Detail label="Status" value={dealer.status} />
        <Detail label="VAS" value={dealer.vas} />
        <Detail label="BP Name" value={dealer.businessPartnerName} />
        <Detail label="BP Category" value={dealer.businessPartnerCategory} />
        <Detail label="LAN Number" value={dealer.lanNumber} />
        <Detail
          label="Policy Booking Date"
          value={new Date(dealer.policyBookingDate).toLocaleDateString()}
        />
        <Detail label="Membership Fees" value={dealer.membershipFees} />
        <Detail label="Broker Details" value={dealer.brokerDetails} />
        <Detail label="Location Code" value={dealer.locationCode} />
        <Detail
          label="Loan API Integration"
          value={dealer.loanApiIntegration}
        />
        <Detail
          label="Created At"
          value={new Date(dealer.createdAt).toLocaleDateString()}
        />
        <Detail
          label="Updated At"
          value={new Date(dealer.updatedAt).toLocaleDateString()}
        />
      </div>
    </div>
  );
}
