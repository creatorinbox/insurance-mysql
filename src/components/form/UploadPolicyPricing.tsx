'use client';
import { useState } from 'react';

export default function UploadPolicyPricing() {
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert('Select a file');

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/policy-pricing', {
      method: 'POST',
      body: formData,
    });

    const result = await res.json();
    alert(JSON.stringify(result));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="file" accept=".xlsx, .xls" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Upload</button>
    </form>
  );
}
