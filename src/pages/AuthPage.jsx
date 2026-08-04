import { ArrowRight, Loader2 } from 'lucide-react'
import { useState } from 'react'
import Brand from '../components/Brand'
import Button from '../components/Button'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'

export default function AuthPage({ mode, navigate }) {
  const signup = mode === 'signup'
  const { signIn, signUp } = useAuth()
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
      if (signup) await signUp(values)
      else await signIn(values)
      navigate('home')
      showToast(signup ? 'Your account is ready' : 'Welcome back')
    } catch (err) {
      setError(err.message || 'Something went wrong. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="grid min-h-[calc(100vh-76px)] place-items-center bg-[radial-gradient(ellipse_at_50%_10%,#54101855,transparent_45%)] px-5 py-16">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-950 p-10 shadow-2xl">
        <Brand onClick={() => navigate('home')} />

        <p className="eyebrow mb-3 mt-12">{signup ? 'START YOUR STORY' : 'WELCOME BACK'}</p>
        <h1 className="mb-3 text-5xl font-bold tracking-tight">{signup ? 'Make it yours.' : 'Good to see you.'}</h1>
        <p className="mb-7 text-xs leading-5 text-zinc-400">
          {signup ? 'Start with a 7-day free trial. Cancel anytime.' : 'Use any valid email to access the demo account.'}
        </p>

        {error && (
          <p className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-300">
            {error}
          </p>
        )}

        <form onSubmit={submit} className="flex flex-col gap-5">
          {signup && <Field label="Name" name="name" placeholder="Your name" autoComplete="name" />}
          <Field label="Email" name="email" type="email" placeholder="you@email.com" autoComplete="email" />

          <label>
            <span className="flex items-center justify-between">
              Password
              {!signup && (
                <button type="button" className="text-[11px] font-normal text-zinc-400 hover:text-white">
                  Forgot password?
                </button>
              )}
            </span>
            <input
              required
              name="password"
              minLength="8"
              type="password"
              placeholder="At least 8 characters"
              autoComplete={signup ? 'new-password' : 'current-password'}
            />
          </label>

          <Button type="submit" className="mt-2 rounded-full" disabled={submitting}>
            {submitting ? <Loader2 size={14} className="animate-spin" /> : <>{signup ? 'Create account' : 'Sign in'} <ArrowRight size={14} /></>}
          </Button>
        </form>

        <p className="mt-6 text-xs text-zinc-400">
          {signup ? 'Already a member?' : 'New to NOIR?'}{' '}
          <button className="font-semibold text-red-400 hover:text-red-300" onClick={() => navigate(signup ? 'login' : 'signup')}>
            {signup ? 'Sign in' : 'Create an account'}
          </button>
        </p>
      </section>
    </main>
  )
}

function Field({ label, ...props }) {
  return (
    <label>
      {label}
      <input required {...props} />
    </label>
  )
}