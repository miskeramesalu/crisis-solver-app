// frontend/src/hooks/useFraudAlert.js
import { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';

const FRAUD_RULES = {
  MAX_WITHDRAWAL_AMOUNT: 100000,   // 100,000 coins (≈ $1000)
  MAX_WITHDRAWALS_PER_DAY: 3,
  MIN_ACCOUNT_AGE_DAYS: 7,
};

export const useFraudAlert = () => {
  const { balance } = useWallet();
  const [alerts, setAlerts] = useState([]);
  const [isBlocked, setIsBlocked] = useState(false);

  // Check for suspicious conditions
  const checkWithdrawal = async (amount) => {
    const newAlerts = [];

    // Rule 1: amount too high
    if (amount > FRAUD_RULES.MAX_WITHDRAWAL_AMOUNT) {
      newAlerts.push('Withdrawal amount exceeds daily limit. Please contact support.');
    }

    // Rule 2: insufficient balance
    if (amount > balance) {
      newAlerts.push('Insufficient balance for this withdrawal.');
    }

    // Rule 3: account age (requires user registration date from backend)
    // This would normally be fetched from user context. For now, placeholder.
    const userCreatedAt = localStorage.getItem('userCreatedAt');
    if (userCreatedAt) {
      const daysSinceJoin = (Date.now() - new Date(userCreatedAt)) / (1000 * 3600 * 24);
      if (daysSinceJoin < FRAUD_RULES.MIN_ACCOUNT_AGE_DAYS) {
        newAlerts.push(`Your account must be at least ${FRAUD_RULES.MIN_ACCOUNT_AGE_DAYS} days old to withdraw.`);
      }
    }

    // Rule 4: too many recent withdrawal attempts (would require backend call)
    // For demo, we simulate a check
    try {
      const response = await fetch('/api/wallet/recent-withdrawals', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      if (data.count >= FRAUD_RULES.MAX_WITHDRAWALS_PER_DAY) {
        newAlerts.push(`You have reached the maximum of ${FRAUD_RULES.MAX_WITHDRAWALS_PER_DAY} withdrawals per day.`);
      }
    } catch (err) {
      console.error('Failed to check withdrawal history', err);
    }

    setAlerts(newAlerts);
    setIsBlocked(newAlerts.length > 0);
    return { alerts: newAlerts, isBlocked: newAlerts.length > 0 };
  };

  const clearAlerts = () => {
    setAlerts([]);
    setIsBlocked(false);
  };

  return { alerts, isBlocked, checkWithdrawal, clearAlerts };
};

export default useFraudAlert;