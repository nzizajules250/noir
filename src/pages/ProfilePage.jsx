import { useEffect, useState } from 'react'
import Button from '../components/Button'
import { useAuth } from '../contexts/AuthContext'

export default function ProfilePage({ navigate }) {
  const { user, loading } = useAuth()
  const [transactions, setTransactions] = useState(null)
  const [txError, setTxError] = useState(null)

  useEffect(() => {
    if (!loading && !user) navigate('login')
  }, [loading, user, navigate])

  useEffect(() => {
    const loadTransactions = async () => {
      if (!user) return
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/transactions`, {
          credentials: 'include',
        })
        if (!res.ok) throw new Error('Unable to load transactions')
        setTransactions(await res.json())
      } catch (error) {
        setTxError(error.message)
      }
    }
    loadTransactions()
  }, [user])

  if (loading || !user) {
    return (
      <main className="min-h-[calc(100vh-76px)] px-[6.5vw] py-16">
        <div className="flex items-center gap-6 border-b border-white/10 pb-9">
          <div className="size-[90px] animate-pulse rounded-full bg-white/5" />
          <div className="flex flex-col gap-3">
            <div className="h-3 w-32 animate-pulse rounded-full bg-white/5" />
            <div className="h-8 w-48 animate-pulse rounded-full bg-white/5" />
          </div>
        </div>
      </main>
    )
  }

  const initials = user.name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()

  return (
    <main className="min-h-[calc(100vh-76px)] px-[6.5vw] py-16">
      <header className="flex flex-wrap items-center gap-6 border-b border-white/10 pb-9">
        {user.avatarUrl ? (
          <img className="size-[90px] rounded-full object-cover ring-2 ring-white/10" src={user.avatarUrl} alt={user.name} />
        ) : (
          <div className="grid size-[90px] shrink-0 place-items-center rounded-full bg-white/5 text-2xl font-bold text-zinc-400 ring-2 ring-white/10">
            {initials}
          </div>
        )}
        <div>
          <p className="eyebrow">MEMBER SINCE {user.memberSince}</p>
          <h1 className="text-4xl font-bold tracking-tight">{user.name}</h1>
          <p className="mt-1 text-[13px] text-zinc-400">{user.email}</p>
        </div>
        <Button variant="outline" className="ml-auto">Edit profile</Button>
      </header>

      <div className="mt-9 grid grid-cols-1 gap-5 md:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
          <h2 className="mb-6 text-base font-bold">Membership</h2>
          <div className="flex items-center gap-3">
            <b className="grid size-10 shrink-0 place-items-center rounded-xl bg-red-600 text-sm">N</b>
            <p className="flex flex-1 flex-col gap-1">
              <strong className="text-[13px] capitalize">NOIR {user.plan}</strong>
              <small className="text-[11px] text-zinc-400">Renews Sep 03, 2026</small>
            </p>
            <button
              onClick={() => navigate('payment')}
              className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-zinc-300 transition hover:border-red-500/40 hover:text-red-400"
            >
              Manage
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
          <h2 className="mb-4 text-base font-bold">Preferences</h2>
          <Toggle label="Autoplay next episode" defaultChecked />
          <Toggle label="Email updates" />
        </section>
      </div>

      <section className="mt-8 rounded-2xl border border-white/10 bg-zinc-950 p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-bold">Recent payments</h2>
          <button onClick={() => navigate('payment')} className="text-xs text-red-400">New plan</button>
        </div>

        {txError && <p className="text-sm text-red-400">{txError}</p>}
        {transactions === null ? (
          <p className="text-sm text-zinc-400">Loading transactions…</p>
        ) : transactions.length === 0 ? (
          <p className="text-sm text-zinc-400">No recent payments yet.</p>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx._id} className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-zinc-400">{tx.plan.toUpperCase()} plan</p>
                    <p className="text-base font-semibold">${tx.amount.toFixed(2)} {tx.currency}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-[11px] ${tx.status === 'successful' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-yellow-500/10 text-yellow-300'}`}>
                    {tx.status}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-zinc-500">
                  <span>Ref: {tx.txRef}</span>
                  <span>{new Date(tx.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

function Toggle({ label, defaultChecked }) {
  return (
    <label className="toggle-row">
      {label}
      <input type="checkbox" defaultChecked={defaultChecked} />
      <i />
    </label>
  )
}