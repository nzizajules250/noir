// server/routes/auth.js
import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = Router()
const COOKIE_OPTS = { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000 }

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body
  if (!password || password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' })

  const existing = await User.findOne({ email })
  if (existing) return res.status(409).json({ error: 'An account with this email already exists' })

  const passwordHash = await bcrypt.hash(password, 12)
  const user = await User.create({ name, email, passwordHash })
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
  res.cookie('session', token, COOKIE_OPTS)
  res.json(toPublicUser(user))
})

router.post('/signin', async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: 'Incorrect email or password' })
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
  res.cookie('session', token, COOKIE_OPTS)
  res.json(toPublicUser(user))
})

router.post('/signout', (req, res) => {
  res.clearCookie('session', COOKIE_OPTS)
  res.json({ ok: true })
})

router.get('/me', async (req, res) => {
  const token = req.cookies.session
  if (!token) return res.status(401).json({ error: 'Not signed in' })
  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(userId)
    if (!user) return res.status(401).json({ error: 'Not signed in' })
    res.json(toPublicUser(user))
  } catch {
    res.status(401).json({ error: 'Session expired' })
  }
})

function toPublicUser(user) {
  return {
    name: user.name,
    email: user.email,
    plan: user.plan,
    subscriptionActive: user.subscriptionActive,
    isAdmin: user.isAdmin || false,
    memberSince: user.memberSince.getFullYear(),
  }
}

export default router