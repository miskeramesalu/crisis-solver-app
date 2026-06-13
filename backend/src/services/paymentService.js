import stripe from '../config/payment.js';
import logger from '../utils/logger.js';

export const createPayout = async ({ amount, currency, bankAccountToken }) => {
  try {
    // Stripe payout example – requires connected account
    const payout = await stripe.payouts.create({
      amount: Math.round(amount * 100), // cents
      currency: currency.toLowerCase(),
      method: 'standard',
      destination: bankAccountToken,
    });
    return { success: true, transactionId: payout.id };
  } catch (error) {
    logger.error(`Payout failed: ${error.message}`);
    return { success: false, error: error.message };
  }
};