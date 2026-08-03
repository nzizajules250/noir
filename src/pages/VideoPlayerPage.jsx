import { ArrowLeft, Maximize, Play, Settings } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { featuredMovie, movies, shows } from '../data/catalog'
import { useLibrary } from '../contexts/LibraryContext'
import { useToast } from '../contexts/ToastContext'

export default function VideoPlayerPage({ navigate }) {
  const { slug } = useParams()
  const { progress, saveProgress } = useLibrary()
  const { showToast } = useToast()
  const titleCase = slug?.replaceAll('-', ' ')
  const movie = [featuredMovie, ...movies, ...shows].find((item) => item.slug === slug) ?? { ...featuredMovie, title: titleCase?.replace(/\b\w/g, (letter) => letter.toUpperCase()) || featuredMovie.title }
  const watched = progress[movie.title] ?? 33
  const updateProgress = () => { const next = Math.min(watched + 10, 100); saveProgress(movie.title, next); showToast(next === 100 ? `${movie.title} marked as watched` : `Progress saved at ${next}%`) }
  return <main><section className="video-player relative grid min-h-[470px] place-items-center md:h-[min(72vh,690px)]"><div className="absolute left-[4vw] top-6 flex items-center gap-4 text-xs tracking-widest"><button onClick={() => navigate('home')} aria-label="Back to home"><ArrowLeft size={20} /></button>{movie.title.toUpperCase()}</div><button onClick={updateProgress} className="grid size-[68px] place-items-center rounded-full border border-white/80 bg-white/10 pl-1 text-white backdrop-blur" aria-label={`Play ${movie.title}`}><Play fill="currentColor" /></button><div className="absolute bottom-6 left-[4vw] right-[4vw] flex items-center gap-3 text-[10px]"><span>{Math.floor(watched * 1.2)}:12</span><i className="h-[3px] flex-1 bg-white/30"><b className="block h-full bg-red-600" style={{ width: `${watched}%` }} /></i><span>{movie.duration ?? '2h 08m'}</span><Settings size={16} /><Maximize size={16} /></div></section><section className="mx-auto flex max-w-5xl flex-col justify-between gap-10 px-8 py-11 md:flex-row"><div><p className="eyebrow">2026 · 16+ · {movie.duration ?? '2H 08M'}</p><h1 className="mb-2 text-3xl font-bold tracking-tight">{movie.title}</h1><p className="max-w-xl text-[13px] leading-7 text-zinc-400">{movie.synopsis ?? featuredMovie.synopsis}</p></div><aside className="min-w-48 text-xs"><b>Cast</b><p className="mb-5 mt-1 leading-5 text-zinc-400">Eva Green, Daniel Kaluuya,<br />Jessica Barden</p><b>Genres</b><p className="mt-1 leading-5 text-zinc-400">{movie.genre ?? 'Drama'}, Mystery, Psychological</p></aside></section></main>
}
