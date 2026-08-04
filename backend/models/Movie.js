// server/models/Movie.js
import mongoose from 'mongoose'

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  meta: { type: String },
  genre: { type: String },
  synopsis: { type: String },
  duration: { type: String },
  rating: { type: String },
  releaseYear: { type: Number },
  cast: { type: [String], default: [] },
  image: { type: String, required: true },
  videoUrl: { type: String, required: true },
  trailerUrl: { type: String },
  kind: { type: String, enum: ['movie', 'show'], default: 'movie' },
  featured: { type: Boolean, default: false },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model('Movie', movieSchema)