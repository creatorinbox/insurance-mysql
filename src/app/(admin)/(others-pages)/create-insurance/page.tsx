"use client";

import React, { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import { ChevronDownIcon } from "@/icons";
//import { useParams } from "next/navigation";
import AddCustomerModal from "@/components/customer/AddCustomerModal";
import { useRouter } from "next/navigation";
interface PlanDetails {
  category: string;
  ewYear: string;
  price: number;
}

interface Customer {
   title: string;
  customerName: string;
  mobile: string;
  email: string;
  address1: string;
  city: string;
  state: string;
  postCode: string;
  kyc: string;
  dateOfBirth: string;
}
export default function FormElements() {
  //const { userId } = useParams<{ userId: string }>();
  const [showModal, setShowModal] = useState(false);
  const [policies, setPolicies] = useState<{ id: string; category: string }[]>([]);
 // const [dealers, setDealers] = useState<{ id: string; dealerName: string }[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
const [formDataToSubmit, setFormDataToSubmit] = useState<FormData | null>(null);
const [planDetails, setPlanDetails] = useState<PlanDetails | null>(null); // to show in modal
      const router = useRouter();

  const [mobileInput, setMobileInput] = useState("");
  const [customerData, setCustomer] = useState<Customer | null>(null);
  const [notFound, setNotFound] = useState(false);
// const states = [
//   { value: "01", label: "Andhra Pradesh" },
//   { value: "02", label: "Arunachal Pradesh" },
//   { value: "03", label: "Assam" },
//   { value: "04", label: "Bihar" },
//   { value: "05", label: "Chhattisgarh" },
//   { value: "06", label: "Goa" },
//   { value: "07", label: "Gujarat" },
//   { value: "08", label: "Haryana" },
//   { value: "09", label: "Himachal Pradesh" },
//   { value: "10", label: "Jharkhand" },
//   { value: "11", label: "Karnataka" },
//   { value: "12", label: "Kerala" },
//   { value: "13", label: "Madhya Pradesh" },
//   { value: "14", label: "Maharashtra" },
//   { value: "15", label: "Manipur" },
//   { value: "16", label: "Meghalaya" },
//   { value: "17", label: "Mizoram" },
//   { value: "18", label: "Nagaland" },
//   { value: "19", label: "Odisha" },
//   { value: "20", label: "Punjab" },
//   { value: "21", label: "Rajasthan" },
//   { value: "22", label: "Sikkim" },
//   { value: "23", label: "Tamil Nadu" },
//   { value: "24", label: "Telangana" },
//   { value: "25", label: "Tripura" },
//   { value: "26", label: "Uttar Pradesh" },
//   { value: "27", label: "Uttarakhand" },
//   { value: "28", label: "West Bengal" },
//   { value: "29", label: "Andaman and Nicobar Islands" },
//   { value: "30", label: "Chandigarh" },
//   { value: "31", label: "Dadra and Nagar Haveli" },
//   { value: "32", label: "Daman and Diu" },
//   { value: "33", label: "Delhi" },
//   { value: "34", label: "Lakshadweep" },
//   { value: "35", label: "Puducherry" },
// ];
  // Fetch policies and dealers
  useEffect(() => {
    async function fetchOptions() {
      try {
        const [policyRes, dealerRes] = await Promise.all([
          fetch("/api/policy-pricing"),
          fetch("/api/dealer"),
        ]);

        const [policyData] = await Promise.all([
          policyRes.json(),
          dealerRes.json(),
        ]);

        setPolicies(policyData);
        //setDealers(dealerData);
      } catch (error) {
        console.error("Failed to fetch dropdown data", error);
      }
    }

    fetchOptions();
  }, []);

  // Search Customer
  const handleSearch = async () => {
    const res = await fetch("/api/customer/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile: mobileInput }),
    });

    const data = await res.json();

    if (data.exists) {
      setCustomer(data.customer);
      setNotFound(false);
    } else {
      setCustomer(null);
      setNotFound(true);
    }
  };

  // Form Submit
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const form = new FormData(e.currentTarget as HTMLFormElement);
  //   form.append("userId", userId);

  //   const res = await fetch("/api/insurance", {
  //     method: "POST",
  //     body: form,
  //   });

  //   if (!res.ok) {
  //     alert("Failed to create insurance");
  //           router.push("/insurance-tables");


  //   } else {
  //     alert("Insurance created successfully");
  //   }
  // };
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const form = new FormData(e.currentTarget as HTMLFormElement);

  const productName = form.get("productName")?.toString();
  const ewYear = form.get("ewYear")?.toString();
  const invoiceAmount = form.get("invoiceAmount")?.toString();

  // Call pricing API
  const res = await fetch("/api/plan-pricing-check", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productName, ewYear, invoiceAmount }),
  });

  const data = await res.json();

  if (!res.ok || !data.valid) {
    alert("No matching plan pricing found!");
    return;
  }

  // Show confirmation popup
  setPlanDetails(data.plan); // assume the response has plan detail
  setFormDataToSubmit(form);
  setShowConfirmModal(true);
};
const handleFinalSubmit = async () => {
  if (!formDataToSubmit) return;

  const res = await fetch("/api/insurance", {
    method: "POST",
    body: formDataToSubmit,
  });

  setShowConfirmModal(false);

  if (!res.ok) {
    alert("Failed to create insurance");
    router.push("/insurance-tables");
  } else {
    alert("Insurance created successfully");
    router.push("/insurance-tables");
  }
};

console.log('catval',policies);
  return (
    <div>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <PageBreadcrumb pageTitle="Insurance Create" />

        {/* Mobile Search Section */}
        <ComponentCard title="Customer Search">
          <div className="space-y-4">
            <Label>Mobile Number</Label>
            <div className="flex gap-2">
              <Input
                name="mobileSearch"
                type="text"
                value={mobileInput}
                onChange={(e) => setMobileInput(e.target.value)}
              />
              <button
                type="button"
                onClick={handleSearch}
                className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
              >
                Search
              </button>
            </div>

            {customerData && (
              <div className="space-y-2 border p-4 bg-gray-50 rounded">
                <p><strong>Name:</strong> {customerData.customerName}</p>
                <p><strong>Email:</strong> {customerData.email}</p>
                <p><strong>Address:</strong> {customerData.address1}</p>
                <p><strong>Mobile:</strong> {customerData.mobile}</p>
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="px-4 py-2 mt-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                  Edit Customer
                </button>
              </div>
            )}

            {notFound && (
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="px-4 py-2 text-white bg-yellow-500 rounded hover:bg-yellow-600"
              >
                Add Customer
              </button>
            )}
          </div>
        </ComponentCard>

        {/* Product + Tier + Policy + Dealer */}
        <ComponentCard title="">
          <div className="space-y-6">
         
{/* 
            <div>
              <Label>Tier</Label>
              <div className="relative">
                <Select
                  name="tier"
                  options={[
                    { value: "Tier1", label: "Tier 1" },
                    { value: "Tier2", label: "Tier 2" },
                    { value: "Tier3", label: "Tier 3" },
                  ]}
                  placeholder="Select tier"
                  onChange={() => {}}
                  className="dark:bg-dark-900"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronDownIcon />
                </span>
              </div>
            </div> */}

            {/* <div>
              <Label>Product ID</Label>
              <Input name="productId" type="text" />
            </div> */}
{/* <div>
  <Label>State</Label>
  <div className="relative">
    <Select
      name="stateCode"
      options={states}
      placeholder="Select State"
      onChange={() => {}}
      className="dark:bg-dark-900"
    />
    <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
      <ChevronDownIcon />
    </span>
  </div>
</div> */}
            <div>
              <Label>Product Name</Label>
              <div className="relative">
                <Select
                  name="productName"
                  options={policies.map((p) => ({
                    value: p.category,
                    label: p.category,
                  }))}
                  placeholder="Select Product Name"
                  onChange={() => {}}
                  className="dark:bg-dark-900"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronDownIcon />
                </span>
              </div>

            </div>
               <div>
              <Label>Extended Warranty Period</Label>
              <div className="relative">
                <Select
                  name="ewYear"
                 options={[
                          { value: "adld", label: "ADLD" },
        { value: "combo1Year", label: "COMBO" },

        { value: "ew1Year", label: "1 Year" },
        { value: "ew2Year", label: "2 Year" },
        { value: "ew3Year", label: "3 Year" },
      ]}
                  placeholder="Select Extended Warranty Period"
                  onChange={() => {}}
                  className="dark:bg-dark-900"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronDownIcon />
                </span>
              </div>
            </div>
{/* 
            <div>
              <Label>Dealer</Label>
              <div className="relative">
                <Select
                  name="dealerId"
                  options={dealers.map((d) => ({
                    value: d.id,
                    label: d.dealerName,
                  }))}
                  placeholder="Select dealer"
                  onChange={() => {}}
                  className="dark:bg-dark-900"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronDownIcon />
                </span>
              </div>
            </div> */}
          </div>
        </ComponentCard>

        {/* Invoice & Device Details */}
        <ComponentCard title="">
          <div className="space-y-6">
            <div>
              <Label>Make</Label>
              <Input name="make" type="text" />
            </div>

            <div>
              <Label>Model No</Label>
              <Input name="modelNo" type="text" />
            </div>

            <div>
              <Label>Invoice Date</Label>
              <Input name="invoiceDate" type="date" />
            </div>

            <div>
              <Label>Invoice Amount</Label>
              <Input name="invoiceAmount" type="text" />
            </div>

            <div>
              <Label>Invoice No</Label>
              <Input name="invoiceNo" type="text" />
            </div>

            <div>
              <Label>IMEI No / SR. No</Label>
              <Input name="imeiNumber" type="text" />
            </div>
          </div>
        </ComponentCard>

        {/* Submit */}
        <ComponentCard title="">
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </ComponentCard>
      </form>

      {showModal && (
        <AddCustomerModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          isEdit={!!customerData}
          customer={customerData}
        />
      )}
       {showConfirmModal && planDetails  &&(
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded shadow-xl w-full max-w-md">
      <h2 className="text-lg font-bold mb-4">Confirm Plan Pricing</h2>
      <p><strong>Product:</strong> {planDetails.category}</p>
      <p><strong>Warranty:</strong> {planDetails.ewYear}</p>
      <p><strong>Expected Price:</strong> ₹{planDetails.price}</p>
      {/* <p><strong>Invoice Amount:</strong> ₹{formDataToSubmit?.get("invoiceAmount")}</p> */}
<p>
        <strong>Invoice Amount:</strong>{" "}
        ₹{String(formDataToSubmit?.get("invoiceAmount") ?? "")}
      </p>
      <div className="mt-4 flex justify-end space-x-3">
        <button
          onClick={() => setShowConfirmModal(false)}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Cancel
        </button>
        <button
          onClick={handleFinalSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Confirm & Submit
        </button>
      </div>
    </div>
  </div>
)}
    </div>
   

  );
}
