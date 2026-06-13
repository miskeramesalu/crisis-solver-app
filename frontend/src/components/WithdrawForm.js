import { useState } from 'react';
import { requestWithdrawal } from '../services/walletAPI';
import { useWallet } from '../context/WalletContext';

const WithdrawForm = ({ onSuccess }) => {
  const { refresh } = useWallet();
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [bankDetails, setBankDetails] = useState({ accountName: '', accountNumber: '', bankName: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await requestWithdrawal({
        amount: Number(amount),
        fiatCurrency: currency,
        bankDetails,
      });
      setMessage(res.message || 'Request submitted successfully');
      setAmount('');
      refresh();
      if (onSuccess) onSuccess();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
      <h3 className="text-xl font-bold">Request Withdrawal</h3>
      <div>
        <label className="block mb-1">Amount (coins)</label>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required className="w-full border p-2 rounded" />
      </div>
      <div>
        <label className="block mb-1">Currency</label>
        <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full border p-2 rounded">
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="ETB">Ethiopian Birr</option>
        </select>
      </div>
      <div>
        <label className="block mb-1">Account Name</label>
        <input value={bankDetails.accountName} onChange={(e) => setBankDetails({ ...bankDetails, accountName: e.target.value })} required className="w-full border p-2 rounded" />
      </div>
      <div>
        <label className="block mb-1">Account Number</label>
        <input value={bankDetails.accountNumber} onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })} required className="w-full border p-2 rounded" />
      </div>
      <div>
        <label className="block mb-1">Bank Name</label>
        <input value={bankDetails.bankName} onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })} required className="w-full border p-2 rounded" />
      </div>
      <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        {loading ? 'Processing...' : 'Submit Request'}
      </button>
      {message && <p className="text-sm text-gray-700">{message}</p>}
    </form>
  );
};

export default WithdrawForm;