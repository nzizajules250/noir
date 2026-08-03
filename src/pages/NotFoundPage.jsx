import Button from '../components/Button'

export default function NotFoundPage({ navigate }) {
  return <main className="grid min-h-[calc(100vh-76px)] place-items-center px-6 text-center"><section><p className="eyebrow">404 · LOST IN THE STATIC</p><h1 className="page-title">This story<br />isn’t here.</h1><p className="mt-5 text-sm text-zinc-400">The page may have moved, or it never existed.</p><Button className="mt-8" onClick={() => navigate('home')}>Return home</Button></section></main>
}
