import { createContext, useContext, useMemo, useState } from 'react'
import { movies } from '../data/catalog'
import { readStorage, writeStorage } from '../services/storage'

const LibraryContext = createContext(null)
const initialWatchlist = movies.slice(0, 4).map((movie) => movie.title)

export function LibraryProvider({ children }) {
  const [watchlist, setWatchlist] = useState(() => readStorage('watchlist', initialWatchlist))
  const [progress, setProgress] = useState(() => readStorage('progress', { Remainder: 42, 'In the Current': 68, 'The Orchard': 21 }))
  const toggleWatchlist = (title) => {
    setWatchlist((current) => {
      const next = current.includes(title) ? current.filter((item) => item !== title) : [...current, title]
      writeStorage('watchlist', next)
      return next
    })
  }
  const saveProgress = (title, percentage) => {
    setProgress((current) => {
      const next = { ...current, [title]: percentage }
      writeStorage('progress', next)
      return next
    })
  }
  const value = useMemo(() => ({ watchlist, progress, toggleWatchlist, saveProgress }), [watchlist, progress])
  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
}

export function useLibrary() {
  const context = useContext(LibraryContext)
  if (!context) throw new Error('useLibrary must be used within LibraryProvider')
  return context
}
