import Brand from './Brand'

export default function Footer({ navigate }) {
  return (
    <footer className="relative mt-20 overflow-hidden border-t border-white/10 px-[6.5vw] py-10">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 select-none whitespace-nowrap text-[22vw] font-extrabold leading-none tracking-tighter text-white/[0.03] md:text-[9vw]"
      >
        NOIR
      </span>

      <div className="relative grid grid-cols-2 items-center gap-6 md:grid-cols-4">
        <Brand onClick={() => navigate('home')} />

        <p className="text-[13px] italic text-zinc-500" style={{ fontFamily: 'Georgia, serif' }}>
          Stories that stay with you.
        </p>

        <nav className="flex gap-5 text-[11px] text-zinc-500">
          <button onClick={() => navigate('contact')} className="transition hover:text-white">Help center</button>
          <button className="transition hover:text-white">Privacy</button>
          <button className="transition hover:text-white">Terms</button>
        </nav>

        <small className="text-[11px] text-zinc-600 md:text-right">© 2026 NOIR, Inc.</small>
      </div>
    </footer>
  )
}