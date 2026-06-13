import { useState, useEffect, useCallback } from 'react';
import { fetchUserBalance } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const useUserBalance = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const bal = await fetchUserBalance(user.id);
      setBalance(bal);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { balance, loading, refresh };
};