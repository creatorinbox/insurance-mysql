'use client';
import React from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import UploadPolicyPricing from '@/components/form/UploadPolicyPricing'; // ✅ correct path

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ImportPolicyModal({ isOpen, onClose }: Props) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          <Dialog.Title className="text-lg font-semibold mb-4">
            Import Policy Pricing
          </Dialog.Title>

          {/* 🔽 Embed your form */}
          <UploadPolicyPricing />
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
