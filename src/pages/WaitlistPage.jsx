import { useState } from 'react'
import { movies } from '../data/catalog'

export default function WaitlistPage({ showToast }) {
  const [items, setItems] = useState(movies.slice(0, 8))
  const remove = (title) => { setItems((current) => current.filter((movie) => movie.title !== title)); showToast('Removed from your waitlist') }
  return <main className="min-h-[calc(100vh-76px)] px-[6.5vw] py-16"><header className="mb-9"><p className="eyebrow">SAVED FOR LATER</p><h1 className="page-title">My waitlist</h1><p className="mt-2 text-sm text-zinc-400">Stories you don’t want to lose.</p></header><div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">{items.map((movie) => <article className="flex gap-4 border-b border-white/10 pb-5" key={movie.title}><img className="h-[110px] w-[73px] object-cover" src={movie.image} alt={movie.title} /><div><small className="text-[11px] text-zinc-400">{movie.meta}</small><h2 className="my-1 text-sm font-bold">{movie.title}</h2><button className="text-[11px] text-red-400" onClick={() => remove(movie.title)}>Remove</button></div></article>)}</div></main>
}
