'use client';
import { useEffect, useState } from 'react';

interface Payment {
  id: string;
  amount: number;
  baseAmount: number;
  discount: number;
  createdAt: string;
  paymentMode:string;
  distributorName:string;
}

export default function PaymentHistoryPage() {
  const [history, setHistory] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/payments/super-admin-history')
      .then((res) => res.json())
      .then((data) => setHistory(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Payment History</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg border">
          <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-600">
            <tr>           
                   <th className="px-4 py-3 border-b">Distributor name</th>

              <th className="px-4 py-3 border-b">Payment ID</th>
              <th className="px-4 py-3 border-b">Paid Amount</th>
              <th className="px-4 py-3 border-b">Base Amount</th>
              {/* <th className="px-4 py-3 border-b">Due Amount</th> */}
              <th className="px-4 py-3 border-b">Discount %</th>
                            <th className="px-4 py-3 border-b">Payment Mode</th>

              <th className="px-4 py-3 border-b">Created Date</th>
              <th className="px-4 py-3 border-b">View Invoice</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-800">
            {history.map((item) => (
              <tr key={item.id} className="border-t">
                 <td className="px-4 py-2">{item.distributorName}</td>
                <td className="px-4 py-2">{item.id}</td>
                <td className="px-4 py-2 text-green-700 font-semibold">₹ {item.amount.toFixed(2)}</td>
                <td className="px-4 py-2">₹ {item.baseAmount.toFixed(2)}</td>
                {/* <td className="px-4 py-2 text-red-600">₹ {(item.baseAmount - item.amount).toFixed(2)}</td> */}
                <td className="px-4 py-2">{item.discount} %</td>
                <td className="px-4 py-2">{new Date(item.createdAt).toLocaleDateString()}</td>
                                <td className="px-4 py-2">{item.paymentMode} </td>

                <td className="px-4 py-2">
                  <a
                    href={`/payment/invoice/${item.id}`}
                    className="text-blue-600 hover:underline"
                    target="_blank"
                  >
                    View Invoice
                  </a>
                </td>
              </tr>
            ))}
            {history.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-4 text-center text-gray-400">
                  No payments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
