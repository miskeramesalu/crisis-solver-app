import api from './api';

export const getWallet = () => api('/wallet/balance');

export const requestWithdrawal = (withdrawalData) => api('/wallet/withdraw', {
  method: 'POST',
  body: JSON.stringify(withdrawalData),
});

export const getWithdrawals = () => api('/wallet/withdrawals');