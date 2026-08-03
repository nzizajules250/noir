import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import NotificationCenter from './components/NotificationCenter'
import ProtectedRoute from './components/ProtectedRoute'
import Toast from './components/Toast'
import { AuthProvider } from './contexts/AuthContext'
import { LibraryProvider } from './contexts/LibraryContext'
import { ToastProvider, useToast } from './contexts/ToastContext'
import AuthPage from './pages/AuthPage'
import CatalogPage from './pages/CatalogPage'
import ContactPage from './pages/ContactPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import PaymentPage from './pages/PaymentPage'
import ProfilePage from './pages/ProfilePage'
import VideoPlayerPage from './pages/VideoPlayerPage'
import WaitlistPage from './pages/WaitlistPage'

const routes = { home: '/', movies: '/movies', tvshows: '/tv-shows', contact: '/contact', login: '/login', signup: '/signup', profile: '/profile', waitlist: '/waitlist', payment: '/payment', videoplayer: '/watch/the-veil' }

function Application() {
  const location = useLocation()
  const navigateTo = useNavigate()
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const { message, dismissToast } = useToast()
  const currentPage = useMemo(() => Object.entries(routes).find(([, path]) => path === location.pathname)?.[0] ?? '', [location.pathname])
  const navigate = (page) => { setNotificationsOpen(false); navigateTo(routes[page] ?? '/'); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  useEffect(() => { setNotificationsOpen(false) }, [location.pathname])
  useEffect(() => { if (!message) return undefined; const timer = window.setTimeout(dismissToast, 3200); return () => window.clearTimeout(timer) }, [message, dismissToast])
  return <><div className="grain" /><Navbar activePage={currentPage} navigate={navigate} notificationsOpen={notificationsOpen} setNotificationsOpen={setNotificationsOpen} /><Routes>
    <Route path="/" element={<HomePage navigate={navigate} />} />
    <Route path="/movies" element={<CatalogPage navigate={navigate} />} />
    <Route path="/tv-shows" element={<CatalogPage kind="tvshows" navigate={navigate} />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="/login" element={<AuthPage mode="login" navigate={navigate} />} />
    <Route path="/signup" element={<AuthPage mode="signup" navigate={navigate} />} />
    <Route path="/profile" element={<ProtectedRoute><ProfilePage navigate={navigate} /></ProtectedRoute>} />
    <Route path="/waitlist" element={<ProtectedRoute><WaitlistPage /></ProtectedRoute>} />
    <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
    <Route path="/watch/:slug" element={<ProtectedRoute><VideoPlayerPage navigate={navigate} /></ProtectedRoute>} />
    <Route path="/watch" element={<Navigate to="/watch/the-veil" replace />} />
    <Route path="*" element={<NotFoundPage navigate={navigate} />} />
  </Routes><Footer navigate={navigate} /><NotificationCenter open={notificationsOpen} onClear={() => setNotificationsOpen(false)} /><Toast message={message} /></>
}

export default function App() {
  return <BrowserRouter><AuthProvider><LibraryProvider><ToastProvider><Application /></ToastProvider></LibraryProvider></AuthProvider></BrowserRouter>
}
