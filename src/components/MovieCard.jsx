export default function MovieCard({ movie, onClick }) {
  return <button onClick={onClick} className="movie-card group relative aspect-[2/3] overflow-hidden bg-zinc-900 text-left">
    <img className="h-full w-full object-cover transition duration-300 group-hover:scale-105 group-hover:brightness-75" src={movie.image} alt={movie.title} />
    <span className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-black via-black/70 to-transparent px-3 pb-3 pt-8 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
      <strong className="block text-xs">{movie.title}</strong>
      <small className="mt-1 block text-[10px] text-zinc-400">{movie.meta}</small>
    </span>
  </button>
}
