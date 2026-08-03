import { Play, Plus } from 'lucide-react'
import Button from '../components/Button'
import MovieCard from '../components/MovieCard'
import SectionHeading from '../components/SectionHeading'
import { movies } from '../data/catalog'

export default function HomePage({ navigate, showToast }) {
  const progress = [42, 68, 21]
  return <>
    <section className="hero min-h-[560px] overflow-hidden px-[9vw] md:h-[min(690px,calc(100vh-76px))]">
      <div className="hero-image" />
      <div className="relative z-10"><p className="eyebrow">NOIR ORIGINAL <span>•</span> 2026</p><h1 className="hero-title">Beauty lives<br />in the <i>unknown.</i></h1><p className="max-w-md text-sm leading-7 text-zinc-300">A fragmented memory. A house that remembers.<br />And the woman determined to find the truth.</p><div className="mt-8 flex flex-wrap gap-4"><Button onClick={() => navigate('videoplayer')}><Play size={14} fill="currentColor" />Play now</Button><Button variant="outline" onClick={() => showToast('The Veil was added to your waitlist')}><Plus size={15} />My waitlist</Button></div></div>
      <div className="absolute bottom-7 left-[9vw] z-10 flex flex-col gap-1 text-[11px]"><b className="tracking-widest">THE VEIL</b><span className="text-zinc-400">Drama · Mystery · 2h 08m</span></div>
    </section>
    <section className="px-[6.5vw] pt-16"><SectionHeading eyebrow="HANDPICKED FOR YOU" title="Continue watching" onAction={() => navigate('movies')} /><div className="flex gap-[18px] overflow-x-auto pb-1">{movies.slice(3, 6).map((movie, index) => <button className="continue-card relative h-44 w-[315px] shrink-0 overflow-hidden text-left" onClick={() => navigate('videoplayer')} key={movie.title}><img className="h-full w-full object-cover" src={movie.image} alt={movie.title} /><span className="absolute inset-x-0 bottom-0 z-10 px-4 pb-3"><b className="text-xs">{movie.title}</b><i className="mt-2 block h-[3px] bg-white/30"><em className="block h-full bg-red-600" style={{ width: `${progress[index]}%` }} /></i></span></button>)}</div></section>
    <section className="px-[6.5vw] pt-16"><SectionHeading eyebrow="NEW THIS WEEK" title="Trending now" onAction={() => navigate('movies')} /><div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">{movies.slice(0, 6).map((movie) => <MovieCard key={movie.title} movie={movie} onClick={() => navigate('videoplayer')} />)}</div></section>
  </>
}
