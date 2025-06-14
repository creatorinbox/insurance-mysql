"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PayNowPopup from "@/components/PayNowPopup";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
interface DistributorPayment {
  id: number;
  dealerName: string;
  salesAmount: number;
  dueAmount: number;
  businessPartnerName: string;
  dealerLocation: string;
  status: "ACTIVE" | "BLOCKED" | "TERMINATED" | "pending";
  effectiveDeduction: number;
  finalDue: number;
  gst:number;
  sgst:number;
}
interface BulkPaymentData {
  baseAmount: number;
  discount: number;
  payableAmount: number;
  dealerIds: number[];
  gst:number;
  sgst:number;
    dueAmount: number;

}
export default function DistributorPaymentsPage() {
    const [dealers, setDealers] = useState<DistributorPayment[]>([]);
  const [selectedDealers, setSelectedDealers] = useState<number[]>([]);
const [bulkPaymentData, setBulkPaymentData] = useState<BulkPaymentData | null>(null);
  const router = useRouter();
const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

function toggleDropdown(dealerId: number) {
  setOpenDropdownId(openDropdownId === dealerId ? null : dealerId);
}

function closeDropdown() {
  setOpenDropdownId(null);
}
  useEffect(() => {
    fetch("/api/distributor-payments", { credentials: "include" })
      .then((res) => res.json())
      .then((res) => setDealers(res));
  }, []);

  // ✅ Handle selection of dealers for bulk payment
  const toggleSelection = (dealerId: number) => {
    setSelectedDealers((prev) =>
      prev.includes(dealerId) ? prev.filter((id) => id !== dealerId) : [...prev, dealerId]
    );
  };


  // ✅ Calculate Bulk Payment Data
  const handleBulkPayNow = () => {
    if (selectedDealers.length === 0) {
      alert("Please select dealers for bulk payment.");
      return;
    }

    const totalBaseAmount = selectedDealers.reduce((acc, dealerId) => {
      const dealer = dealers.find((d) => d.id === dealerId);
      return acc + (dealer?.salesAmount || 0);
    }, 0);

    const totalPayableAmount = selectedDealers.reduce((acc, dealerId) => {
      const dealer = dealers.find((d) => d.id === dealerId);
      return acc + (dealer?.finalDue || 0);
    }, 0);

    const totalDiscount = selectedDealers.reduce((acc, dealerId) => {
      const dealer = dealers.find((d) => d.id === dealerId);
      return acc + (dealer?.effectiveDeduction || 0);
    }, 0);
    const dueAmount = selectedDealers.reduce((acc, dealerId) => {
      const dealer = dealers.find((d) => d.id === dealerId);
      return acc + (dealer?.dueAmount || 0);
    }, 0);
    const gst = selectedDealers.reduce((acc, dealerId) => {
      const dealer = dealers.find((d) => d.id === dealerId);
      return acc + (dealer?.gst || 0);
    }, 0);
    const sgst = selectedDealers.reduce((acc, dealerId) => {
      const dealer = dealers.find((d) => d.id === dealerId);
      return acc + (dealer?.sgst || 0);
    }, 0);

    setBulkPaymentData({
      baseAmount: totalBaseAmount,
      discount: totalDiscount,
      payableAmount: totalPayableAmount,
      dealerIds: selectedDealers,
      gst:gst,
      sgst:sgst,
      dueAmount:dueAmount,
    });
  };
const handleAction = async (id: number, action: "block" | "terminate"| "active") => {
    const confirmMsg = `Are you sure you want to ${action} this dealer?`;
    if (!window.confirm(confirmMsg)) return;

    const res = await fetch(`/api/dealer/${id}/${action}`, {
      method: "POST",
      credentials: "include",
    });

    if (res.ok) {
      alert(`Dealer ${action}d successfully.`);
      // Optionally refetch
      const updated = await fetch("/api/distributor-payments", { credentials: "include" });
      const data = await updated.json();
      console.log('result',data);
      setDealers(data);
    } else {
      alert(`Failed to ${action} dealer.`);
    }
  };
  // ✅ Handle bulk payment action
  // const handleBulkPayment = async () => {
  //   if (selectedDealers.length === 0) {
  //     alert("Please select dealers for bulk payment.");
  //     return;
  //   }

  //   const confirm = window.confirm("Are you sure you want to process payment for selected dealers?");
  //   if (!confirm) return;

  //   const res = await fetch("/api/bulk-paynow", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ dealerIds: selectedDealers }),
  //     credentials: "include",
  //   });

  //   if (res.ok) {
  //     alert("Bulk payment processed successfully!");
  //     setSelectedDealers([]); // Clear selection after payment
  //     const updated = await fetch("/api/distributor-payments", { credentials: "include" });
  //     const data = await updated.json();
  //     setDealers(data);
  //   } else {
  //     alert("Failed to process bulk payment.");
  //   }
  // };

  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold mb-4">Distributor Payments</h1>

      {/* ✅ Bulk Pay Button */}
      {/* <button
        onClick={handleBulkPayment}
        className={`mb-4 px-4 py-2 text-white rounded ${selectedDealers.length > 0 ? "bg-blue-600" : "bg-gray-400 cursor-not-allowed"}`}
        disabled={selectedDealers.length === 0}
      >
        Pay Now (Bulk)
      </button> */}
  <button
        onClick={handleBulkPayNow}
        className={`mb-4 px-4 py-2 text-white rounded ${selectedDealers.length > 0 ? "bg-blue-600" : "bg-gray-400 cursor-not-allowed"}`}
        disabled={selectedDealers.length === 0}
      >
        Pay Now (Bulk)
      </button>

      {bulkPaymentData && (
        <PayNowPopup
          baseAmount={bulkPaymentData.baseAmount}
          discount={bulkPaymentData.discount}
          payableAmount={bulkPaymentData.payableAmount}
          dealerIds={bulkPaymentData.dealerIds} // ✅ Handle bulk payment
          bulkPayment={true}
           dueAmount={bulkPaymentData.dueAmount}
                    gst={bulkPaymentData.gst}
                    sgst={bulkPaymentData.sgst}
        />
      )}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">Select</th>
            <th className="p-2">Dealer Name</th>
            <th className="p-2">Dealer Location</th>
            <th className="p-2">Sales Amount</th>
            <th className="p-2">Due Amount</th>
            <th className="p-2">View Dealer Insurance</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {dealers.map((dealer) => (
            <tr key={dealer.id} className="border-b">
              {/* ✅ Checkbox for selection */}
              <td className="p-2">
                <input
                  type="checkbox"
                  checked={selectedDealers.includes(dealer.id)}
                  onChange={() => toggleSelection(dealer.id)}
                />
              </td>

              <td className="p-2">{dealer.dealerName}</td>
              <td className="p-2">{dealer.dealerLocation}</td>
              <td className="p-2">{dealer.salesAmount ? `₹ ${dealer.salesAmount}` : ""}</td>
              <td className="p-2">{dealer.dueAmount ? `₹ ${dealer.dueAmount}` : "Paid"}</td>

              <td className="p-2">
                <button
                  onClick={() => router.push(`/dealer/insurance/${dealer.id}`)}
                  className="text-blue-600 underline"
                >
                  View
                </button>
              </td>

              {/* <td className="p-2">{dealer.status}</td> */}
<td className="p-2">
  {dealer.status === "ACTIVE" && <i className="fas fa-check-circle text-green-500"></i>}
  {dealer.status === "pending" && <i className="fas fa-hourglass-half text-yellow-500"></i>}
  {dealer.status === "BLOCKED" && <i className="fas fa-ban text-red-500"></i>}
  {dealer.status === "TERMINATED" && <i className="fas fa-times-circle text-gray-500"></i>}
</td>
              {/* <td className="p-2 space-x-2">
                {dealer.status === "ACTIVE" && (
                  <>
                    <button
                      onClick={() => handleAction(dealer.id, "block")}
                      className="px-2 py-1 text-xs text-white bg-yellow-500 rounded"
                    >
                      Block
                    </button>
                    <button
                      onClick={() => handleAction(dealer.id, "terminate")}
                      className="px-2 py-1 text-xs text-white bg-red-600 rounded"
                    >
                      Terminate
                    </button>
                  </>
                )}

                {dealer.status === "BLOCKED" && (
                  <button
                    onClick={() => handleAction(dealer.id, "active")}
                    className="px-2 py-1 text-xs text-white bg-green-600 rounded"
                  >
                    Activate
                  </button>
                )}

                {dealer.status === "pending" && (
                  <button
                    onClick={() => handleAction(dealer.id, "active")}
                    className="px-2 py-1 text-xs text-white bg-green-600 rounded"
                  >
                    Approve
                  </button>
                )}

                {dealer.status === "TERMINATED" && (
                  <span className="text-xs text-gray-500">Terminated</span>
                )}

                {dealer.dueAmount > 0 && (
                   <PayNowPopup
                    baseAmount={dealer.salesAmount}
                    dealerIds={[dealer.id]} // ✅ Handle single payments
                    discount={dealer.effectiveDeduction}
                    payableAmount={dealer.finalDue}
                    bulkPayment={false}
                    dueAmount={dealer.dueAmount}
                    gst={dealer.gst}
                    sgst={dealer.sgst}

                  />
                )}
                <button
      className="px-2 py-1 text-xs text-white bg-green-600 rounded"
      onClick={() => router.push(`/create-dealer/${dealer.id}`)}
    >
      Edit
    </button>
              </td> */}
              <td className="p-2 relative">
  {/* Three-dot menu button */}
  <button onClick={() => toggleDropdown(dealer.id)} className="text-gray-600 hover:text-gray-900 px-2 py-1">
    <i className="fas fa-ellipsis-v"></i> {/* Three-dot menu icon */}
  </button>

  {/* Dropdown menu (conditionally displayed when dealer's dropdown is open) */}
  {openDropdownId === dealer.id && (
    <Dropdown isOpen={true} onClose={closeDropdown} className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md p-2">
      {dealer.status === "ACTIVE" && (
        <>
          <DropdownItem onItemClick={() => handleAction(dealer.id, "block")}>Block Dealer</DropdownItem>
          <DropdownItem onItemClick={() => handleAction(dealer.id, "terminate")}>Terminate Dealer</DropdownItem>
        </>
      )}

      {dealer.status === "BLOCKED" && (
        <DropdownItem onItemClick={() => handleAction(dealer.id, "active")}>Activate Dealer</DropdownItem>
      )}

      {dealer.status === "pending" && (
        <DropdownItem onItemClick={() => handleAction(dealer.id, "active")}>Approve Dealer</DropdownItem>
      )}

      <DropdownItem onItemClick={() => router.push(`/create-dealer/${dealer.id}`)}>Edit Dealer</DropdownItem>

      {/* ✅ PayNowPopup for handling payments */}
      {dealer.dueAmount > 0 && (
        <DropdownItem>
          <PayNowPopup
            baseAmount={dealer.salesAmount}
            dealerIds={[dealer.id]} // ✅ Handle single payments
            discount={dealer.effectiveDeduction}
            payableAmount={dealer.finalDue}
            bulkPayment={false}
            dueAmount={dealer.dueAmount}
            gst={dealer.gst}
            sgst={dealer.sgst}
          />
        </DropdownItem>
      )}
    </Dropdown>
  )}
</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
