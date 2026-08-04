import { ArrowRight, Loader2 } from 'lucide-react'
import { useState } from 'react'
import Brand from '../components/Brand'
import Button from '../components/Button'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'

export default function AdminAuthPage({ navigate }) {
  const { adminSignIn } = useAuth()
  const { showToast } = useToast()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const submit = async (event) => {
    event.preventDefault()
    setError(null)
    const form = new FormData(event.currentTarget)
    const values = Object.fromEntries(form.entries())

    setSubmitting(true)
    try {
      await adminSignIn(values)
      navigate('admin')
      showToast('Welcome, admin')
    } catch (err) {
      setError(err.message || 'Unable to sign in as admin')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="grid min-h-[calc(100vh-76px)] place-items-center bg-[radial-gradient(ellipse_at_50%_10%,#54101855,transparent_45%)] px-5 py-16">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-950 p-10 shadow-2xl">
        <Brand onClick={() => navigate('home')} />

        <p className="eyebrow mb-3 mt-12">ADMIN ACCESS</p>
        <h1 className="mb-3 text-5xl font-bold tracking-tight">Sign in to the dashboard.</h1>
        <p className="mb-7 text-xs leading-5 text-zinc-400">Use an admin account to manage users, movies, and transactions.</p>

        {error && (
          <p className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-300">
            {error}
          </p>
        )}

        <form onSubmit={submit} className="flex flex-col gap-5">
          <label>
            Email
            <input required name="email" type="email" placeholder="admin@noir.com" autoComplete="email" />
          </label>

          <label>
            Password
            <input required name="password" minLength="8" type="password" placeholder="Admin password" autoComplete="current-password" />
          </label>

          <Button type="submit" className="mt-2 rounded-full" disabled={submitting}>
            {submitting ? <Loader2 size={14} className="animate-spin" /> : <>Sign in <ArrowRight size={14} /></>}
          </Button>
        </form>

        <p className="mt-6 text-xs text-zinc-400">
          Need a user account?{' '}
          <button className="font-semibold text-red-400 hover:text-red-300" onClick={() => navigate('login')}>
            Return to sign in
          </button>
        </p>
      </section>
    </main>
  )
}
