import { useWallet } from '../context/WalletContext';
import { formatCoins } from '../utils/formatters';

const WalletCard = () => {
  const { balance, pending, loading } = useWallet();
  if (loading) return <div className="bg-white p-4 rounded shadow">Loading wallet...</div>;
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
      <h3 className="text-lg font-semibold">Your Wallet</h3>
      <p className="text-3xl font-bold text-green-600 mt-2">{formatCoins(balance)}</p>
      {pending > 0 && <p className="text-sm text-yellow-600">Pending withdrawal: {formatCoins(pending)}</p>}
    </div>
  );
};

export default WalletCard;