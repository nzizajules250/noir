import { ArrowRight } from 'lucide-react'
import Brand from '../components/Brand'
import Button from '../components/Button'

export default function AuthPage({ mode, navigate, showToast }) {
  const signup = mode === 'signup'
  const submit = (event) => { event.preventDefault(); navigate('home'); showToast(signup ? 'Your account is ready' : 'Welcome back, Amara') }
  return <main className="grid min-h-[calc(100vh-76px)] place-items-center bg-[radial-gradient(ellipse_at_50%_10%,#54101855,transparent_45%)] px-5 py-16"><section className="w-full max-w-md border border-white/10 bg-zinc-950 p-10 shadow-2xl"><Brand onClick={() => navigate('home')} /><p className="eyebrow mb-3 mt-12">{signup ? 'START YOUR STORY' : 'WELCOME BACK'}</p><h1 className="mb-7 text-5xl font-bold tracking-tight">{signup ? 'Make it yours.' : 'Good to see you.'}</h1><form onSubmit={submit} className="flex flex-col gap-5">{signup && <Field label="Name" placeholder="Your name" />}<Field label="Email" type="email" placeholder="you@email.com" /><label>Password {!signup && <a className="float-right text-[11px] font-normal text-zinc-400">Forgot password?</a>}<input required type="password" placeholder="••••••••" /></label><Button type="submit">{signup ? 'Create account' : 'Sign in'} <ArrowRight size={14} /></Button></form><p className="mt-6 text-xs text-zinc-400">{signup ? 'Already a member?' : 'New to NOIR?'} <button className="text-red-400" onClick={() => navigate(signup ? 'login' : 'signup')}>{signup ? 'Sign in' : 'Create an account'}</button></p></section></main>
}
function Field({ label, ...props }) { return <label>{label}<input required {...props} /></label> }
