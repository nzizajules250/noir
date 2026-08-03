import Brand from './Brand'

export default function Footer({ navigate }) {
  return <footer className="mt-20 grid grid-cols-2 items-center gap-5 border-t border-white/10 px-[6.5vw] py-9 text-[11px] text-zinc-500 md:grid-cols-4">
    <Brand onClick={() => navigate('home')} />
    <p>Stories that stay with you.</p>
    <nav className="flex gap-4"><button onClick={() => navigate('contact')}>Help center</button><button>Privacy</button><button>Terms</button></nav>
    <small className="md:text-right">© 2026 NOIR, Inc.</small>
  </footer>
}
