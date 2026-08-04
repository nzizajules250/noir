// server/models/Transaction.js
import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  txRef: { type: String, required: true, unique: true },
  flutterwaveId: { type: String },
  plan: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  status: { type: String, enum: ['pending', 'successful', 'failed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model('Transaction', transactionSchema)