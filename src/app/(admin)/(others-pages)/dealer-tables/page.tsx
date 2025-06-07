"use client";
import { Suspense } from 'react';

import { useEffect, useState } from "react";
interface Dealer {
  id: string;
  dealerName: string;
  dealerCode: string;
  dealerLocation: string;
  salesChannel: string;
  vas: string;
  businessPartnerName: string;
  businessPartnerCategory: string;
  lanNumber: string;
  policyBookingDate: string;
  membershipFees: string;
  brokerDetails: string;
  locationCode: string;
  loanApiIntegration: string;
}
export default function DealersPage() {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/dealer");
        const json = await res.json();
        setDealers(json);
      } catch (err) {
        console.error("Error fetching dealers", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dealer List</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table-auto w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Code</th>
              <th className="p-2">Location</th>
              <th className="p-2">Sales Channel</th>
              <th className="p-2">Vas</th>
              <th className="p-2">Business Partner</th>
              <th className="p-2">Category</th>
              <th className="p-2">LAN Number</th>
              <th className="p-2">Booking Date</th>
              <th className="p-2">Membership Fees</th>
              <th className="p-2">Broker Details</th>
              <th className="p-2">Location Code</th>
              <th className="p-2">Loan API Integration</th>
            </tr>
          </thead>
          <tbody>
            {dealers.map((d) => (
              <tr key={d.id} className="border-t">
                <Suspense fallback={<p>Loading feed...</p>}>
                <td className="p-2">{d.dealerName}</td>
                
                <td className="p-2">{d.dealerCode}</td>

                <td className="p-2">{d.dealerLocation}</td>

                <td className="p-2">{d.salesChannel}</td>

                <td className="p-2">{d.vas}</td>

                <td className="p-2">{d.businessPartnerName}</td>

                <td className="p-2">{d.businessPartnerCategory}</td>

                <td className="p-2">{d.lanNumber}</td>

                <td className="p-2">{new Date(d.policyBookingDate).toLocaleDateString()}</td>

                <td className="p-2">{d.membershipFees}</td>

                <td className="p-2">{d.brokerDetails}</td>

                <td className="p-2">{d.locationCode}</td>

                <td className="p-2">{d.loanApiIntegration}</td>
                </Suspense>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
