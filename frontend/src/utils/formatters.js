export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
};

export const formatCoins = (coins) => {
  return `${Math.floor(coins).toLocaleString()} coins`;
};