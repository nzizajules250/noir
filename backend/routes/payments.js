// server/routes/payments.js
import { Router } from 'express'
import { requireAuth } from '../middleware/requireAuth.js'
import Transaction from '../models/Transaction.js'
import User from '../models/User.js'

const router = Router()
const PLAN_PRICES = { essential: 9, premium: 15 }

router.post('/initiate', requireAuth, async (req, res) => {
  const plan = req.body.plan?.toLowerCase()
  const amount = PLAN_PRICES[plan]
  if (!amount) return res.status(400).json({ error: 'Unknown plan' })

  const txRef = `noir-${req.user._id}-${Date.now()}`
  await Transaction.create({ user: req.user._id, txRef, plan, amount, status: 'pending' })

  const response = await fetch('https://api.flutterwave.com/v3/payments', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tx_ref: txRef,
      amount,
      currency: 'USD',
      redirect_url: `${process.env.CLIENT_URL}/payment/callback`,
      customer: { email: req.user.email, name: req.user.name },
      customizations: { title: 'NOIR', description: `${plan} membership` },
    }),
  })

  const data = await response.json()
  if (data.status !== 'success') return res.status(502).json({ error: 'Could not start checkout' })
  res.json({ checkoutUrl: data.data.link })
})

router.post('/webhook', async (req, res) => {
  if (req.headers['verif-hash'] !== process.env.FLUTTERWAVE_WEBHOOK_HASH) return res.sendStatus(401)

  const { data } = req.body
  const transaction = await Transaction.findOne({ txRef: data.tx_ref })
  if (!transaction) return res.sendStatus(404)

  // Never trust the webhook payload alone — re-verify directly against Flutterwave's API
  const verifyRes = await fetch(`https://api.flutterwave.com/v3/transactions/${data.id}/verify`, {
    headers: { Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}` },
  })
  const verified = await verifyRes.json()

  if (verified.data.status === 'successful' && verified.data.amount >= transaction.amount) {
    transaction.status = 'successful'
    transaction.flutterwaveId = String(data.id)
    await transaction.save()
    await User.findByIdAndUpdate(transaction.user, { plan: transaction.plan, subscriptionActive: true })
  } else {
    transaction.status = 'failed'
    await transaction.save()
  }
  res.sendStatus(200)
})

router.get('/transactions', requireAuth, async (req, res) => {
  const transactions = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 })
  res.json(transactions)
})

export default router