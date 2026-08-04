// server/index.js
import 'dotenv/config'   // ← this line was missing; must be first, before anything reads process.env
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { connectDB } from './db.js'
import authRoutes from './routes/auth.js'
import movieRoutes from './routes/movies.js'
import libraryRoutes from './routes/library.js'
import paymentRoutes from './routes/payments.js'
import adminRoutes from './routes/admin.js'

const app = express()

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}))
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/movies', movieRoutes)
app.use('/api/library', libraryRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/admin', adminRoutes)

connectDB().then(() => {
  app.listen(process.env.PORT || 4000, () => console.log('API running'))
})