import { Trash2 } from 'lucide-react'
import { featuredMovie, movies } from '../data/catalog'
import { useLibrary } from '../contexts/LibraryContext'
import { useToast } from '../contexts/ToastContext'

export default function WaitlistPage({ navigate }) {
  const { watchlist, toggleWatchlist } = useLibrary()
  const { showToast } = useToast()
  const items = [featuredMovie, ...movies].filter((movie) => watchlist.includes(movie.title))
  const remove = (title) => { toggleWatchlist(title); showToast('Removed from your waitlist') }

  return (
    <main className="min-h-[calc(100vh-76px)] px-[6.5vw] py-16">
      <header className="mb-9">
        <p className="eyebrow">SAVED FOR LATER</p>
        <h1 className="page-title">My waitlist</h1>
        <p className="mt-2 text-sm text-zinc-400">Stories you don't want to lose.</p>
      </header>

      {items.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((movie) => (
            <article
              key={movie.title}
              className="group flex gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-white/20 hover:bg-white/[0.05]"
            >
              <img className="h-[110px] w-[73px] shrink-0 rounded-lg object-cover" src={movie.image} alt={movie.title} />
              <div className="flex min-w-0 flex-1 flex-col">
                <small className="text-[11px] text-zinc-400">{movie.meta}</small>
                <h2 className="my-1 truncate text-sm font-bold">{movie.title}</h2>
                <button
                  onClick={() => remove(movie.title)}
                  className="mt-auto inline-flex w-fit items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-zinc-400 opacity-0 transition group-hover:opacity-100 hover:border-red-500/40 hover:text-red-400"
                >
                  <Trash2 size={12} />
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <section className="flex flex-col items-center gap-4 rounded-3xl border border-white/10 py-20 text-center">
          <h2 className="text-xl font-bold">Your waitlist is empty.</h2>
          <p className="max-w-xs text-sm text-zinc-400">Add a story from the catalogue and it will stay here.</p>
          {navigate && (
            <button
              onClick={() => navigate('movies')}
              className="mt-2 rounded-full bg-red-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-red-500"
            >
              Browse catalogue
            </button>
          )}
        </section>
      )}
    </main>
  )
}