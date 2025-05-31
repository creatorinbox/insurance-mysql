"use client";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React, { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
//import { CalenderIcon, ChevronDownIcon, EyeCloseIcon, EyeIcon, TimeIcon } from "@/icons";
import { ChevronDownIcon} from "@/icons";
import FileInput from "@/components/form/input/FileInput";
import TextArea from "@/components/form/input/TextArea";
import Radio from "@/components/form/input/Radio";



export default function FormElements() {
   //// const [showPassword, setShowPassword] = useState(false);
     const [message, setMessage] = useState("");
      //const [messageTwo, setMessageTwo] = useState("");
       const [selectedValue, setSelectedValue] = useState<string>("Status");
          
            const handleRadioChange = (value: string) => {
              setSelectedValue(value);
            };
      const options = [
        { value: "Tamilnadu", label: "Tamil Nadu" },
        { value: "Gujarat", label: "Gujarat" },
        { value: "Delhi", label: "Delhi" },
      ];
      const territory = [
        { value: "Metro", label: "Metro" },
        { value: "Urban", label: "Urban" },
        { value: "Rural", label: "Rural" },
        { value: "Growth", label: "Growth" },

      ];
      const insurance = [
        { value: "ICICILombard", label: "ICICI Lombard" },
        { value: "HDFCergo", label: "HDFC ERGO" },
      ];
       const policysubtype = [
              { value: "ADLD", label: "ADLD" },
              { value: "EW", label: "EW" },
              { value: "combo", label: "Combo ADLD And EW" },
            ];
            const saleschannel = [
              { value: "nbfc", label: "Bank kor NBFC" },
              { value: "Generaltrade", label: "General Trade" },
              { value: "Moderntrade", label: "Modern Trade" },
              { value: "Eccommerce", label: "Eccommerce" },];
              const locationcode = [
                { value: "nbfc", label: "Bank kor NBFC" },
                { value: "Generaltrade", label: "General Trade" },
                { value: "Moderntrade", label: "Modern Trade" },
                { value: "Eccommerce", label: "Eccommerce" },
            ];
      const handleSelectChange = (value: string) => {
        console.log("Selected value:", value);
      };
       const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          const file = event.target.files?.[0];
          if (file) {
            console.log("Selected file:", file.name);
          }
        };
  return (
    <div>
      <PageBreadcrumb pageTitle="Master Create" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="space-y-6">
        <ComponentCard title="">
      <div className="space-y-6">
        <div>
          <Label>Name</Label>
          <Input type="text" />
        </div>
        <div>
          <Label>Email</Label>
          <Input type="text" placeholder="info@gmail.com" />
        </div>
        <div>
          <Label>Phone Number</Label>
          <Input type="text" />
        </div>
        <div>
          <Label>City</Label>
          <Input type="text" />
        </div>
       
        <div>
          <Label>Select State</Label>
          <div className="relative">
            <Select
            options={options}
            placeholder="Select an option"
            onChange={handleSelectChange}
            className="dark:bg-dark-900"
          />
             <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <ChevronDownIcon/>
            </span>
          </div>
        </div>
        
        <div>
          <Label>Country</Label>
          <Input type="text" />
        </div>
        <div>
          <Label>Code</Label>
          <Input type="text" />
        </div>
      </div>
      <div>
          <Label>Agreement</Label>
          <Input type="text" />
        </div>
        <div>
          <Label>Commision</Label>
          <Input type="text" />
        </div>
        <div>
          <Label>GST</Label>
          <Input type="text" />
        </div>
        <div>
          <Label>License etc for the onboarding</Label>
          <Input type="text" />
        </div><div>
          <Label>Payment Cycle</Label>
          <Input type="text" />
        </div>
    </ComponentCard>
        </div>
        <div className="space-y-6"> 
        <ComponentCard title="">
        <div>
          <Label>Territory Mapping
          </Label>
          <div className="relative">
            <Select
            options={territory}
            placeholder="Select an option"
            onChange={handleSelectChange}
            className="dark:bg-dark-900"
          />
             <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <ChevronDownIcon/>
            </span>
          </div>
        </div>
        <div>
          <Label>Insurance Master

          </Label>
          <div className="relative">
            <Select
            options={insurance}
            placeholder="Select an option"
            onChange={handleSelectChange}
            className="dark:bg-dark-900"
          />
             <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <ChevronDownIcon/>
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-8">
        <Radio
          id="radio1"
          name="group1"
          value="Status"
          checked={selectedValue === "Status"}
          onChange={handleRadioChange}
          label="Status"
        />
        <Radio
          id="radio2"
          name="group1"
          value="Expiry"
          checked={selectedValue === "Expiry"}
          onChange={handleRadioChange}
          label="Expiry"
        />
       
      </div>
        <div>
          <Label>Policy Type</Label>
          <Input type="text" placeholder="General Insurance" />
        </div>
        <div>
          <Label>Policy Sub Type

          </Label>
          <div className="relative">
            <Select
            options={policysubtype}
            placeholder="Select an option"
            onChange={handleSelectChange}
            className="dark:bg-dark-900"
          />
             <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <ChevronDownIcon/>
            </span>
          </div>
        </div>
        <div>
          <Label>Sales Channel
          </Label>
          <div className="relative">
            <Select
            options={saleschannel}
            placeholder="Select an option"
            onChange={handleSelectChange}
            className="dark:bg-dark-900"
          />
             <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <ChevronDownIcon/>
            </span>
          </div>
        </div>
        <div>
          <Label>Product Master</Label>
          <Input type="text" placeholder="QYK shield" />
        </div>
        <div>
          <Label>Commission Master</Label>
          <Input type="text" />
        </div><div>
          <Label>Tax Slab</Label>
          <Input type="text"  />
        </div>
        <div>
          <Label>Policy Number</Label>
          <Input type="text"  placeholder="QK25000001"/>
        </div>
        <div>
          <Label>Location Codesś
          </Label>
          <div className="relative">
            <Select
            options={locationcode}
            placeholder="Select an option"
            onChange={handleSelectChange}
            className="dark:bg-dark-900"
          />
             <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <ChevronDownIcon/>
            </span>
          </div>
        </div>
        </ComponentCard>

       </div>
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

      <div className="space-y-6"> 
        <ComponentCard title="">
        <div>
        <Label>Upload file</Label>
        <FileInput onChange={handleFileChange} className="custom-class" />
      </div>
            <div>
          <Label>Address</Label>
          <TextArea
            value={message}
            onChange={(value) => setMessage(value)}
            rows={6}
          />
        </div>
        </ComponentCard>

       </div>
       </div>
    </div>
  );
}
