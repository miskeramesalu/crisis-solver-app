// This would typically call your backend endpoints that handle Hedera transactions.
// For frontend, you can simply call your own API:

import apiClient from './api'; // assuming apiClient is exported

export const mintRewardTokens = async (userId, amount) => {
  return apiClient.post('/blockchain/mint', { userId, amount });
};

export const transferTokens = async (toUserId, amount) => {
  return apiClient.post('/blockchain/transfer', { toUserId, amount });
};

export const getTokenBalance = async (hederaAccountId) => {
  return apiClient.get(`/blockchain/balance/${hederaAccountId}`);
};