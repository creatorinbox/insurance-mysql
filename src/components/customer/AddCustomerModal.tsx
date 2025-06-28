// components/customer/AddCustomerModal.tsx
"use client";
import React, { useState, useEffect } from "react";
//import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
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
interface Props {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
   customer?: Customer| null  | undefined; 
}

export default function AddCustomerModal({ isOpen, onClose,isEdit, customer  }: Props) {
  const [formData, setFormData] = useState({
    title: "",
    customerName: "",
    mobile: "",
    email: "",
    address1: "",
    city: "",
    state: "",
    postCode: "",
    kyc: "",
    kycNumber:"",
    dateOfBirth: "",
  });
const [cities, setCities] = useState<string[]>([]);
const [state, setStates] = useState<string[]>([]);


  useEffect(() => {
    if (isOpen && isEdit && customer) {
        console.log("🟡 Customer data received for edit:", customer);
      setFormData({
        title: customer.title || "",
        customerName: customer.customerName || "",
        mobile: customer.mobile || "",
        email: customer.email || "",
        address1: customer.address1 || "",
        city: customer.city || "",
        state: customer.state || "",
        postCode: customer.postCode || "",
        kyc: customer.kyc || "",
        kycNumber:customer.kycNumber || "",
        dateOfBirth: customer.dateOfBirth ? customer.dateOfBirth : "",
      });
    } 
  }, [isOpen, isEdit, customer]);
  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };
  const handleChange = async (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });

  if (name === 'postCode' && value.length === 6) {
    try {
      const res = await fetch('/api/pincode-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pincode: value }),
      });

      const data = await res.json();

    
    if (res.ok && Array.isArray(data.cities)) {
      setCities(data.cities);
      setStates(data.state);

      setFormData((prev) => ({
        ...prev,
        city: data.cities[0] || "", // Default first city
        state: data.state || "",
                postCode: value,
      }));
    }
    } catch (error: unknown) {
      console.error('Failed to lookup pincode', error);
    }
  }
};
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault(); // ✅ Prevents page reload
    const endpoint = isEdit ? "/api/customer/update" : "/api/customer/create";
  
    // Ensure original mobile number is passed for update
    const requestData = isEdit
      ? {
          ...formData,
          mobile: customer?.mobile, // keep original mobile for lookup
        }
      : formData;
  
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    });
  
    if (res.ok) {
      alert(isEdit ? "Customer updated successfully!" : "Customer created successfully!");
      onClose();
    } else {
      const data = await res.json();
      alert(data.error || "Something went wrong.");
    }
    onClose();
  };


//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const res = await fetch("/api/customer/create", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(formData),
//     });

//     if (res.ok) {
//       alert("Customer added successfully!");
//       onClose();
//     } else {
//       alert("Failed to add customer");
//     }
//   };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-[500px] space-y-4">
        <h2 className="text-lg font-semibold">Add New Customer</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* <Input name="title" value={formData.title}  placeholder="Title" onChange={handleChange} /> */}
          <div>
  <label className="block text-sm font-medium text-gray-700">Title</label>
  <select
    name="title"
    value={formData.title}
    onChange={handleChange}
    required
    className="w-full p-2 border rounded"
  >
    <option value="">Select</option>
    <option value="Mr.">Mr.</option>
    <option value="Mrs.">Mrs.</option>
    <option value="Ms.">Ms.</option>
  </select>
</div>
          <Input name="customerName" value={formData.customerName} placeholder="Customer Name" onChange={handleChange} />
          <Input
  name="mobile"
  value={formData.mobile}
  placeholder="Mobile"
  onChange={handleChange}
  disabled={isEdit}
/>
          {/* <Input name="mobile" value={formData.mobile} placeholder="Mobile" onChange={handleChange} /> */}
          <Input name="email" value={formData.email} placeholder="Email" onChange={handleChange} />
          <Input name="address1" value={formData.address1} placeholder="Address Line 1" onChange={handleChange} />
                    <Input name="postCode" value={formData.postCode}  placeholder="Post Code" onChange={handleChange} />

         {/* <Input name="city" value={formData.city} placeholder="City" onChange={handleChange} /> */}
         <div>
  <label className="block text-sm font-medium text-gray-700">City</label>
  <select
    name="city"
    value={formData.city}
    onChange={handleChange}
    required
    className="w-full p-2 border rounded"
  >
    <option value="">-- Select City --</option>
    {cities.map((city) => (
      <option key={city} value={city}>
        {city}
      </option>
    ))}
  </select>
</div>
<div>
  <label className="block text-sm font-medium text-gray-700">State</label>
  <input
    type="text"
    name="state"
    value={state}
    readOnly
    className="w-full p-2 border rounded bg-gray-100"
  />
</div>
{/* <Input name="state" value={formData.state} placeholder="State" onChange={handleChange} /> */}
          {/* <Input name="kyc"  value={formData.kyc} placeholder="KYC Type" onChange={handleChange} /> */}
          <div>
  <label className="block text-sm font-medium text-gray-700">KYC Type</label>
  <select
    name="kyc"
    value={formData.kyc}
    onChange={handleChange}
    required
    className="w-full p-2 border rounded"
  >
    <option value="">Select KYC</option>
    <option value="PAN Card">PAN Card</option>
    <option value="Aadhaar">Aadhaar</option>
    <option value="Voter ID">Voter ID</option>
    <option value="Passport">Passport</option>
  </select>
</div>

{formData.kyc && (
  <Input
    name="kycNumber"
    value={formData.kycNumber}
    placeholder="KYC Number"
    onChange={handleChange}
  />
)}  <label className="block text-sm font-medium text-gray-700">Date of Birth</label>

          <Input name="dateOfBirth" value={formData.dateOfBirth}  type="date" placeholder="Date of Birth" onChange={handleChange} />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
            {/* <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add</button> */
              <button type="submit" className="btn btn-primary">
              {isEdit ? "Update" : "Create"} Customer
            </button>}
          </div>
        </form>
      </div>
    </div>
  );
}
