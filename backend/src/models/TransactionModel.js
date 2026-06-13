import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['credit', 'debit', 'withdrawal'], required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'coin' },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
    reference: { type: String, unique: true },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Transaction', transactionSchema);