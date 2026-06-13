import Wallet from '../models/Wallet.js';
import Transaction from '../models/Transaction.js';
import { v4 as uuidv4 } from 'uuid';

export const getBalance = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user._id });
    res.json({ balance: wallet.balance, pendingWithdrawal: wallet.pendingWithdrawal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addCoins = async (req, res) => {
  try {
    const { amount, description } = req.body;
    if (amount <= 0) return res.status(400).json({ message: 'Amount must be positive' });
    const wallet = await Wallet.findOne({ user: req.user._id });
    wallet.balance += amount;
    wallet.lastUpdated = Date.now();
    await wallet.save();
    await Transaction.create({
      user: req.user._id,
      type: 'credit',
      amount,
      description,
      reference: uuidv4(),
      status: 'completed',
    });
    res.json({ balance: wallet.balance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};