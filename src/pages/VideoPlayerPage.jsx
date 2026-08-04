import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Lock, Maximize, Pause, Play, Settings } from 'lucide-react'
import { useParams } from 'react-router-dom'
import Button from '../components/Button'
import { useAuth } from '../contexts/AuthContext'
import { useLibrary } from '../contexts/LibraryContext'

const API = import.meta.env.VITE_API_URL

function getYouTubeId(url) {
  if (!url) return null
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return match ? match[1] : null
}

export default function VideoPlayerPage({ navigate }) {
  const { slug } = useParams()
  const { user, loading: authLoading } = useAuth()
  const { progress, saveProgress } = useLibrary()

  const [movie, setMovie] = useState(null)
  const [status, setStatus] = useState('loading')
  const [playing, setPlaying] = useState(false)
  const [playerError, setPlayerError] = useState(false)
  const videoRef = useRef(null)
  const containerRef = useRef(null)
  const lastSavedAt = useRef(0)

  useEffect(() => {
    setStatus('loading')
    fetch(`${API}/api/movies/${slug}`)
      .then((res) => {
        if (res.status === 404) { setStatus('not-found'); return null }
        if (!res.ok) throw new Error('Failed to load')
        return res.json()
      })
      .then((data) => { if (data) { setMovie(data); setStatus('ready') } })
      .catch(() => setStatus('error'))
  }, [slug])

  useEffect(() => {
    if (!authLoading && !user) navigate('login')
  }, [authLoading, user, navigate])

  useEffect(() => {
    setPlayerError(false)
    setPlaying(false)
  }, [movie?.videoUrl])

  const canWatch = user?.subscriptionActive
  const watched = movie ? progress[movie.title] ?? 0 : 0
  const mainVideoSource = movie?.videoUrl || movie?.trailerUrl
  const mainYouTubeId = getYouTubeId(mainVideoSource)
  const trailerYouTubeId = getYouTubeId(movie?.trailerUrl)
  const isDirectVideo = !!mainVideoSource && !mainYouTubeId

  const handlePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) video.play()
    else video.pause()
  }

  const handleTimeUpdate = () => {
    const video = videoRef.current
    if (!video || !video.duration) return
    const percentage = Math.round((video.currentTime / video.duration) * 100)
    const now = Date.now()
    if (now - lastSavedAt.current > 5000 || percentage === 100) {
      lastSavedAt.current = now
      saveProgress(movie.title, percentage)
    }
  }

  const toggleFullscreen = () => {
    if (!containerRef.current) return
    if (document.fullscreenElement) document.exitFullscreen()
    else containerRef.current.requestFullscreen()
  }

  if (status === 'loading' || authLoading) {
    return (
      <main className="grid min-h-[calc(100vh-76px)] place-items-center">
        <div className="size-10 animate-spin rounded-full border-2 border-white/20 border-t-white/70" />
      </main>
    )
  }

  if (status === 'not-found') {
    return (
      <main className="grid min-h-[calc(100vh-76px)] place-items-center px-5 text-center">
        <div>
          <h1 className="mb-2 text-2xl font-bold">This title isn't available.</h1>
          <p className="mb-5 text-sm text-zinc-400">It may have been removed from the catalogue.</p>
          <button onClick={() => navigate('home')} className="text-sm text-red-400">Back to home</button>
        </div>
      </main>
    )
  }

  if (status === 'error') {
    return (
      <main className="grid min-h-[calc(100vh-76px)] place-items-center px-5 text-center">
        <div>
          <h1 className="mb-2 text-2xl font-bold">Something went wrong.</h1>
          <p className="mb-5 text-sm text-zinc-400">Couldn't load this title. Check your connection and try again.</p>
          <button onClick={() => window.location.reload()} className="text-sm text-red-400">Retry</button>
        </div>
      </main>
    )
  }

  const cast = movie.cast?.length ? movie.cast : ['Cast information unavailable']
  const genres = movie.genre ? [movie.genre] : ['Uncategorized']

  return (
    <main>
      <section ref={containerRef} className="relative grid min-h-[470px] place-items-center overflow-hidden bg-black md:h-[min(72vh,690px)]">
        {canWatch ? (
          isDirectVideo ? (
            <video
              ref={videoRef}
              className="h-full w-full object-contain"
              src={mainVideoSource}
              poster={movie.image}
              controls
              playsInline
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onEnded={() => { setPlaying(false); saveProgress(movie.title, 100) }}
              onTimeUpdate={handleTimeUpdate}
              onError={() => setPlayerError(true)}
            />
          ) : (
            <iframe
              title={movie.title}
              className="h-full w-full"
              src={`https://www.youtube.com/embed/${mainYouTubeId}?controls=1&rel=0&modestbranding=1&playsinline=1`}
              allow="autoplay; encrypted-media; picture-in-picture"
            />
          )
        ) : (
          <img src={movie.image} alt={movie.title} className="h-full w-full object-cover opacity-30" />
        )}

        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex h-28 items-start bg-gradient-to-b from-black/70 to-transparent px-[4vw] pt-6">
          <div className="pointer-events-auto flex items-center gap-4 text-xs tracking-widest">
            <button
              onClick={() => navigate('home')}
              aria-label="Back to home"
              className="grid size-9 place-items-center rounded-full border border-white/15 bg-white/[0.06] backdrop-blur-md transition hover:bg-white/10"
            >
              <ArrowLeft size={16} />
            </button>
            <span>{movie.title.toUpperCase()}</span>
          </div>
        </div>

        {canWatch ? (
          !playing && !playerError && isDirectVideo && (
            <button
              onClick={handlePlay}
              className="group relative z-10 grid size-[76px] place-items-center rounded-full border border-white/70 bg-white/10 pl-1 text-white backdrop-blur transition duration-200 hover:scale-105 hover:border-white hover:bg-white/20"
              aria-label={`Play ${movie.title}`}
            >
              <span className="absolute inset-0 -z-10 rounded-full bg-red-600/0 blur-xl transition group-hover:bg-red-600/30" />
              <Play size={26} fill="currentColor" />
            </button>
          )
        ) : (
          <div className="relative z-10 flex flex-col items-center gap-4 text-center">
            <div className="grid size-16 place-items-center rounded-full border border-white/20 bg-white/5 backdrop-blur-md">
              <Lock size={22} className="text-zinc-300" />
            </div>
            <div>
              <p className="mb-1 text-sm font-semibold">Membership required</p>
              <p className="mb-4 text-xs text-zinc-400">Subscribe to watch {movie.title}.</p>
              <Button onClick={() => navigate('payment')}>See plans</Button>
            </div>
          </div>
        )}

        {canWatch && (
          <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/85 to-transparent px-[4vw] pb-6 pt-14">
            <div className="flex items-center gap-3 text-[11px] text-zinc-300">
              <button onClick={handlePlay} aria-label={playing ? 'Pause' : 'Play'} className="text-zinc-300 transition hover:text-white">
                {playing ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <span className="tabular-nums">{watched}%</span>
              <i className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/25 not-italic">
                <b className="block h-full rounded-full bg-red-600 transition-[width] duration-300" style={{ width: `${watched}%` }} />
              </i>
              <span className="tabular-nums">{movie.duration ?? ''}</span>
              <button aria-label="Playback settings" className="text-zinc-300 transition hover:text-white">
                <Settings size={16} />
              </button>
              <button onClick={toggleFullscreen} aria-label="Full screen" className="text-zinc-300 transition hover:text-white">
                <Maximize size={16} />
              </button>
            </div>
          </div>
        )}
      </section>

      {movie.trailerUrl && (
        <section className="mx-auto max-w-5xl px-8 py-10">
          <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">Trailer</h2>
                <p className="text-sm text-zinc-400">Watch the preview for {movie.title}.</p>
              </div>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">Preview</span>
            </div>
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-black">
              {trailerYouTubeId ? (
                <iframe
                  className="h-[240px] w-full"
                  src={`https://www.youtube.com/embed/${trailerYouTubeId}?autoplay=1&mute=1&loop=1&playlist=${trailerYouTubeId}&controls=1&modestbranding=1&playsinline=1&rel=0`}
                  title={`${movie.title} trailer`}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  loading="lazy"
                />
              ) : (
                <video
                  src={movie.trailerUrl}
                  poster={movie.image}
                  className="h-[240px] w-full object-cover"
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              )}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto flex max-w-5xl flex-col justify-between gap-10 px-8 py-11 md:flex-row">
        <div>
          <p className="eyebrow">2026 · 16+ · {movie.duration ?? ''}</p>
          <h1 className="mb-2 text-3xl font-bold tracking-tight">{movie.title}</h1>
          <p className="max-w-xl text-[13px] leading-7 text-zinc-400">{movie.synopsis ?? 'No synopsis available.'}</p>
        </div>

        <aside className="min-w-48 text-xs">
          <b>Cast</b>
          <div className="mb-5 mt-2 flex flex-wrap gap-1.5">
            {cast.map((name) => (
              <span key={name} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-zinc-400">{name}</span>
            ))}
          </div>
          <b>Genres</b>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {genres.map((genre) => (
              <span key={genre} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-zinc-400">{genre}</span>
            ))}
          </div>
        </aside>
      </section>
    </main>
  )
}
