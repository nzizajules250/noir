import { Play, Search } from 'lucide-react'
import { useState } from 'react'
import Button from '../components/Button'
import MovieCard from '../components/MovieCard'
import SectionHeading from '../components/SectionHeading'
import { movies, shows } from '../data/catalog'

const genres = ['All', 'Drama', 'Thriller', 'Sci-fi', 'Documentary']

export default function CatalogPage({ kind = 'movies', navigate }) {
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [search, setSearch] = useState('')
  const isShows = kind === 'tvshows'
  const source = isShows ? shows : movies
  const visible = source.filter(({ title, meta, genre }) => `${title} ${meta}`.toLowerCase().includes(search.toLowerCase()) && (selectedGenre === 'All' || genre === selectedGenre))
  return <main className="min-h-[calc(100vh-76px)] px-[6.5vw] py-16">
    <header className="mb-9"><p className="eyebrow">{isShows ? 'EPISODES & SEASONS' : 'ALL STORIES'}</p><h1 className="page-title">{isShows ? 'TV shows' : 'Movies'}</h1><p className="mt-2 text-sm text-zinc-400">{isShows ? 'Stories worth staying up for.' : 'From quietly devastating dramas to worlds beyond imagination.'}</p></header>
    {isShows ? <><section className="feature-show mb-16 flex h-[350px] items-center p-12"><div><p className="eyebrow">SEASON 02 · NOW STREAMING</p><h2 className="mb-4 text-5xl font-bold leading-[.92] tracking-tight">The Last<br /><i>Frequency</i></h2><p className="mb-5 max-w-sm text-[13px] leading-6 text-zinc-300">A radio host receives broadcasts from a city that vanished thirty years ago.</p><Button onClick={() => navigate(`/watch/${source[0].slug}`)}><Play size={14} fill="currentColor" />Watch S2:E1</Button></div></section><SectionHeading title="Popular series" /><div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">{source.map((movie) => <MovieCard key={movie.title} movie={movie} onClick={() => navigate(`/watch/${movie.slug}`)} />)}</div></> : <><div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-y border-white/10 py-3"><div>{genres.map((genre) => <button key={genre} onClick={() => setSelectedGenre(genre)} className={`px-2.5 py-1.5 text-xs ${selectedGenre === genre ? 'bg-zinc-800 text-white' : 'text-zinc-400'}`}>{genre}</button>)}</div><label className="flex items-center gap-1 text-zinc-400"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} className="w-32 bg-transparent px-1 py-2 text-xs outline-none placeholder:text-zinc-500" placeholder="Search films" /></label></div><div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">{visible.map((movie) => <MovieCard key={movie.title} movie={movie} onClick={() => navigate(`/watch/${movie.slug}`)} />)}</div></>}
  </main>
}
