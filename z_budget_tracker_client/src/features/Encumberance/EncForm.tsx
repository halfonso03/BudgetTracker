import React, { useState, ChangeEvent, FormEvent } from 'react';

// 1. Updated structural interfaces to support Categories -> Accounts
export interface BudgetAccount {
  id: string;
  name: string;      // e.g., "Legal Consultation", "SaaS Subscriptions"
}

export interface BudgetCategory {
  id: string;
  name: string;      // e.g., "Services", "Equipment"
  accounts: BudgetAccount[]; // The lowest level where funds are locked
}

export interface Encumbrance {
  id: string;
  title: string;
  amount: number;
  accountId: string; // Tracks the specific account chosen
  vendor: string;
  estimatedFulfillmentDate: string;
  notes: string;
  status: 'Encumbered' | 'Liquidated' | 'Cancelled';
  createdAt: string;
}

interface EncumbranceFormProps {
  budgetCategories: BudgetCategory[];
  onAddEncumbrance: (encumbrance: Encumbrance) => void;
}

interface FormState {
  title: string;
  amount: string;
  accountId: string; // Tracks the selected lowest-level account
  vendor: string;
  estimatedFulfillmentDate: string;
  notes: string;
}

export default function EncumbranceForm({ budgetCategories, onAddEncumbrance }: EncumbranceFormProps) {
  const [formData, setFormData] = useState<FormState>({
    title: '',
    amount: '',
    accountId: '',
    vendor: '',
    estimatedFulfillmentDate: '',
    notes: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.title || !formData.amount || !formData.accountId) return;

    onAddEncumbrance({
      ...formData,
      id: crypto.randomUUID(),
      amount: parseFloat(formData.amount),
      status: 'Encumbered',
      createdAt: new Date().toISOString(),
    });

    setFormData({ title: '', amount: '', accountId: '', vendor: '', estimatedFulfillmentDate: '', notes: '' });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        🔒 Record New Encumbrance
      </h2>
      <p className="text-xs text-gray-500 mb-4">
        Hold and commit funds from a specific budget account before the actual invoice arrives.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Commitment Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Q4 Marketing Vendor Contract"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($) *</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            {/* 2. Grouped dropdown menu handling the two-tier structure */}
            <label className="block text-sm font-medium text-gray-700 mb-1">Budget Account *</label>
            <select
              name="accountId"
              value={formData.accountId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Account</option>
              {budgetCategories.map((category) => (
                <optgroup key={category.id} label={category.name}>
                  {category.accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vendor/Payee</label>
            <input
              type="text"
              name="vendor"
              value={formData.vendor}
              onChange={handleChange}
              placeholder="Company Inc."
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Est. Clear Date</label>
            <input
              type="date"
              name="estimatedFulfillmentDate"
              value={formData.estimatedFulfillmentDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Reference Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="PO Number, terms, or conditions..."
            rows={2}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded text-sm transition duration-150 ease-in-out"
        >
          Lock Encumbrance Funds
        </button>
      </form>
    </div>
  );
}
