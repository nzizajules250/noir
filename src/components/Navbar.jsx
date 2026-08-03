import { Bell, ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import Brand from './Brand'
import { profileImage } from '../data/catalog'
import { useAuth } from '../contexts/AuthContext'

const links = [['home', 'Home'], ['movies', 'Movies'], ['tvshows', 'TV Shows'], ['contact', 'Contact']]

export default function Navbar({ activePage, navigate, notificationsOpen, setNotificationsOpen }) {
  const [profileOpen, setProfileOpen] = useState(false)
  const { user, isAuthenticated, signOut } = useAuth()
  const go = (page) => { navigate(page); setProfileOpen(false) }

  return <header className="sticky top-0 z-30 flex h-[76px] items-center gap-11 border-b border-white/10 bg-[#090909]/90 px-[6.5vw] backdrop-blur-xl">
    <Brand onClick={() => go('home')} />
    <nav className="hidden gap-7 md:flex">{links.map(([page, label]) => <button key={page} onClick={() => go(page)} className={`text-[13px] transition ${activePage === page ? 'text-white' : 'text-zinc-500 hover:text-white'}`}>{label}</button>)}</nav>
    <div className="ml-auto flex items-center gap-5">
      {isAuthenticated && <button onClick={() => setNotificationsOpen(!notificationsOpen)} className="relative text-white"><Bell size={18} /><b className="absolute -right-2 -top-2 grid size-4 place-items-center rounded-full bg-red-600 text-[9px]">3</b></button>}
      {isAuthenticated ? <div className="relative"><button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 text-xs font-semibold"><img className="size-[30px] rounded-full object-cover" src={profileImage} alt={user.name} /><span className="hidden sm:inline">{user.name.split(' ')[0]}</span><ChevronDown className="hidden sm:block" size={14} /></button>
        {profileOpen && <div className="absolute right-0 top-11 w-48 border border-white/10 bg-zinc-900 p-2 shadow-2xl">{[['profile', 'My profile'], ['waitlist', 'My waitlist'], ['payment', 'Subscription']].map(([page, label]) => <button className="flex w-full items-center justify-between px-2.5 py-3 text-left text-xs text-zinc-300 hover:text-white" key={page} onClick={() => go(page)}>{label}{page === 'waitlist' ? <em className="not-italic">12</em> : <ChevronRight size={14} />}</button>)}<button className="mt-1 w-full border-t border-white/10 px-2.5 py-3 text-left text-xs text-red-300" onClick={() => { signOut(); go('home') }}>Sign out</button></div>}
      </div> : <div className="flex items-center gap-3"><button onClick={() => go('login')} className="text-xs text-zinc-300">Sign in</button><button onClick={() => go('signup')} className="bg-red-600 px-3 py-2 text-xs font-bold text-white">Join NOIR</button></div>}
    </div>
  </header>
}
