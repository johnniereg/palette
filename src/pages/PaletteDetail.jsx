import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useCollection } from '../hooks/useCollection'
import { db } from '../firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { paints } from '../data/paints'
import { PaintCard } from '../components/PaintCard'

export function PaletteDetail() {
  const { paletteId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { ownedPaints, toggleOwned, updateNotes } = useCollection(user?.uid)

  const [palette, setPalette] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    if (!user?.uid || !paletteId) return

    const fetchPalette = async () => {
      try {
        setError(null)
        const docRef = doc(db, `users/${user.uid}/palettes`, paletteId)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setPalette({
            id: docSnap.id,
            ...docSnap.data()
          })
        } else {
          setError('Palette not found')
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPalette()
  }, [user?.uid, paletteId])

  const addPaintToPalette = async (paintId) => {
    if (!palette || !user?.uid) return

    try {
      setError(null)
      const docRef = doc(db, `users/${user.uid}/palettes`, paletteId)
      const updatedIds = [...(palette.paintIds || []), paintId]
      await updateDoc(docRef, { paintIds: updatedIds })
      setPalette((prev) => ({
        ...prev,
        paintIds: updatedIds
      }))
      setShowAddForm(false)
      setSearchTerm('')
    } catch (err) {
      setError(err.message)
    }
  }

  const removePaintFromPalette = async (paintId) => {
    if (!palette || !user?.uid) return

    try {
      setError(null)
      const docRef = doc(db, `users/${user.uid}/palettes`, paletteId)
      const updatedIds = (palette.paintIds || []).filter((id) => id !== paintId)
      await updateDoc(docRef, { paintIds: updatedIds })
      setPalette((prev) => ({
        ...prev,
        paintIds: updatedIds
      }))
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-slate-600">Loading palette...</p>
      </div>
    )
  }

  if (!palette) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">
            {error || 'Palette not found'}
          </p>
          <button
            onClick={() => navigate('/palettes')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Back to Palettes
          </button>
        </div>
      </div>
    )
  }

  const paletteList = (palette.paintIds || [])
    .map((id) => paints.find((p) => p.id === id))
    .filter(Boolean)

  const availablePaints = paints.filter(
    (p) =>
      !palette.paintIds?.includes(p.id) &&
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const unownedCount = paletteList.filter((p) => !ownedPaints[p.id]).length
  const ownedCount = paletteList.length - unownedCount

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
        <button
          onClick={() => navigate('/palettes')}
          className="text-blue-600 hover:text-blue-700 font-medium mb-6"
        >
          ← Back to Palettes
        </button>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
            {palette.name}
          </h1>
          <p className="text-slate-600">
            {ownedCount} owned · {unownedCount} to buy
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Add Paint Form */}
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition mb-6"
          >
            + Add Paint
          </button>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Add Paint to Palette
            </h2>
            <input
              type="text"
              placeholder="Search paints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-slate-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            {availablePaints.length === 0 ? (
              <p className="text-slate-600">
                No available paints. All paints are in this palette or match no search.
              </p>
            ) : (
              <div className="max-h-64 overflow-y-auto space-y-2">
                {availablePaints.map((paint) => (
                  <button
                    key={paint.id}
                    onClick={() => addPaintToPalette(paint.id)}
                    className="w-full text-left p-3 border border-slate-300 rounded hover:bg-blue-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-6 h-6 rounded border border-slate-300"
                        style={{ backgroundColor: paint.hex }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 break-words">
                          {paint.name}
                        </p>
                        <p className="text-sm text-slate-600">{paint.brand}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setShowAddForm(false)
                  setSearchTerm('')
                }}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-2 rounded transition"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* Palette Paints */}
        {paletteList.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-slate-600 text-lg mb-4">
              No paints in this palette yet. Add some to get started!
            </p>
          </div>
        ) : (
          <>
            {/* Shopping List */}
            {unownedCount > 0 && (
              <div className="bg-orange-50 border border-orange-300 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-bold text-orange-900 mb-4">
                  Shopping List ({unownedCount} paints)
                </h2>
                <div className="space-y-3">
                  {paletteList
                    .filter((p) => !ownedPaints[p.id])
                    .map((paint) => (
                      <div
                        key={paint.id}
                        className="flex items-start gap-3 bg-white p-3 rounded border border-orange-200"
                      >
                        <div
                          className="w-8 h-8 rounded border border-slate-300 flex-shrink-0"
                          style={{ backgroundColor: paint.hex }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 break-words">
                            {paint.name}
                          </p>
                          <p className="text-sm text-slate-600">{paint.brand}</p>
                          <p className="text-sm text-slate-700 mt-1">
                            {paint.description}
                          </p>
                        </div>
                        <button
                          onClick={() => toggleOwned(paint.id)}
                          className="text-green-600 hover:text-green-700 font-medium text-sm flex-shrink-0"
                        >
                          Mark owned
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Owned Paints */}
            {ownedCount > 0 && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  Owned Paints ({ownedCount})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paletteList
                    .filter((p) => ownedPaints[p.id])
                    .map((paint) => (
                      <div
                        key={paint.id}
                        className="relative bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500"
                      >
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-slate-900 break-words">
                              {paint.name}
                            </h3>
                            <p className="text-sm text-slate-600">{paint.brand}</p>
                          </div>
                          <button
                            onClick={() => removePaintFromPalette(paint.id)}
                            className="text-red-600 hover:text-red-700 font-bold flex-shrink-0"
                          >
                            ✕
                          </button>
                        </div>
                        <div
                          className="h-6 w-full rounded mb-2 border border-slate-300"
                          style={{ backgroundColor: paint.hex }}
                        />
                        <p className="text-sm text-slate-800">
                          {paint.description}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
