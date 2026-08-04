import { useEffect, useMemo, useState } from 'react'
import Button from '../components/Button'
import { useAuth } from '../contexts/AuthContext'

const MOVIE_FIELDS = ['title', 'kind', 'genre', 'rating', 'releaseYear', 'trailer']

export default function AdminDashboard({ navigate }) {
  const { user } = useAuth()
  const [movies, setMovies] = useState([])
  const [users, setUsers] = useState([])
  const [transactions, setTransactions] = useState([])
  const [movieForm, setMovieForm] = useState({ title: '', image: '', videoUrl: '', trailerUrl: '', kind: 'movie', genre: '', rating: '', releaseYear: '' })
  const [selectedMovieId, setSelectedMovieId] = useState(null)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    if (!user?.isAdmin) return
    loadData()
  }, [user])

  const loadData = async () => {
    try {
      const [moviesRes, usersRes, txRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/admin/movies`, { credentials: 'include' }),
        fetch(`${import.meta.env.VITE_API_URL}/api/admin/users`, { credentials: 'include' }),
        fetch(`${import.meta.env.VITE_API_URL}/api/admin/transactions`, { credentials: 'include' }),
      ])
      if (!moviesRes.ok || !usersRes.ok || !txRes.ok) throw new Error('Failed to load admin data')

      setMovies(await moviesRes.json())
      setUsers(await usersRes.json())
      setTransactions(await txRes.json())
    } catch (error) {
      setMessage(error.message)
    }
  }

  const updateMovieForm = (field, value) => setMovieForm((prev) => ({ ...prev, [field]: value }))

  const handleAddMovie = async (event) => {
    event.preventDefault()
    setMessage(null)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/movies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(movieForm),
      })
      if (!res.ok) {
        const body = await res.json()
        throw new Error(body.error || 'Could not add movie')
      }
      const movie = await res.json()
      setMovies((prev) => [movie, ...prev])
      setMovieForm({ title: '', image: '', videoUrl: '', trailerUrl: '', kind: 'movie', genre: '', rating: '', releaseYear: '' })
      setSelectedMovieId(null)
      setMessage('Movie added successfully')
    } catch (error) {
      setMessage(error.message)
    }
  }

  const handleEditMovie = (movie) => {
    setSelectedMovieId(movie._id)
    setMovieForm({
      title: movie.title || '',
      image: movie.image || '',
      videoUrl: movie.videoUrl || '',
      trailerUrl: movie.trailerUrl || '',
      kind: movie.kind || 'movie',
      genre: movie.genre || '',
      rating: movie.rating || '',
      releaseYear: movie.releaseYear || '',
    })
  }

  const handleSaveMovie = async (event) => {
    event.preventDefault()
    setMessage(null)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/movies/${selectedMovieId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(movieForm),
      })
      if (!res.ok) {
        const body = await res.json()
        throw new Error(body.error || 'Could not save movie')
      }
      const movie = await res.json()
      setMovies((prev) => prev.map((item) => (item._id === movie._id ? movie : item)))
      setMovieForm({ title: '', image: '', videoUrl: '', trailerUrl: '', kind: 'movie', genre: '', rating: '', releaseYear: '' })
      setSelectedMovieId(null)
      setMessage('Movie updated successfully')
    } catch (error) {
      setMessage(error.message)
    }
  }

  const handleDeleteMovie = async (movieId) => {
    setMessage(null)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/movies/${movieId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) {
        const body = await res.json()
        throw new Error(body.error || 'Could not delete movie')
      }
      setMovies((prev) => prev.filter((item) => item._id !== movieId))
      setMessage('Movie deleted successfully')
    } catch (error) {
      setMessage(error.message)
    }
  }

  const headerValue = useMemo(() => `${user?.name ?? 'Admin'} dashboard`, [user])

  return (
    <main className="min-h-[calc(100vh-76px)] px-[6.5vw] py-16">
      <div className="mb-8 flex flex-wrap items-center gap-4">
        <div>
          <p className="eyebrow">ADMIN PANEL</p>
          <h1 className="text-4xl font-bold tracking-tight">{headerValue}</h1>
          <p className="mt-2 text-sm text-zinc-400">Manage users, movies, and transactions from a single place.</p>
        </div>
        <Button variant="outline" onClick={() => navigate('home')}>Back to home</Button>
      </div>

      {message && <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{message}</div>}

      <section className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-8">
          <article className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">{selectedMovieId ? 'Edit movie' : 'Add new movie'}</h2>
                <p className="text-sm text-zinc-400">{selectedMovieId ? 'Update the selected movie details.' : 'Add a movie record to the catalog.'}</p>
              </div>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">{movies.length} movies</span>
            </div>
            <form className="grid gap-4" onSubmit={selectedMovieId ? handleSaveMovie : handleAddMovie}>
              <div className="grid gap-4 md:grid-cols-2">
                <input value={movieForm.title} onChange={(e) => updateMovieForm('title', e.target.value)} placeholder="Title" className="input" required />
                <input value={movieForm.kind} onChange={(e) => updateMovieForm('kind', e.target.value)} placeholder="Kind" className="input" required />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <input value={movieForm.genre} onChange={(e) => updateMovieForm('genre', e.target.value)} placeholder="Genre" className="input" required />
                <input value={movieForm.rating} onChange={(e) => updateMovieForm('rating', e.target.value)} placeholder="Rating" className="input" required />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <input value={movieForm.releaseYear} onChange={(e) => updateMovieForm('releaseYear', e.target.value)} placeholder="Release year" className="input" required />
                <input value={movieForm.image} onChange={(e) => updateMovieForm('image', e.target.value)} placeholder="Image URL" className="input" required />
              </div>
              <input value={movieForm.videoUrl} onChange={(e) => updateMovieForm('videoUrl', e.target.value)} placeholder="Video URL" className="input" required />
              <input value={movieForm.trailerUrl} onChange={(e) => updateMovieForm('trailerUrl', e.target.value)} placeholder="Trailer URL" className="input" />
              <Button type="submit">{selectedMovieId ? 'Save changes' : 'Add movie'}</Button>
            </form>
            {selectedMovieId && (
              <div className="mt-4 flex items-center gap-3">
                <Button variant="outline" onClick={() => {
                  setSelectedMovieId(null)
                  setMovieForm({ title: '', image: '', videoUrl: '', trailerUrl: '', kind: 'movie', genre: '', rating: '', releaseYear: '' })
                }}>
                  Cancel edit
                </Button>
              </div>
            )}
          </article>

          <article className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
            <h2 className="mb-5 text-xl font-semibold">Transaction report</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-y-3 text-left text-sm">
                <thead>
                  <tr className="text-zinc-400">
                    <th className="pb-3">Date</th>
                    <th className="pb-3">User</th>
                    <th className="pb-3">Plan</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx._id} className="border-t border-white/10">
                      <td className="py-3 text-zinc-300">{new Date(tx.createdAt).toLocaleString()}</td>
                      <td className="py-3 text-zinc-300">{tx.user?.name || tx.user?.email || 'Unknown'}</td>
                      <td className="py-3 text-zinc-300">{tx.plan}</td>
                      <td className="py-3 text-zinc-300">${tx.amount.toFixed(2)}</td>
                      <td className={`py-3 font-semibold ${tx.status === 'successful' ? 'text-emerald-300' : tx.status === 'failed' ? 'text-red-300' : 'text-yellow-300'}`}>
                        {tx.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </div>

        <div className="space-y-8">
          <article className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
            <h2 className="mb-5 text-xl font-semibold">Users</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-y-3 text-left text-sm">
                <thead>
                  <tr className="text-zinc-400">
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Plan</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Admin</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((userData) => (
                    <tr key={userData._id} className="border-t border-white/10">
                      <td className="py-3 text-zinc-300">{userData.name}</td>
                      <td className="py-3 text-zinc-300">{userData.email}</td>
                      <td className="py-3 text-zinc-300">{userData.plan}</td>
                      <td className="py-3 text-zinc-300">{userData.subscriptionActive ? 'Active' : 'Inactive'}</td>
                      <td className="py-3 text-zinc-300">{userData.isAdmin ? 'Yes' : 'No'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
            <h2 className="mb-5 text-xl font-semibold">Movie catalog</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-y-3 text-left text-sm">
                <thead>
                  <tr className="text-zinc-400">
                    {MOVIE_FIELDS.map((field) => <th key={field} className="pb-3 capitalize">{field}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {movies.map((movie) => (
                    <tr key={movie._id} className="border-t border-white/10">
                      <td className="py-3 text-zinc-300">{movie.title}</td>
                      <td className="py-3 text-zinc-300">{movie.kind}</td>
                      <td className="py-3 text-zinc-300">{movie.genre}</td>
                      <td className="py-3 text-zinc-300">{movie.rating}</td>
                      <td className="py-3 text-zinc-300">{movie.releaseYear}</td>
                      <td className="py-3 text-zinc-300">{movie.trailerUrl ? 'Yes' : 'No'}</td>
                      <td className="py-3 text-zinc-300">
                        <div className="flex items-center gap-2">
                          <button
                            className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-zinc-200 transition hover:border-red-500/40 hover:text-red-300"
                            onClick={() => handleEditMovie(movie)}
                          >
                            Edit
                          </button>
                          <button
                            className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-zinc-200 transition hover:border-red-500/40 hover:text-red-300"
                            onClick={() => handleDeleteMovie(movie._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </div>
      </section>
    </main>
  )
}
