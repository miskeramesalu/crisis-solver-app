import Wallet from '../models/Wallet.js';
import WithdrawalRequest from '../models/WithdrawalRequest.js';
import Transaction from '../models/Transaction.js';
import { convertCoinsToFiat } from '../services/currencyService.js';
import { isSuspicious } from '../services/fraudDetectionService.js';
import { createPayout } from '../services/paymentService.js';
import { sendEmail } from '../utils/emailService.js';
import { v4 as uuidv4 } from 'uuid';

export const requestWithdrawal = async (req, res) => {
  try {
    const { amount, fiatCurrency, bankDetails } = req.body;
    const wallet = await Wallet.findOne({ user: req.user._id });
    if (wallet.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }
    const fiatAmount = await convertCoinsToFiat(amount, fiatCurrency);
    // Check fraud
    const suspicious = await isSuspicious(req.user._id, amount, fiatCurrency);
    if (suspicious) {
      // Flag for manual review
      const request = await WithdrawalRequest.create({
        user: req.user._id,
        amount,
        fiatAmount,
        fiatCurrency,
        bankDetails,
        status: 'pending',
      });
      // Notify admin via email or logging
      await sendEmail({
        to: 'admin@crisissolver.com',
        subject: 'Suspicious withdrawal request',
        text: `User ${req.user.email} requested ${amount} coins (${fiatAmount} ${fiatCurrency}). Please review.`,
      });
      return res.status(202).json({ message: 'Request flagged for review. We will contact you soon.', requestId: request._id });
    }
    // Auto‑process
    // Deduct balance and add pending
    wallet.balance -= amount;
    wallet.pendingWithdrawal += amount;
    await wallet.save();
    const withdrawalRequest = await WithdrawalRequest.create({
      user: req.user._id,
      amount,
      fiatAmount,
      fiatCurrency,
      bankDetails,
      status: 'approved',
    });
    // Actually process payout (mock or real)
    const payoutResult = await createPayout({
      amount: fiatAmount,
      currency: fiatCurrency,
      bankAccountToken: 'ba_123', // you'd get this from user's bank tokenization
    });
    if (payoutResult.success) {
      wallet.pendingWithdrawal -= amount;
      await wallet.save();
      withdrawalRequest.status = 'completed';
      withdrawalRequest.processedAt = new Date();
      await withdrawalRequest.save();
      await Transaction.create({
        user: req.user._id,
        type: 'withdrawal',
        amount: -amount,
        description: `Withdrawal of ${fiatAmount} ${fiatCurrency}`,
        reference: uuidv4(),
        status: 'completed',
      });
      res.json({ message: 'Withdrawal successful', transactionId: payoutResult.transactionId });
    } else {
      // Rollback
      wallet.balance += amount;
      wallet.pendingWithdrawal -= amount;
      await wallet.save();
      withdrawalRequest.status = 'rejected';
      withdrawalRequest.reviewNote = payoutResult.error;
      await withdrawalRequest.save();
      res.status(500).json({ message: 'Payout failed, please contact support' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getWithdrawals = async (req, res) => {
  try {
    const withdrawals = await WithdrawalRequest.find({ user: req.user._id }).sort('-createdAt');
    res.json(withdrawals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin only
export const reviewWithdrawal = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reviewNote } = req.body;
    const withdrawal = await WithdrawalRequest.findById(id);
    if (!withdrawal) return res.status(404).json({ message: 'Request not found' });
    withdrawal.status = status;
    withdrawal.reviewedBy = req.user._id;
    withdrawal.reviewNote = reviewNote;
    if (status === 'approved') {
      withdrawal.processedAt = new Date();
      // Process payout similarly as above (omitted for brevity)
    }
    await withdrawal.save();
    res.json(withdrawal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};