import React, { createContext, useState, useContext } from 'react';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [accountId, setAccountId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      // Example using HashPack extension (if installed)
      if (window.hashpack) {
        const { accountIds } = await window.hashpack.connect();
        setAccountId(accountIds[0]);
      } else {
        alert('Please install HashPack wallet');
      }
    } catch (err) {
      console.error('Wallet connection failed', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => setAccountId(null);

  return (
    <WalletContext.Provider value={{ accountId, isConnecting, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);