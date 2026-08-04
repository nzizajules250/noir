// server/models/User.js
import mongoose from 'mongoose'

const watchlistItemSchema = new mongoose.Schema({ title: { type: String, required: true } }, { _id: false })

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  plan: { type: String, default: 'essential' },
  subscriptionActive: { type: Boolean, default: false },
  memberSince: { type: Date, default: Date.now },
  progress: { type: Map, of: Number, default: {} },
  watchlist: { type: [watchlistItemSchema], default: [] },
  isAdmin: { type: Boolean, default: false },
})

export default mongoose.model('User', userSchema)