import { Play, Search, X } from 'lucide-react'
import { useState } from 'react'
import Button from '../components/Button'
import MovieCard from '../components/MovieCard'
import SectionHeading from '../components/SectionHeading'
import { useCatalog } from '../hooks/useCatalog'

const genres = ['All', 'Drama', 'Thriller', 'Sci-fi', 'Documentary']

export default function CatalogPage({ kind = 'movies', navigate }) {
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [search, setSearch] = useState('')
  const isShows = kind === 'tvshows'
  const { items: source, loading } = useCatalog(isShows ? 'show' : 'movie')

  const visible = source.filter(
    ({ title, meta, genre }) =>
      `${title} ${meta ?? ''}`.toLowerCase().includes(search.toLowerCase()) &&
      (selectedGenre === 'All' || genre === selectedGenre)
  )

  return (
    <main className="min-h-[calc(100vh-76px)] px-[6.5vw] py-16">
      <header className="mb-9">
        <p className="eyebrow">{isShows ? 'EPISODES & SEASONS' : 'ALL STORIES'}</p>
        <h1 className="page-title">{isShows ? 'TV shows' : 'Movies'}</h1>
        <p className="mt-2 text-sm text-zinc-400">{isShows ? 'Stories worth staying up for.' : 'From quietly devastating dramas to worlds beyond imagination.'}</p>
      </header>

      {loading ? (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="aspect-[2/3] animate-pulse rounded-xl bg-white/5" />
          ))}
        </div>
      ) : source.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-3xl border border-white/10 py-20 text-center">
          <p className="text-sm text-zinc-300">Nothing here yet.</p>
          <p className="text-xs text-zinc-500">{isShows ? 'New series are added regularly — check back soon.' : 'New titles are added regularly — check back soon.'}</p>
        </div>
      ) : isShows ? (
        <>
          <section className="feature-show relative mb-16 flex h-[350px] items-center overflow-hidden rounded-3xl p-12">
            <div className="relative z-10">
              <p className="eyebrow">SEASON 02 · NOW STREAMING</p>
              <h2 className="mb-4 text-5xl font-bold leading-[.92] tracking-tight">The Last<br /><i>Frequency</i></h2>
              <p className="mb-5 max-w-sm text-[13px] leading-6 text-zinc-300">A radio host receives broadcasts from a city that vanished thirty years ago.</p>
              <Button onClick={() => navigate(`/watch/${source[0].slug}`)}><Play size={14} fill="currentColor" />Watch S2:E1</Button>
            </div>
          </section>

          <SectionHeading title="Popular series" />
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {source.map((movie) => (
              <MovieCard key={movie.slug} movie={movie} onClick={() => navigate(`/watch/${movie.slug}`)} />
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="mb-9 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`rounded-full px-3.5 py-1.5 text-xs transition ${
                    selectedGenre === genre
                      ? 'bg-white text-black'
                      : 'border border-white/10 text-zinc-400 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>

            <label className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-zinc-400 transition focus-within:border-white/20">
              <Search size={14} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-32 bg-transparent p-0 text-xs outline-none placeholder:text-zinc-500 sm:w-44"
                placeholder="Search films"
              />
              {search && (
                <button onClick={() => setSearch('')} aria-label="Clear search" className="text-zinc-500 hover:text-white">
                  <X size={13} />
                </button>
              )}
            </label>
          </div>

          {visible.length ? (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
              {visible.map((movie) => (
                <MovieCard key={movie.slug} movie={movie} onClick={() => navigate(`/watch/${movie.slug}`)} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 rounded-3xl border border-white/10 py-20 text-center">
              <p className="text-sm text-zinc-300">Nothing matches "{search}"</p>
              <p className="text-xs text-zinc-500">Try a different title or clear the genre filter.</p>
            </div>
          )}
        </>
      )}
    </main>
  )
}