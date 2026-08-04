import { Play } from 'lucide-react'

export default function MovieCard({ movie, onClick }) {
  return (
    <button
      onClick={onClick}
      className="movie-card group relative aspect-[2/3] overflow-hidden rounded-xl bg-zinc-900 text-left ring-1 ring-white/10 transition duration-300 hover:-translate-y-1 hover:ring-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
    >
      <img
        className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-110 group-hover:brightness-[0.4]"
        src={movie.image}
        alt={movie.title}
      />

      <span className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100">
        <span className="grid size-11 place-items-center rounded-full bg-red-600/90 shadow-[0_0_20px_rgba(237,32,39,0.5)] backdrop-blur-sm">
          <Play size={16} className="translate-x-[1px] fill-white text-white" />
        </span>
      </span>

      <span className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-black via-black/70 to-transparent px-3 pb-3 pt-10 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <strong className="block truncate text-xs font-semibold">{movie.title}</strong>
        <small className="mt-1 block truncate text-[10px] tracking-wide text-zinc-400">{movie.meta}</small>
      </span>
    </button>
  )
}