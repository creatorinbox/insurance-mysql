'use client';

import { useRef, useTransition } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';

export default function InsurancePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  const handleExport = () => {
    startTransition(async () => {
      const res = await fetch('/api/export-insurances');
      const data = await res.json();

      if (data.url) {
        const link = document.createElement('a');
        link.href = data.url;
        link.download = 'insurances.xlsx';
        link.click();
      } else {
        alert('Export failed');
      }
    });
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/import-insurances', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      alert('Import failed');
    } else {
      alert('Import completed');
    }
  };

  return (
    // <div className="p-8">
    //   <h1 className="text-xl font-bold mb-6">Insurance Import/Export</h1>

    //   <div className="flex flex-col md:flex-row gap-4">
    //     <button
    //       onClick={handleExport}
    //       className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
    //       disabled={isPending}
    //     >
    //       {isPending ? 'Exporting...' : 'Export Insurance'}
    //     </button>

    //     <label className="bg-green-600 text-white px-6 py-2 rounded cursor-pointer hover:bg-green-700 transition">
    //       Import Insurance
    //       <input
    //         type="file"
    //         accept=".xlsx"
    //         className="hidden"
    //         ref={fileInputRef}
    //         onChange={handleImport}
    //       />
    //     </label>
    //   </div>
    // </div>
     <div className="p-8">
      {/* <h1 className="text-xl font-bold mb-6">Allocate Policy</h1> */}
      <PageBreadcrumb pageTitle="Allocate Policy" />
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-1/2 h-48 bg-blue-100 grid rounded-2xl place-items-center">
        <div className='text-center w-[80%] m-auto'>
        <button
          onClick={handleExport}
          className="bg-blue-600 text-white mb-4 px-6 py-2 rounded hover:bg-blue-700 transition"
          disabled={isPending}
        >
          {isPending ? 'Exporting...' : 'Export Insurance'}
        </button>
<p className="text-blue-900 text-sm">
  Note: Only records with insurance statuses <strong>&apos;Under Review&apos;</strong> and <strong>&apos;Paid&apos;</strong> will be exported.
</p>        </div>
        </div>
        <div className="w-1/2 h-48 bg-green-100  rounded-2xl grid place-items-center">
        <div className='text-center w-[80%] m-auto'>
        <label className="bg-green-600 text-white px-6 py-2 rounded cursor-pointer hover:bg-green-700 transition">
          Import Insurance
          <input
            type="file"
            accept=".xlsx"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImport}
          />
        </label>
        <p className='text-green-900 text-sm mt-4'>Note: Please import only records with an insurance-allocated policy number.</p>
        </div>
        </div>
      </div>
    </div>
  );
}
