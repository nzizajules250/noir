// hooks/useCatalog.js
import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_API_URL

export function useCatalog(kind) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const query = kind ? `?kind=${kind}` : ''
    fetch(`${API}/api/movies${query}`)
      .then((res) => res.json())
      .then(setItems)
      .finally(() => setLoading(false))
  }, [kind])

  return { items, loading }
}