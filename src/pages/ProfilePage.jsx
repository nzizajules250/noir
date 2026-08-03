import Button from '../components/Button'
import { profileImage } from '../data/catalog'
import { useAuth } from '../contexts/AuthContext'

export default function ProfilePage({ navigate }) {
  const { user } = useAuth()
  return <main className="min-h-[calc(100vh-76px)] px-[6.5vw] py-16"><header className="flex flex-wrap items-center gap-6 border-b border-white/10 pb-9"><img className="size-[90px] rounded-full object-cover" src={profileImage} alt={user.name} /><div><p className="eyebrow">MEMBER SINCE {user.memberSince}</p><h1 className="text-4xl font-bold tracking-tight">{user.name}</h1><p className="mt-1 text-[13px] text-zinc-400">{user.email}</p></div><Button variant="outline" className="ml-auto">Edit profile</Button></header><div className="mt-9 grid grid-cols-1 gap-5 md:grid-cols-2"><section className="border border-white/10 bg-zinc-950 p-6"><h2 className="mb-6 text-base font-bold">Membership</h2><div className="flex items-center gap-3"><b className="bg-red-600 px-3 py-2">N</b><p className="flex flex-col gap-1"><strong className="text-[13px]">NOIR {user.plan}</strong><small className="text-[11px] text-zinc-400">Renews Sep 03, 2026</small></p><button onClick={() => navigate('payment')} className="ml-auto text-xs text-red-400">Manage</button></div></section><section className="border border-white/10 bg-zinc-950 p-6"><h2 className="mb-4 text-base font-bold">Preferences</h2><Toggle label="Autoplay next episode" defaultChecked /><Toggle label="Email updates" /></section></div></main>
}
function Toggle({ label, defaultChecked }) { return <label className="toggle-row">{label}<input type="checkbox" defaultChecked={defaultChecked} /><i /></label> }
