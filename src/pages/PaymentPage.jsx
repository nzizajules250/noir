import Button from '../components/Button'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'

const plans = [{ name: 'ESSENTIAL', price: '9', features: ['Full HD streaming', '2 screens at once', 'Download on 1 device'] }, { name: 'PREMIUM', price: '15', featured: true, features: ['Ultra HD streaming', '4 screens at once', 'Download on 6 devices'] }]

export default function PaymentPage() {
  const { user, changePlan } = useAuth()
  const { showToast } = useToast()
  const selectPlan = (plan) => { changePlan(plan); showToast(`${plan} membership is now active`) }
  return <main className="flex min-h-[700px] flex-col items-center gap-12 bg-[radial-gradient(ellipse_at_90%_50%,#57101555,transparent_45%)] px-[6.5vw] py-16 lg:flex-row lg:gap-[9vw]"><section className="w-full lg:w-[35%]"><p className="eyebrow">YOUR MEMBERSHIP</p><h1 className="page-title text-6xl leading-[.95]">Choose your<br /><i>escape.</i></h1><p className="mt-5 text-sm text-zinc-400">Cancel anytime. No contracts, ever.</p></section><div className="flex w-full gap-4 lg:flex-1">{plans.map((plan) => { const selected = user.plan.toLowerCase() === plan.name.toLowerCase(); return <article key={plan.name} className={`relative w-1/2 border p-7 ${plan.featured ? 'border-red-500 bg-[linear-gradient(150deg,#301014,#151515_30%)]' : 'border-white/10 bg-zinc-950'}`}>{plan.featured && <small className="absolute -top-3 left-5 bg-red-600 px-2 py-1 font-mono text-[9px] tracking-wider">MOST LOVED</small>}<p className="font-mono text-[10px] tracking-widest text-zinc-400">{plan.name}</p><h2 className="my-3 text-4xl font-bold">${plan.price}<span className="text-xs font-normal text-zinc-400">/mo</span></h2><ul className="mb-7 list-inside list-['✓_'] text-[11px] leading-7 text-zinc-300 marker:text-red-500">{plan.features.map((feature) => <li key={feature}>{feature}</li>)}</ul><Button variant={selected ? 'outline' : 'primary'} className="w-full" onClick={() => !selected && selectPlan(plan.name[0] + plan.name.slice(1).toLowerCase())}>{selected ? 'Current plan' : `Choose ${plan.name[0] + plan.name.slice(1).toLowerCase()}`}</Button></article> })}</div></main>
}
