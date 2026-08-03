import { createContext, useContext, useMemo, useState } from 'react'
import { readStorage, writeStorage } from '../services/storage'

const AuthContext = createContext(null)
const defaultUser = { name: 'Amara Davis', email: 'amara@email.com', plan: 'Essential', memberSince: '2024' }

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStorage('user', null))
  const signIn = ({ email }) => {
    const nextUser = { ...defaultUser, email }
    setUser(nextUser)
    writeStorage('user', nextUser)
  }
  const signUp = ({ name, email }) => {
    const nextUser = { ...defaultUser, name, email, memberSince: new Date().getFullYear().toString() }
    setUser(nextUser)
    writeStorage('user', nextUser)
  }
  const signOut = () => { setUser(null); window.localStorage.removeItem('noir.user') }
  const value = useMemo(() => ({ user, isAuthenticated: Boolean(user), signIn, signUp, signOut }), [user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
