"use client";

import { useEffect, useState } from "react";
interface Distributor {
  id: string;
  name: string;
  mobile: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  gstNumber: string;
  contactPerson: string;
  contactMobile: string;
  region: string;
  active: boolean;
}
export default function DistributorsPage() {
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/distributor");
        const json = await res.json();
        setDistributors(json);
      } catch (err) {
        console.error("Error fetching distributors", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Distributor List</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table-auto w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Mobile</th>
              <th className="p-2">Email</th>
              <th className="p-2">Address</th>
              <th className="p-2">City</th>
              <th className="p-2">State</th>
              <th className="p-2">Pin Code</th>
              <th className="p-2">GST</th>
              <th className="p-2">Contact Person</th>
              <th className="p-2">Contact Mobile</th>
              <th className="p-2">Region</th>
              <th className="p-2">Active</th>
            </tr>
          </thead>
          <tbody>
            {distributors.map((d) => (
              <tr key={d.id} className="border-t">
                <td className="p-2">{d.name}</td>
                <td className="p-2">{d.mobile}</td>
                <td className="p-2">{d.email}</td>
                <td className="p-2">{d.address}</td>
                <td className="p-2">{d.city}</td>
                <td className="p-2">{d.state}</td>
                <td className="p-2">{d.pinCode}</td>
                <td className="p-2">{d.gstNumber}</td>
                <td className="p-2">{d.contactPerson}</td>
                <td className="p-2">{d.contactMobile}</td>
                <td className="p-2">{d.region}</td>
                <td className="p-2">{d.active ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
