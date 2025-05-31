import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

interface JwtPayload {
  id: string;
  role: "DEALER" | "DISTRIBUTOR" | "SUPERADMIN";
  email:string;
}

interface Props {
  params: { id: string };
}

export default async function InvoicePage({ params }: Props) {
  // 1. Extract & verify token
  const cookieStore =await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return <div className="p-8 text-red-600">Unauthorized: No token found</div>;
  }

  let decoded: JwtPayload;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  } catch  {
    return <div className="p-8 text-red-600">Unauthorized: Invalid token</div>;
  }

  const userId = decoded.id;
  const userRole = decoded.role;
  const dealerName = decoded.email ||"unkonwn emaail";

  // 2. Fetch payment + dealer info
  const payment = await prisma.payment.findUnique({
    where: { id: params.id }
  });

  if (!payment) return <div className="p-8">Invoice not found</div>;

  // 3. If dealer, ensure they are viewing only their own invoice
  if (userRole === "DEALER" && payment.dealerId !== userId) {
    redirect("/unauthorized");
  }

// const dealerName = payment.dealer?.dealerName ?? "Unknown Dealer";

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-md p-8 border border-gray-200">
        <h1 className="text-3xl font-bold mb-6 text-center border-b pb-4">INVOICE</h1>

        <div className="mb-6 grid grid-cols-2 text-sm text-gray-700">
          <div>
            <p><strong>Invoice ID:</strong> {payment.id}</p>
            <p><strong>Dealer ID:</strong> {payment.dealerId}</p>
            <p><strong>Dealer Email:</strong> {dealerName}</p>
          </div>
          <div className="text-right">
            <p><strong>Date:</strong> {new Date(payment.createdAt).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {new Date(payment.createdAt).toLocaleTimeString()}</p>
          </div>
        </div>

        <table className="w-full border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border border-gray-300 px-4 py-2">Description</th>
              <th className="border border-gray-300 px-4 py-2 text-right">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Base Amount</td>
              <td className="border border-gray-300 px-4 py-2 text-right">{payment.baseAmount.toFixed(2)}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Discount ({payment.discount}%)</td>
              <td className="border border-gray-300 px-4 py-2 text-right">
                - {(payment.baseAmount * payment.discount / 100).toFixed(2)}
              </td>
            </tr>
            <tr className="bg-gray-50 font-semibold">
              <td className="border border-gray-300 px-4 py-2">Total Paid</td>
              <td className="border border-gray-300 px-4 py-2 text-right text-green-700">
                ₹ {payment.amount.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="mt-8 text-sm text-gray-600 text-center">
          Thank you for your payment. Please retain this invoice for your records.
        </div>
      </div>
    </div>
  );
}
