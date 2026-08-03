import { movies } from '../data/catalog'
import { useLibrary } from '../contexts/LibraryContext'
import { useToast } from '../contexts/ToastContext'

export default function WaitlistPage() {
  const { watchlist, toggleWatchlist } = useLibrary()
  const { showToast } = useToast()
  const items = movies.filter((movie) => watchlist.includes(movie.title))
  const remove = (title) => { toggleWatchlist(title); showToast('Removed from your waitlist') }
  return <main className="min-h-[calc(100vh-76px)] px-[6.5vw] py-16"><header className="mb-9"><p className="eyebrow">SAVED FOR LATER</p><h1 className="page-title">My waitlist</h1><p className="mt-2 text-sm text-zinc-400">Stories you don’t want to lose.</p></header>{items.length ? <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">{items.map((movie) => <article className="flex gap-4 border-b border-white/10 pb-5" key={movie.title}><img className="h-[110px] w-[73px] object-cover" src={movie.image} alt={movie.title} /><div><small className="text-[11px] text-zinc-400">{movie.meta}</small><h2 className="my-1 text-sm font-bold">{movie.title}</h2><button className="text-[11px] text-red-400" onClick={() => remove(movie.title)}>Remove</button></div></article>)}</div> : <section className="border border-dashed border-white/15 p-12 text-center"><h2 className="text-xl font-bold">Your waitlist is empty.</h2><p className="mt-2 text-sm text-zinc-400">Add a story from the catalogue and it will stay here.</p></section>}</main>
}
