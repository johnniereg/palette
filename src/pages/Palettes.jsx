import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { db } from '../firebase'
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore'
import { paints } from '../data/paints'

export function Palettes() {
  const { user } = useAuth()
  const [palettes, setPalettes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showNewForm, setShowNewForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user?.uid) return

    const fetchPalettes = async () => {
      try {
        setError(null)
        const q = query(
          collection(db, `users/${user.uid}/palettes`),
          orderBy('createdAt', 'desc')
        )
        const snapshot = await getDocs(q)
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
        setPalettes(list)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPalettes()
  }, [user?.uid])

  const createPalette = async (e) => {
    e.preventDefault()
    if (!newName.trim() || !user?.uid) return

    try {
      setError(null)
      await addDoc(collection(db, `users/${user.uid}/palettes`), {
        name: newName.trim(),
        paintIds: [],
        createdAt: new Date().toISOString()
      })
      setNewName('')
      setShowNewForm(false)

      // Refresh list
      const q = query(
        collection(db, `users/${user.uid}/palettes`),
        orderBy('createdAt', 'desc')
      )
      const snapshot = await getDocs(q)
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))
      setPalettes(list)
    } catch (err) {
      setError(err.message)
    }
  }

  const deletePalette = async (paletteId) => {
    if (!window.confirm('Delete this palette? This cannot be undone.')) return

    try {
      setError(null)
      await deleteDoc(doc(db, `users/${user.uid}/palettes`, paletteId))
      setPalettes((prev) => prev.filter((p) => p.id !== paletteId))
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-slate-600">Loading palettes...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
              Palettes
            </h1>
            <p className="text-slate-600">
              Create colour palettes for your projects
            </p>
          </div>
          <button
            onClick={() => setShowNewForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            + New Palette
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {showNewForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Create New Palette
            </h2>
            <form onSubmit={createPalette} className="space-y-4">
              <input
                type="text"
                placeholder="Palette name (e.g. 'Ork Skin', 'Rusted Metal')"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full border border-slate-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={!newName.trim()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium py-2 rounded transition"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewForm(false)
                    setNewName('')
                  }}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-2 rounded transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {palettes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-slate-600 text-lg mb-4">
              No palettes yet. Create one to get started!
            </p>
            <button
              onClick={() => setShowNewForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition"
            >
              Create Palette
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {palettes.map((palette) => {
              const paintList = (palette.paintIds || [])
                .map((id) => paints.find((p) => p.id === id))
                .filter(Boolean)
              const ownedCount = paintList.length

              return (
                <Link
                  key={palette.id}
                  to={`/palette/${palette.id}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <div className="h-32 bg-gradient-to-br from-blue-400 to-purple-500 p-4 text-white flex flex-col justify-between">
                    <h3 className="text-xl font-bold">{palette.name}</h3>
                    <p className="text-sm opacity-90">
                      {ownedCount} paint{ownedCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="p-4">
                    <div className="flex gap-2 mb-3 flex-wrap">
                      {paintList.slice(0, 4).map((paint) => (
                        <div
                          key={paint.id}
                          className="w-8 h-8 rounded border-2 border-slate-300"
                          style={{ backgroundColor: paint.hex }}
                          title={paint.name}
                        />
                      ))}
                      {paintList.length > 4 && (
                        <div className="text-sm text-slate-600">
                          +{paintList.length - 4} more
                        </div>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        deletePalette(palette.id)
                      }}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
