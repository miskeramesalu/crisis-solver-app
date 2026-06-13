import mongoose from 'mongoose';

const withdrawalRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true }, // in coins
    fiatAmount: { type: Number, required: true }, // after exchange rate
    fiatCurrency: { type: String, required: true }, // e.g., 'USD', 'ETB'
    bankDetails: {
      accountName: String,
      accountNumber: String,
      bankName: String,
      swiftCode: String,
    },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'completed'], default: 'pending' },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewNote: { type: String },
    processedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model('WithdrawalRequest', withdrawalRequestSchema);