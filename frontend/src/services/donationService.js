// frontend/src/services/donationService.js
import api from './api';

export const createDonationIntent = async (amount, currency, paymentMethod) => {
  return api('/donation/create-intent', {
    method: 'POST',
    body: JSON.stringify({ amount, currency, paymentMethod }),
  });
};

export const confirmDonation = async (paymentIntentId, donorInfo) => {
  return api('/donation/confirm', {
    method: 'POST',
    body: JSON.stringify({ paymentIntentId, donorInfo }),
  });
};

export const getDonationHistory = async () => {
  return api('/donation/history');
};

export const getCampaigns = async () => {
  return api('/donation/campaigns');
};

export const donateToCampaign = async (campaignId, amount, currency, anonymous = false) => {
  return api('/donation/campaign', {
    method: 'POST',
    body: JSON.stringify({ campaignId, amount, currency, anonymous }),
  });
};

// Stripe specific (frontend only)
export const initStripe = (publishableKey) => {
  // This would load Stripe.js – implement as needed
  console.log('Stripe initialized with key:', publishableKey);
};