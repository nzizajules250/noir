// server/middleware/requireAuth.js
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export async function requireAuth(req, res, next) {
  const token = req.cookies.session
  if (!token) return res.status(401).json({ error: 'Not signed in' })
  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(userId)
    if (!user) return res.status(401).json({ error: 'Not signed in' })
    req.user = user
    next()
  } catch {
    res.status(401).json({ error: 'Session expired' })
  }
}