// server/routes/movies.js
import { Router } from 'express'
import Movie from '../models/Movie.js'
import { requireAdmin } from '../middleware/requireAdmin.js'

const router = Router()

router.get('/', async (req, res) => {
  const { kind } = req.query
  const filter = kind ? { kind } : {}
  const movies = await Movie.find(filter).sort({ createdAt: -1 })
  res.json(movies)
})

router.get('/:slug', async (req, res) => {
  const movie = await Movie.findOne({ slug: req.params.slug })
  if (!movie) return res.status(404).json({ error: 'Not found' })
  res.json(movie)
})

router.post('/', requireAdmin, async (req, res) => {
  const { title, image, videoUrl } = req.body
  if (!title || !image || !videoUrl) return res.status(400).json({ error: 'Title, image, and video are required' })

  const slug = title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  const exists = await Movie.findOne({ slug })
  if (exists) return res.status(409).json({ error: 'A title with this name already exists' })

  const movie = await Movie.create({ ...req.body, slug, uploadedBy: req.user._id })
  res.status(201).json(movie)
})

router.patch('/:id', requireAdmin, async (req, res) => {
  const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!movie) return res.status(404).json({ error: 'Not found' })
  res.json(movie)
})

router.delete('/:id', requireAdmin, async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id)
  if (!movie) return res.status(404).json({ error: 'Not found' })
  res.json({ ok: true })
})

export default router