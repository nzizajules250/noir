// contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)
const API = import.meta.env.VITE_API_URL

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    const res = await fetch(`${API}/api/auth/me`, { credentials: 'include' })
    if (!res.ok) {
      setUser(null)
      return null
    }
    const data = await res.json()
    setUser(data)
    return data
  }

  useEffect(() => {
    refreshUser().finally(() => setLoading(false))
  }, [])

  const request = async (path, body) => {
    const res = await fetch(`${API}/api/auth/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Something went wrong')
    return data
  }

  const signUp = async (values) => {
    const data = await request('signup', values)
    setUser(data)
    return data
  }

  const signIn = async (values) => {
    const data = await request('signin', values)
    setUser(data)
    return data
  }

  const adminSignIn = async (values) => {
    const data = await signIn(values)
    if (!data.isAdmin) {
      await request('signout', {})
      setUser(null)
      throw new Error('Admin access required')
    }
    return data
  }

  const signOut = async () => { await request('signout', {}); setUser(null) }
  const changePlan = async (plan) => setUser((prev) => ({ ...prev, plan })) // real endpoint comes with Payments step

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, signIn, signUp, adminSignIn, signOut, changePlan, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)