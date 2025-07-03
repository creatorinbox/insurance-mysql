'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface InsuranceItem {
  id:string;
  dealerId: string;
  dealerName: string;
  invoiceAmount: string;
  dueamount: string;
}

export default function DistributorInsuranceListPage() {
  const { id } = useParams<{ id: string }>();
  const [insurances, setInsurances] = useState<InsuranceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/distributor/${id}/insurances`, { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        setInsurances(data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Insurance List for Distributor</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Dealer ID</th>
            <th className="p-2">Dealer Name</th>
            <th className="p-2">Sales Amount</th>
            <th className="p-2">Due Amount</th>
          </tr>
        </thead>
      <tbody>
  {insurances.length === 0 ? (
    <tr>
      <td colSpan={4} className="p-4 text-center text-gray-500">
        No insurance found.
      </td>
    </tr>
  ) : (
    insurances.map((ins) => (
      <tr key={ins.id} className="border-b">
        <td className="p-2">{ins.dealerId}</td>
        <td className="p-2">{ins.dealerName}</td>
        <td className="p-2">₹ {ins.invoiceAmount}</td>
        <td className="p-2">₹ {ins.dueamount}</td>
      </tr>
    ))
  )}
</tbody>
      </table>
    </div>
  );
}
