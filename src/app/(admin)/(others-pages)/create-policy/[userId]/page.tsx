"use client";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React, { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import { CalenderIcon, ChevronDownIcon } from "@/icons";
import Radio from "@/components/form/input/Radio";
import FileInput from "@/components/form/input/FileInput";
import { useParams } from "next/navigation";

export default function FormElements() {
  const [selectedValue, setSelectedValue] = useState("single");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const params = useParams();
const userId = params.userId as string;
  const [formData, setFormData] = useState({
    kitnumber: "",
    holder: "",
    productname: "",
    productid: "",
    certificateno: "",
    policyid: "",
    policynumber: "",
    startDate: "",
    expiryDate: "",
    tier: "",
    status: "",
  });

  const handleRadioChange = (value: string) => {
    setSelectedValue(value);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      console.log("Selected file:", file.name);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    // Append text inputs
    for (const key in formData) {
      formDataToSend.append(key, formData[key as keyof typeof formData]);
    }

    // Append radio group
    formDataToSend.append("insuranceType", selectedValue);

    // Append image file
    if (imageFile) {
      formDataToSend.append("image", imageFile);
    }
    formDataToSend.append("userId", userId);

    try {
      const response = await fetch("/api/policy", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) throw new Error("Failed to submit form");

      const result = await response.json();
      alert('Submitted Successfully')
      console.log("Submitted successfully:", result);
    } catch (err) {
      console.error("Form submission error:", err);
    }
  };

  const options = [
    { value: "Tier1", label: "Tier 1" },
    { value: "Tier2", label: "Tier 2" },
    { value: "Tier3", label: "Tier 3" },
  ];

  const statusoptions = [
    { value: "underbooking", label: "Under Booking" },
    { value: "rejected", label: "Rejected" },
    { value: "underreview", label: "Under Review" },
    { value: "active", label: "Active" },
    { value: "expired", label: "Expired" },
    { value: "cancelled", label: "Cancelled" },
    { value: "cacelledreissued", label: "Cancelled and Reissued" },
    { value: "endorsed", label: "Endorsed" },
  ];

  return (
    <div>
      <PageBreadcrumb pageTitle="Policy Create" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          <ComponentCard title="">
            <form className="space-y-6" onSubmit={handleSubmit} encType="multipart/form-data">
              {/* All fields here as you had — unchanged */}
              <div>
                <Label>QYK Kit Number</Label>
                <Input name="kitnumber" type="text" value={formData.kitnumber} onChange={handleChange} />
              </div>

              <div className="flex flex-wrap items-center gap-8">
                <Radio id="radio1" name="insuranceType" value="single" checked={selectedValue === "single"} onChange={handleRadioChange} label="Single" />
                <Radio id="radio2" name="insuranceType" value="household" checked={selectedValue === "household"} onChange={handleRadioChange} label="Household" />
              </div>

              <div>
                <Label>Policy Holder</Label>
                <Input name="holder" type="text" value={formData.holder} onChange={handleChange} />
              </div>

              <div>
                <Label>Product Name</Label>
                <Input name="productname" type="text" value={formData.productname} onChange={handleChange} />
              </div>

              <div>
                <Label>Product ID</Label>
                <Input name="productid" type="text" value={formData.productid} onChange={handleChange} />
              </div>

              <div>
                <Label>Tier</Label>
                <div className="relative">
                  <Select options={options} placeholder="Select Tier" onChange={(value) => handleSelectChange("tier", value)} className="dark:bg-dark-900" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
                    <ChevronDownIcon />
                  </span>
                </div>
              </div>

              <div>
                <Label>Certificate No</Label>
                <Input name="certificateno" type="text" value={formData.certificateno} onChange={handleChange} />
              </div>

              <div>
                <Label>Policy Id</Label>
                <Input name="policyid" type="text" value={formData.policyid} onChange={handleChange} />
              </div>

              <div>
                <Label>Policy Number</Label>
                <Input name="policynumber" type="text" value={formData.policynumber} onChange={handleChange} />
              </div>

              <div>
                <Label>Policy Start Date</Label>
                <div className="relative">
                <Input
  type="date"
  name="startDate"
  value={formData.startDate}
  onChange={handleChange}
  className="pr-12 relative z-10"
/>
<span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
  <CalenderIcon />
</span>
                </div>
              </div>

              <div>
                <Label>Expiry Date</Label>
                <div className="relative">
                  <Input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
                    <CalenderIcon />
                  </span>
                </div>
              </div>

              <div>
                <Label>Upload File</Label>
                <FileInput onChange={handleFileChange} className="custom-class" />
              </div>

              <div>
                <Label>Policy Status</Label>
                <div className="relative">
                  <Select options={statusoptions} placeholder="Select Status" onChange={(value) => handleSelectChange("status", value)} className="dark:bg-dark-900" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
                    <ChevronDownIcon />
                  </span>
                </div>
              </div>

              <div>
                <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
                  Submit
                </button>
              </div>
            </form>
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}
