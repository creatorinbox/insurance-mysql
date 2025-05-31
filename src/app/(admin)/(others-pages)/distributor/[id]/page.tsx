// app/(admin)/(others-pages)/distributor/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Distributor {
  id: string;
  name: string;
  email: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  gstNumber: string;
  contactPerson: string;
  contactMobile: string;
  region: string;
  status: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function DistributorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [distributor, setDistributor] = useState<Distributor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/distributor/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data: Distributor) => setDistributor(data))
      .catch(() => router.replace("/404"))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return <p className="p-8">Loading...</p>;
  }
  if (!distributor) {
    return null; // redirecting to 404
  }

  const Detail = ({ label, value }: { label: string; value?: string }) => (
    <div className="flex justify-between border-b py-2">
      <span className="font-semibold text-gray-700">{label}:</span>
      <span className="text-gray-800">{value ?? "-"}</span>
    </div>
  );

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Distributor Details</h1>
      <div className="space-y-3">
        <Detail label="Name" value={distributor.name} />
        <Detail label="Email" value={distributor.email} />
        <Detail label="Mobile" value={distributor.mobile} />
        <Detail label="Contact Person" value={distributor.contactPerson} />
        <Detail label="Contact Mobile" value={distributor.contactMobile} />
        <Detail label="GST Number" value={distributor.gstNumber} />
        <Detail label="Address" value={distributor.address} />
        <Detail label="City" value={distributor.city} />
        <Detail label="State" value={distributor.state} />
        <Detail label="Pin Code" value={distributor.pinCode} />
        <Detail label="Region" value={distributor.region} />
        <Detail label="Status" value={distributor.status} />
        <Detail label="Active" value={distributor.active ? "Yes" : "No"} />
        <Detail
          label="Created At"
          value={new Date(distributor.createdAt).toLocaleString()}
        />
        <Detail
          label="Updated At"
          value={new Date(distributor.updatedAt).toLocaleString()}
        />
      </div>
    </div>
  );
}
