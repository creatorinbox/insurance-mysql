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
  kycNumber:string;
  dateOfBirth: string;
}
export default function FormElements() {
    const [showThankYouModal, setShowThankYouModal] = useState(false);
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
const [selectedMake, setSelectedMake] = useState("");
const [planCodes, setPlanCodes] = useState<{ id: number; name: string }[]>([])
// Example make list — replace with your own list or fetch dynamically
const makeOptions = [
  { value: "Sony", label: "Sony" },
  { value: "Samsung", label: "Samsung" },
  { value: "LG", label: "LG" },
  { value: "Others", label: "Others" },
];
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
 async function fetchPlanCodes() {
    const res = await fetch("/api/plan-codes")
    const data = await res.json()
    setPlanCodes(data)
  }
  fetchPlanCodes()
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
 const membershipFees = (data.plan.price-(data.plan.price * 0.15)).toFixed(2);
const salesAmount=data.plan.price;
  // Add Membership Fee to FormData
  form.append("membershipFees", membershipFees);
    form.append("salesAmount", salesAmount);

  // Show confirmation popup
  setPlanDetails(data.plan); // assume the response has plan detail
  setFormDataToSubmit(form);
  setShowConfirmModal(true);
};
const handleFinalSubmit = async () => {
  if (!formDataToSubmit) return;
// const make = selectedMake === "Others"
//   ? (formDataToSubmit.get("make") as string) // from the text field
//   : selectedMake; // from the dropdown
  const res = await fetch("/api/insurance", {
    method: "POST",
    body: formDataToSubmit,
  });

  setShowConfirmModal(false);

  if (!res.ok) {
    alert("Failed to create insurance");
  //  router.push("/insurance-tables");
  } else {
    alert("Insurance created successfully");
          setShowThankYouModal(true); // Show the "Thank You" popup
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
 {notFound && ( <div className="space-y-2 border p-4 bg-gray-50 rounded"><p><strong>Not Found</strong></p></div> )}
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

         
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="px-4 py-2 text-white bg-yellow-500 rounded hover:bg-yellow-600"
              >
                Add Customer
              </button>
       
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
                          { value: "adld", label: "QYK Max" },
        { value: "combo1Year", label: "QYK Shield " },

        { value: "ew1Year", label: "QYK Protect 1 Year" },
        { value: "ew2Year", label: "QYK Protect 2 Year" },
        { value: "ew3Year", label: "QYK Protect 3 Year" },
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
            {/* <div>
              <Label>Make</Label>
              <Input name="make" type="text" />
            </div> */}
            <div>
  <Label>Plan Code</Label>
  <div className="relative">
    <Select
      name="planCodeId"
      options={planCodes.map((p) => ({
        value: p.id.toString(),
        label: p.name
      }))}
      placeholder="Select Plan Code"
      onChange={() => {}}
      className="dark:bg-dark-900"
    />
    <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
      <ChevronDownIcon />
    </span>
  </div>
</div>
<div>
  <Label>Make</Label>
  {selectedMake === "Others" ? (
    <Input name="make" placeholder="Enter custom make" />
  ) : (
    <div className="relative">
     <Select
  name="make"
  options={makeOptions}
  onChange={(val: string) => setSelectedMake(val)}
  placeholder="Select Make"
  className="dark:bg-dark-900"
/>
      <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <ChevronDownIcon />
      </span>
    </div>
  )}
</div>
            <div>
              <Label>Model No</Label>
              <Input name="modelNo" type="text" />
            </div>
<div>
              <Label>LAN Number</Label>
              <Input name="lanNumber" type="text" />
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
      <p><strong>Asset:</strong> {planDetails.category}</p>
      <p>
        <strong>Invoice Amount:</strong>{" "}
        ₹{String(formDataToSubmit?.get("invoiceAmount") ?? "")}
      </p>
      <p><strong>Product:</strong> {planDetails.ewYear}</p>
      <p><strong>Premium Price:</strong> ₹{planDetails.price}</p>
            <p><strong>Membership Fees(15%):</strong> ₹{(planDetails.price*15/100)}</p>

      {/* <p><strong>Invoice Amount:</strong> ₹{formDataToSubmit?.get("invoiceAmount")}</p> */}
      {/* Horizontal Line */}
      <hr className="my-4 border-gray-300" />
      <p><strong>Due Amount:</strong> ₹{planDetails.price-(planDetails.price*15/100)}</p>

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
{/* Thank You Modal */}
      {showThankYouModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold">🎉 Thank You!</h2>
            <p className="text-gray-600">Your insurance has been created successfully.</p>
            <button
              onClick={() => {
                setShowThankYouModal(false);
                router.push("/insurance-tables"); // Redirect after closing
              }}
              className="mt-4 px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Close & View Insurance
            </button>
          </div>
        </div>
      )}
    </div>
   

  );
}
