import WithdrawalRequest from '../models/WithdrawalRequest.js';

export const isSuspicious = async (userId, amount, currency) => {
  // Rule 1: large amount (> $1000 equivalent)
  if (amount > 100000) return true; // 100,000 coins = $1000

  // Rule 2: more than 3 withdrawal requests in last 24 hours
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentCount = await WithdrawalRequest.countDocuments({
    user: userId,
    createdAt: { $gte: twentyFourHoursAgo },
  });
  if (recentCount >= 3) return true;

  // Rule 3: user has not been active (e.g., registered less than 7 days)
  // You can fetch user creation date from User model

  return false;
};