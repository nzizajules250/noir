import { ArrowRight } from 'lucide-react'

export default function SectionHeading({ eyebrow, title, actionLabel = 'Explore', onAction }) {
  return (
    <header className="mb-6 flex items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      </div>

      {onAction && (
        <button
          onClick={onAction}
          className="group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 px-3.5 py-2 text-xs text-zinc-400 transition hover:border-white/20 hover:text-white"
        >
          {actionLabel}
          <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
      )}
    </header>
  )
}