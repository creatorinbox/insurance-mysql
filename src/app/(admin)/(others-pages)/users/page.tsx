'use client';

import React, { useState } from 'react';

interface RelatedOption {
  id: string;
  display: string;
  mobile: string;
}

export default function CreateUserPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    role: 'DEALER',
    referenceId: '', // stores related table id
  });

  const [relatedOptions, setRelatedOptions] = useState<RelatedOption[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRole = e.target.value;
    setFormData({ ...formData, role: selectedRole, referenceId: '' });

    let endpoint = '';
    switch (selectedRole) {
      case 'DEALER':
        endpoint = '/api/dealer';
        break;
      case 'DISTRIBUTOR':
        endpoint = '/api/distributor';
        break;
      case 'NBFC':
        endpoint = '/api/nbfcs';
        break;
      case 'BANK':
        endpoint = '/api/banks';
        break;
        case 'CUSTOMER':
        endpoint = '/api/customer';
        break;
      default:
        setRelatedOptions([]);
        return;
    }

    const res = await fetch(endpoint, { credentials: 'include' });
    const data = await res.json();
    setRelatedOptions(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('User creation failed');
      const result = await res.json();
      alert(`User ${result.name} created!`);
    } catch (error) {
      alert('Error creating user');
      console.error(error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Create User</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            type="text"
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Mobile</label>
          <input
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            type="text"
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Email</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Password</label>
          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            type="password"
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleRoleChange}
            className="w-full border p-2 rounded"
          >
            <option value="DEALER">Dealer</option>
            <option value="DISTRIBUTOR">Distributor</option>
            <option value="NBFC">NBFC</option>
            <option value="BANK">Bank</option>
            <option value="SUPERADMIN">Super Admin</option>
            <option value="CUSTOMER">Customer</option>
          </select>
        </div>

        {relatedOptions.length > 0 && (
          <div>
            <label className="block font-semibold mb-1">Select {formData.role}</label>
            <select
              name="referenceId"
              value={formData.referenceId}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">Select</option>
              {relatedOptions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.mobile || item.mobile}
                </option>
              ))}
            </select>
          </div>
        )}

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Create User
        </button>
      </form>
    </div>
  );
}
