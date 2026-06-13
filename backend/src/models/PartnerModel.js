import mongoose from 'mongoose';

const partnerSchema = new mongoose.Schema(
  {
    organization: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    website: { type: String },
    message: { type: String },
    status: { type: String, enum: ['pending', 'contacted', 'partnered'], default: 'pending' },
  },
  { timestamps: true }
);

export default mongoose.model('Partner', partnerSchema);