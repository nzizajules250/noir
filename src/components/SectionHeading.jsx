import { ArrowRight } from 'lucide-react'

export default function SectionHeading({ eyebrow, title, actionLabel = 'Explore', onAction }) {
  return <header className="mb-6 flex items-end justify-between">
    <div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h2 className="text-2xl font-bold tracking-tight">{title}</h2></div>
    {onAction && <button onClick={onAction} className="inline-flex items-center gap-1 text-xs text-zinc-400 transition hover:text-white">{actionLabel}<ArrowRight size={14} /></button>}
  </header>
}
