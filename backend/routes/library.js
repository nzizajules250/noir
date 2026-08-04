// server/routes/library.js
import { Router } from 'express'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()
router.use(requireAuth)

router.get('/', (req, res) => {
  res.json({
    watchlist: req.user.watchlist.map((item) => item.title),
    progress: Object.fromEntries(req.user.progress),
  })
})

router.post('/watchlist', async (req, res) => {
  const { title } = req.body
  if (!title) return res.status(400).json({ error: 'Title is required' })

  const exists = req.user.watchlist.some((item) => item.title === title)
  if (exists) req.user.watchlist = req.user.watchlist.filter((item) => item.title !== title)
  else req.user.watchlist.push({ title })

  await req.user.save()
  res.json({ watchlist: req.user.watchlist.map((item) => item.title) })
})

router.post('/progress', async (req, res) => {
  const { title, percentage } = req.body
  if (!title || typeof percentage !== 'number') return res.status(400).json({ error: 'Title and percentage are required' })

  req.user.progress.set(title, Math.max(0, Math.min(100, percentage)))
  await req.user.save()
  res.json({ progress: Object.fromEntries(req.user.progress) })
})

export default router