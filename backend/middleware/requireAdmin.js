// server/middleware/requireAdmin.js
import { requireAuth } from './requireAuth.js'

export function requireAdmin(req, res, next) {
  requireAuth(req, res, () => {
    if (!req.user.isAdmin) return res.status(403).json({ error: 'Admin access required' })
    next()
  })
}