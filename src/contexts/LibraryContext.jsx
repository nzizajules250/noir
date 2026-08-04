import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext'

const LibraryContext = createContext(null)
const API = import.meta.env.VITE_API_URL

export function LibraryProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [watchlist, setWatchlist] = useState([])
  const [progress, setProgress] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      setWatchlist([])
      setProgress({})
      setLoading(false)
      return
    }
    setLoading(true)
    fetch(`${API}/api/library`, { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : { watchlist: [], progress: {} }))
      .then((data) => { setWatchlist(data.watchlist); setProgress(data.progress) })
      .finally(() => setLoading(false))
  }, [isAuthenticated])

  const toggleWatchlist = async (title) => {
    setWatchlist((current) => (current.includes(title) ? current.filter((item) => item !== title) : [...current, title]))
    try {
      const res = await fetch(`${API}/api/library/watchlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title }),
      })
      if (res.ok) setWatchlist((await res.json()).watchlist)
    } catch {
      setWatchlist((current) => (current.includes(title) ? current.filter((item) => item !== title) : [...current, title]))
    }
  }

  const saveProgress = async (title, percentage) => {
    setProgress((current) => ({ ...current, [title]: percentage }))
    try {
      const res = await fetch(`${API}/api/library/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title, percentage }),
      })
      if (res.ok) setProgress((await res.json()).progress)
    } catch {
      // percentage is non-critical UI state; leave the optimistic value in place rather than yanking it back
    }
  }

  const value = useMemo(() => ({ watchlist, progress, toggleWatchlist, saveProgress, loading }), [watchlist, progress, loading])
  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
}

export function useLibrary() {
  const context = useContext(LibraryContext)
  if (!context) throw new Error('useLibrary must be used within LibraryProvider')
  return context
}