import { Bell, ChevronDown, ChevronRight, Menu, X } from 'lucide-react'
import { useState } from 'react'
import Brand from './Brand'
import { profileImage } from '../data/catalog'
import { useAuth } from '../contexts/AuthContext'

const links = [['home', 'Home'], ['movies', 'Movies'], ['tvshows', 'TV Shows'], ['contact', 'Contact']]

export default function Navbar({ activePage, navigate, notificationsOpen, setNotificationsOpen }) {
  const [profileOpen, setProfileOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, isAuthenticated, signOut } = useAuth()
  const go = (page) => { navigate(page); setProfileOpen(false); setMobileOpen(false) }

  return (
    <div className="sticky top-4 z-30 mx-4 sm:mx-6 lg:mx-10">
      <header className="flex h-[68px] items-center gap-5 rounded-3xl border border-white/10 bg-white/[0.06] px-6 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.6)] backdrop-blur-2xl md:gap-11 md:px-8">
        <Brand onClick={() => go('home')} />

        <nav className="hidden gap-7 md:flex">
          {links.map(([page, label]) => (
            <button
              key={page}
              onClick={() => go(page)}
              className={`text-[13px] transition ${activePage === page ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-5">
          {isAuthenticated && (
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative text-white/90 transition hover:text-white"
            >
              <Bell size={18} />
              <b className="absolute -right-2 -top-2 grid size-4 place-items-center rounded-full bg-red-600 text-[9px] shadow-[0_0_0_2px_rgba(9,9,9,0.9)]">3</b>
            </button>
          )}

          {isAuthenticated ? (
            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 text-xs font-semibold">
                <img className="size-[30px] rounded-full object-cover ring-1 ring-white/15" src={profileImage} alt={user.name} />
                <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
                <ChevronDown className="hidden sm:block" size={14} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 w-48 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/80 p-2 shadow-2xl backdrop-blur-2xl">
                  {[['profile', 'My profile'], ['waitlist', 'My watchlist'], ['payment', 'Subscription']].map(([page, label]) => (
                    <button
                      key={page}
                      onClick={() => go(page)}
                      className="flex w-full items-center justify-between rounded-xl px-2.5 py-3 text-left text-xs text-zinc-300 transition hover:bg-white/5 hover:text-white"
                    >
                      {label}
                      {page === 'waitlist' ? <em className="not-italic text-zinc-500">12</em> : <ChevronRight size={14} />}
                    </button>
                  ))}
                  {user?.isAdmin && (
                    <button
                      onClick={() => go('admin')}
                      className="flex w-full items-center justify-between rounded-xl px-2.5 py-3 text-left text-xs text-red-300 transition hover:bg-white/5 hover:text-white"
                    >
                      Admin dashboard
                      <ChevronRight size={14} />
                    </button>
                  )}
                  <button
                    className="mt-1 w-full rounded-xl border-t border-white/10 px-2.5 py-3 text-left text-xs text-red-300 transition hover:bg-white/5"
                    onClick={() => { signOut(); go('home') }}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button onClick={() => go('login')} className="text-xs text-zinc-300 hover:text-white">Sign in</button>
              <button onClick={() => go('signup')} className="rounded-full bg-red-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-red-500">Join NOIR</button>
            </div>
          )}

          <button onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation" className="text-white md:hidden">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {mobileOpen && (
        <nav className="mt-2 flex flex-col rounded-3xl border border-white/10 bg-zinc-900/80 px-6 py-4 shadow-2xl backdrop-blur-2xl md:hidden">
          {links.map(([page, label]) => (
            <button
              key={page}
              onClick={() => go(page)}
              className={`py-3 text-left text-sm ${activePage === page ? 'text-red-400' : 'text-zinc-300'}`}
            >
              {label}
            </button>
          ))}
        </nav>
      )}
    </div>
  )
}