import axios from 'axios';

const EXCHANGE_RATE_API = 'https://api.exchangerate-api.com/v4/latest/USD';

export const getExchangeRate = async (fromCurrency = 'USD', toCurrency = 'USD') => {
  // For demo, call a free API. In production, cache rates.
  const response = await axios.get(EXCHANGE_RATE_API);
  const rates = response.data.rates;
  const rate = rates[toCurrency] / rates[fromCurrency];
  return rate;
};

export const convertCoinsToFiat = async (coins, targetCurrency) => {
  // Assume 1 coin = 0.01 USD for example
  const usdValue = coins * 0.01;
  const rate = await getExchangeRate('USD', targetCurrency);
  return usdValue * rate;
};