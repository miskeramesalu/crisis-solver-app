// frontend/src/config.js

// Base API URL for backend calls
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

// Keep the original 'API' export for backward compatibility with existing code
export const API = API_BASE_URL;

// reCAPTCHA site key for frontend forms
export const RECAPTCHA_SITE_KEY =
  process.env.REACT_APP_RECAPTCHA_SITE_KEY || '6Le3UwctAAAAAPWYSrhX9wF7-x-gCvy-M1MbEjRc';

// Stripe publishable key for card payments
export const STRIPE_PUBLISHABLE_KEY =
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_xxx';

// PayPal Client ID (frontend only)
export const PAYPAL_CLIENT_ID = process.env.REACT_APP_PAYPAL_CLIENT_ID;

// Chapa Public Key (frontend only – for Ethiopian payments)
export const CHAPA_PUBLIC_KEY = process.env.REACT_APP_CHAPA_PUBLIC_KEY;

// Hedera Treasury Account ID (for frontend display, not a secret)
export const HEDERA_TREASURY_ACCOUNT_ID = process.env.REACT_APP_HEDERA_TREASURY_ACCOUNT_ID;