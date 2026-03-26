import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { db } from '../firebase'
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore'

export function Recipes() {
  const { user } = useAuth()
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showNewForm, setShowNewForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    miniature: ''
  })
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user?.uid) return

    const fetchRecipes = async () => {
      try {
        setError(null)
        const q = query(
          collection(db, `users/${user.uid}/recipes`),
          orderBy('createdAt', 'desc')
        )
        const snapshot = await getDocs(q)
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
        setRecipes(list)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchRecipes()
  }, [user?.uid])

  const createRecipe = async (e) => {
    e.preventDefault()
    if (!formData.name.trim() || !user?.uid) return

    try {
      setError(null)
      await addDoc(collection(db, `users/${user.uid}/recipes`), {
        name: formData.name.trim(),
        miniature: formData.miniature.trim(),
        steps: [],
        createdAt: new Date().toISOString()
      })
      setFormData({ name: '', miniature: '' })
      setShowNewForm(false)

      // Refresh list
      const q = query(
        collection(db, `users/${user.uid}/recipes`),
        orderBy('createdAt', 'desc')
      )
      const snapshot = await getDocs(q)
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))
      setRecipes(list)
    } catch (err) {
      setError(err.message)
    }
  }

  const deleteRecipe = async (recipeId) => {
    if (!window.confirm('Delete this recipe? This cannot be undone.')) return

    try {
      setError(null)
      await deleteDoc(doc(db, `users/${user.uid}/recipes`, recipeId))
      setRecipes((prev) => prev.filter((r) => r.id !== recipeId))
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-slate-600">Loading recipes...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
              Painting Recipes
            </h1>
            <p className="text-slate-600">
              Create step-by-step painting guides for your miniatures
            </p>
          </div>
          <button
            onClick={() => setShowNewForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            + New Recipe
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
              Create New Recipe
            </h2>
            <form onSubmit={createRecipe} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Recipe Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. 'Ork Skin & Armour'"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full border border-slate-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Miniature / Model (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 'Boyz Mob', 'Stormcast Eternals'"
                  value={formData.miniature}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      miniature: e.target.value
                    }))
                  }
                  className="w-full border border-slate-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={!formData.name.trim()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium py-2 rounded transition"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewForm(false)
                    setFormData({ name: '', miniature: '' })
                  }}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-2 rounded transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {recipes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-slate-600 text-lg mb-4">
              No recipes yet. Create one to get started!
            </p>
            <button
              onClick={() => setShowNewForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition"
            >
              Create Recipe
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <Link to={`/recipe/${recipe.id}`} className="block p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {recipe.name}
                  </h3>
                  {recipe.miniature && (
                    <p className="text-slate-600 mb-3">{recipe.miniature}</p>
                  )}
                  <p className="text-sm text-slate-600">
                    {(recipe.steps || []).length} step{(recipe.steps || []).length !== 1 ? 's' : ''}
                  </p>
                </Link>
                <div className="border-t border-slate-200 p-4">
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      deleteRecipe(recipe.id)
                    }}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
