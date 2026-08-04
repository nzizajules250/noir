import { Router } from 'express'
import { requireAdmin } from '../middleware/requireAdmin.js'
import User from '../models/User.js'
import Movie from '../models/Movie.js'
import Transaction from '../models/Transaction.js'

const router = Router()

router.get('/users', requireAdmin, async (req, res) => {
  const users = await User.find().select('name email plan subscriptionActive isAdmin memberSince')
  res.json(users)
})

router.get('/movies', requireAdmin, async (req, res) => {
  const movies = await Movie.find().sort({ createdAt: -1 })
  res.json(movies)
})

router.post('/movies', requireAdmin, async (req, res) => {
  const { title, image, videoUrl, trailerUrl, kind } = req.body
  if (!title || !image || !videoUrl) return res.status(400).json({ error: 'Title, image, and video are required' })

  const slug = title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  const exists = await Movie.findOne({ slug })
  if (exists) return res.status(409).json({ error: 'A title with this name already exists' })

  const movie = await Movie.create({ ...req.body, slug, uploadedBy: req.user._id })
  res.status(201).json(movie)
})

router.patch('/movies/:id', requireAdmin, async (req, res) => {
  const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!movie) return res.status(404).json({ error: 'Movie not found' })
  res.json(movie)
})

router.delete('/movies/:id', requireAdmin, async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id)
  if (!movie) return res.status(404).json({ error: 'Movie not found' })
  res.json({ ok: true })
})

router.patch('/users/:id', requireAdmin, async (req, res) => {
  const { plan, subscriptionActive, isAdmin } = req.body
  const updates = {}
  if (plan) updates.plan = plan
  if (typeof subscriptionActive === 'boolean') updates.subscriptionActive = subscriptionActive
  if (typeof isAdmin === 'boolean') updates.isAdmin = isAdmin

  const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('name email plan subscriptionActive isAdmin memberSince')
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json(user)
})

router.delete('/users/:id', requireAdmin, async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id)
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json({ ok: true })
})

router.get('/transactions', requireAdmin, async (req, res) => {
  const transactions = await Transaction.find().populate('user', 'name email').sort({ createdAt: -1 })
  res.json(transactions)
})

export default router
