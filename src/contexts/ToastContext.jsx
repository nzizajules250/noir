import { createContext, useContext, useMemo, useState } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [message, setMessage] = useState('')
  const showToast = (nextMessage) => setMessage(nextMessage)
  const value = useMemo(() => ({ message, showToast, dismissToast: () => setMessage('') }), [message])
  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}
