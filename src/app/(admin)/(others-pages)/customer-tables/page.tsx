"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Customer {
  id: string;
  customerName: string;
  mobile: string;
  email: string;
  address1?: string;
  address2?: string;
  address3?: string;
  city?: string;
  state?: string;
  postCode?: string;
  kyc?: string;
  dateOfBirth: string; // ISO string
}
export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/customer/listing");
        const json = await res.json();
        setCustomers(json);
      } catch (err) {
        console.error("Error fetching customers", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Customer List</h1>
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
              <th className="p-2">Post Code</th>
              <th className="p-2">KYC</th>
              <th className="p-2">DOB</th>
                            <th className="p-2">Action</th>

            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-2">{c.customerName}</td>
                <td className="p-2">{c.mobile}</td>
                <td className="p-2">{c.email}</td>
                <td className="p-2">
                  {[c.address1, c.address2, c.address3].filter(Boolean).join(", ")}
                </td>
                <td className="p-2">{c.city}</td>
                <td className="p-2">{c.state}</td>
                <td className="p-2">{c.postCode}</td>
                <td className="p-2">{c.kyc}</td>
                <td className="p-2">{new Date(c.dateOfBirth).toLocaleDateString()}</td>
                <td><button
      className="px-2 py-1 text-xs text-white bg-green-600 rounded"
      onClick={() => router.push(`/create-customer/${c.id}`)}
    >
      Edit
    </button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
