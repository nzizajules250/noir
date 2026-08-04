import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function PaymentCallbackPage({ navigate }) {
  const [searchParams] = useSearchParams()
  const { refreshUser } = useAuth()
  const [status, setStatus] = useState('checking')

  useEffect(() => {
    const check = async () => {
      // Give the webhook a moment to land, then re-check our own user record
      // rather than trusting the redirect's own query params
      await new Promise((r) => setTimeout(r, 2000))
      const user = await refreshUser()
      setStatus(user?.subscriptionActive ? 'success' : 'pending')
    }
    check()
  }, [refreshUser])

  return (
    <main className="grid min-h-[calc(100vh-76px)] place-items-center px-5 text-center">
      {status === 'checking' && <p className="text-sm text-zinc-400">Confirming your payment…</p>}
      {status === 'success' && (
        <div>
          <h1 className="mb-2 text-2xl font-bold">You're all set.</h1>
          <button onClick={() => navigate('home')} className="text-sm text-red-400">Go to NOIR</button>
        </div>
      )}
      {status === 'pending' && (
        <div>
          <h1 className="mb-2 text-2xl font-bold">Still confirming.</h1>
          <p className="mb-4 text-sm text-zinc-400">This can take a minute. Check your profile shortly.</p>
          <button onClick={() => navigate('profile')} className="text-sm text-red-400">Go to profile</button>
        </div>
      )}
    </main>
  )
}