import { Play, Plus, Star } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import Button from '../components/Button'
import MovieCard from '../components/MovieCard'
import SectionHeading from '../components/SectionHeading'
import { useCatalog } from '../hooks/useCatalog'
import { useLibrary } from '../contexts/LibraryContext'
import { useToast } from '../contexts/ToastContext'

// Pulls the 11-char video ID out of watch?v=, youtu.be/, embed/, and /shorts/ links.
function getYouTubeId(url) {
  if (!url) return null
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  )
  return match ? match[1] : null
}

export default function HomePage({ navigate }) {
  const { items: catalog, loading } = useCatalog()
  const { watchlist, progress, toggleWatchlist } = useLibrary()
  const { showToast } = useToast()
  const [heroVideoError, setHeroVideoError] = useState(false)

  const heroYtContainerRef = useRef(null)
  const heroYtPlayerRef = useRef(null)

  const featured = catalog.find((movie) => movie.featured) ?? catalog[0]

  const continueWatching = catalog
    .filter((movie) => progress[movie.title] > 0 && progress[movie.title] < 100)
    .slice(0, 3)

  const trending = catalog.filter((movie) => movie.slug !== featured?.slug).slice(0, 6)

  const heroSource = !heroVideoError && (featured?.trailerUrl || featured?.videoUrl)
  const heroYouTubeId = getYouTubeId(heroSource || undefined)

  const saveToWatchlist = () => {
    if (!featured) return
    const exists = watchlist.includes(featured.title)
    toggleWatchlist(featured.title)
    showToast(exists ? `${featured.title} was removed from your waitlist` : `${featured.title} was added to your waitlist`)
  }

  // Same issue as the /watch page: a plain <video src> can't play a YouTube
  // link. Mount a real YouTube player for the hero background when that's
  // what we've got. This hook has to run unconditionally (before the
  // loading/!featured early returns below) to keep hook order stable —
  // heroYouTubeId is just null until `featured` is loaded, so it's a no-op
  // until then.
  useEffect(() => {
    if (!heroYouTubeId) return

    let cancelled = false

    function createPlayer() {
      if (cancelled || !heroYtContainerRef.current) return
      heroYtPlayerRef.current = new window.YT.Player(heroYtContainerRef.current, {
        videoId: heroYouTubeId,
        width: '100%',
        height: '100%',
        playerVars: {
          autoplay: 1,
          mute: 1,
          loop: 1,
          playlist: heroYouTubeId, // required for `loop` to work on a single video
          controls: 1,
          playsinline: 1,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: (event) => {
            // Belt-and-suspenders: browsers block unmuted autoplay, so force
            // muted before playing regardless of whether the `mute` playerVar
            // was honored.
            event.target.mute()
            event.target.playVideo()
          },
          onError: () => setHeroVideoError(true),
        },
      })
    }

    if (window.YT?.Player) {
      createPlayer()
    } else {
      const existingCallback = window.onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = () => {
        existingCallback?.()
        createPlayer()
      }
      if (!document.getElementById('youtube-iframe-api')) {
        const tag = document.createElement('script')
        tag.id = 'youtube-iframe-api'
        tag.src = 'https://www.youtube.com/iframe_api'
        document.body.appendChild(tag)
      }
    }

    return () => {
      cancelled = true
      heroYtPlayerRef.current?.destroy?.()
      heroYtPlayerRef.current = null
    }
  }, [heroYouTubeId])

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-76px)] px-[6.5vw] py-16">
        <div className="mb-16 h-[400px] animate-pulse rounded-3xl bg-white/5" />
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="aspect-[2/3] animate-pulse rounded-xl bg-white/5" />
          ))}
        </div>
      </main>
    )
  }

  if (!featured) {
    return (
      <main className="grid min-h-[calc(100vh-76px)] place-items-center px-5 text-center">
        <div>
          <h1 className="mb-2 text-2xl font-bold">Nothing here yet.</h1>
          <p className="text-sm text-zinc-400">Titles will appear as soon as they're added to the catalogue.</p>
        </div>
      </main>
    )
  }

  return (
    <>
      <section className="relative flex min-h-[560px] items-center overflow-hidden px-[9vw] md:h-[min(690px,calc(100vh-76px))]">
        {/* Portrait art, right-aligned — bleeds off the edge like the reference, not a full-bleed background */}
        <div className="absolute inset-y-0 right-0 w-full md:w-[58%]">
          {heroYouTubeId ? (
            <div ref={heroYtContainerRef} className="h-full w-full overflow-hidden" />
          ) : heroSource ? (
            <video
              src={heroSource}
              poster={featured.image}
              autoPlay
              muted
              loop
              playsInline
              controls
              preload="metadata"
              onError={() => setHeroVideoError(true)}
              className="h-full w-full object-cover object-top"
            />
          ) : (
            <img src={featured.image} alt={featured.title} className="h-full w-full object-cover object-top" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#090909] via-[#090909]/50 to-transparent md:via-[#090909]/5" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-transparent to-[#090909]/30" />

        <div className="relative z-10 max-w-lg">
          <p className="eyebrow">NOIR {featured.kind === 'show' ? 'SERIES' : 'ORIGINAL'}</p>
          <h1 className="hero-title text-6xl">{featured.title}</h1>

          <div className="mb-5 flex items-center gap-3">
            <div className="flex items-center gap-0.5 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} fill={i < 4 ? 'currentColor' : 'none'} />
              ))}
            </div>
            {featured.genre && (
              <span className="rounded-full border border-white/15 px-2.5 py-1 text-[10px] tracking-wide text-zinc-300">{featured.genre}</span>
            )}
            {featured.duration && (
              <span className="rounded-full border border-white/15 px-2.5 py-1 text-[10px] tracking-wide text-zinc-300">{featured.duration}</span>
            )}
          </div>

          <p className="mb-7 max-w-md text-sm leading-7 text-zinc-300">{featured.synopsis ?? ''}</p>

          <div className="flex flex-wrap gap-4">
            <Button onClick={() => navigate(`/watch/${featured.slug}`)}><Play size={14} fill="currentColor" />Play now</Button>
            <Button variant="outline" onClick={saveToWatchlist}>
              <Plus size={15} />
              {watchlist.includes(featured.title) ? 'In your waitlist' : 'My waitlist'}
            </Button>
          </div>
        </div>
      </section>

      {continueWatching.length > 0 && (
        <section className="px-[6.5vw] pt-16">
          <SectionHeading eyebrow="HANDPICKED FOR YOU" title="Continue watching" onAction={() => navigate('movies')} />
          <div className="flex gap-[18px] overflow-x-auto pb-2">
            {continueWatching.map((movie) => (
              <button
                className="group relative h-44 w-[315px] shrink-0 overflow-hidden rounded-2xl text-left ring-1 ring-white/10 transition duration-300 hover:-translate-y-1 hover:ring-white/20"
                onClick={() => navigate(`/watch/${movie.slug}`)}
                key={movie.slug}
              >
                <img
                  className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-105 group-hover:brightness-75"
                  src={movie.image}
                  alt={movie.title}
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/60 to-transparent px-4 pb-3 pt-10">
                  <b className="text-xs font-semibold">{movie.title}</b>
                  <span className="mt-2.5 flex items-center gap-2">
                    <i className="block h-[3px] flex-1 overflow-hidden rounded-full bg-white/20 not-italic">
                      <em className="block h-full rounded-full bg-red-600 transition-[width] duration-500" style={{ width: `${progress[movie.title]}%` }} />
                    </i>
                    <small className="text-[10px] text-zinc-400">{progress[movie.title]}%</small>
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="px-[6.5vw] pt-16">
        <SectionHeading eyebrow="NEW THIS WEEK" title="Trending now" onAction={() => navigate('movies')} />
        {trending.length ? (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {trending.map((movie) => (
              <MovieCard key={movie.slug} movie={movie} onClick={() => navigate(`/watch/${movie.slug}`)} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-500">More titles coming soon.</p>
        )}
      </section>
    </>
  )
}