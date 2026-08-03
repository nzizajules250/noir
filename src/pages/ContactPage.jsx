import { ArrowRight } from 'lucide-react'
import Button from '../components/Button'
import { useToast } from '../contexts/ToastContext'

export default function ContactPage() {
  const { showToast } = useToast()
  const submit = (event) => { event.preventDefault(); event.currentTarget.reset(); showToast('Your message has been sent') }
  return <main className="mx-auto grid min-h-[calc(100vh-76px)] max-w-6xl grid-cols-1 gap-10 px-8 py-16 md:grid-cols-[1.15fr_.85fr] md:gap-20">
    <section><p className="eyebrow">WE’D LOVE TO HEAR FROM YOU</p><h1 className="page-title">Say hello.</h1><p className="mb-8 mt-2 max-w-lg text-sm leading-7 text-zinc-400">Have a question, a story recommendation, or need a hand? Send us a note.</p><form onSubmit={submit} className="flex flex-col gap-5"><div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><Field label="First name" placeholder="Amara" /><Field label="Email" type="email" placeholder="amara@email.com" /></div><label>What can we help with?<select defaultValue=""><option value="" disabled>Choose a topic</option><option>Account & billing</option><option>Content request</option><option>Technical support</option></select></label><label>Message<textarea required placeholder="Tell us a little more..." /></label><Button className="self-start" type="submit">Send message <ArrowRight size={14} /></Button></form></section>
    <aside className="border-l-0 border-white/10 pt-8 md:border-l md:pl-10"><p className="eyebrow">MEMBER SUPPORT</p><h2 className="text-2xl font-bold tracking-tight">Here when you need us.</h2><p className="mt-4 text-[13px] leading-6 text-zinc-400">We typically reply within one business day.</p><a className="mt-3 inline-block text-[13px] text-red-400" href="mailto:hello@noir.example">hello@noir.example</a></aside>
  </main>
}

function Field({ label, ...props }) { return <label>{label}<input required {...props} /></label> }
