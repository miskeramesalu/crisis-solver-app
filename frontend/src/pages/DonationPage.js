import React, { useState } from 'react';
import { submitDonation } from '../services/api';
import { useAuth } from '../context/AuthContext';

const DonationPage = () => {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [processing, setProcessing] = useState(false);

  const handleDonate = async () => {
    if (!user) return alert('Please login first');
    setProcessing(true);
    try {
      await submitDonation({ donorId: user.id, amount: parseFloat(amount), currency });
      alert('Thank you for your donation!');
      setAmount('');
    } catch (err) {
      alert('Donation failed: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Support Our Cause</h1>
      <div className="mb-4">
        <label>Amount</label>
        <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full border rounded p-2" />
      </div>
      <div className="mb-4">
        <label>Currency</label>
        <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full border rounded p-2">
          <option>USD</option>
          <option>EUR</option>
          <option>CRS (Token)</option>
        </select>
      </div>
      <button onClick={handleDonate} disabled={processing} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        {processing ? 'Processing...' : 'Donate Now'}
      </button>
    </div>
  );
};

export default DonationPage;