import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { db } from '../firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { paints } from '../data/paints'

export function RecipeDetail() {
  const { recipeId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingStepId, setEditingStepId] = useState(null)
  const [newStep, setNewStep] = useState({ paintId: '', notes: '' })

  useEffect(() => {
    if (!user?.uid || !recipeId) return

    const fetchRecipe = async () => {
      try {
        setError(null)
        const docRef = doc(db, `users/${user.uid}/recipes`, recipeId)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setRecipe({
            id: docSnap.id,
            ...docSnap.data()
          })
        } else {
          setError('Recipe not found')
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchRecipe()
  }, [user?.uid, recipeId])

  const addStep = async () => {
    if (!newStep.paintId || !recipe || !user?.uid) return

    try {
      setError(null)
      const docRef = doc(db, `users/${user.uid}/recipes`, recipeId)
      const updatedSteps = [
        ...(recipe.steps || []),
        {
          id: Date.now().toString(),
          paintId: newStep.paintId,
          notes: newStep.notes
        }
      ]
      await updateDoc(docRef, { steps: updatedSteps })
      setRecipe((prev) => ({
        ...prev,
        steps: updatedSteps
      }))
      setNewStep({ paintId: '', notes: '' })
    } catch (err) {
      setError(err.message)
    }
  }

  const updateStep = async (stepId, updates) => {
    if (!recipe || !user?.uid) return

    try {
      setError(null)
      const docRef = doc(db, `users/${user.uid}/recipes`, recipeId)
      const updatedSteps = (recipe.steps || []).map((s) =>
        s.id === stepId ? { ...s, ...updates } : s
      )
      await updateDoc(docRef, { steps: updatedSteps })
      setRecipe((prev) => ({
        ...prev,
        steps: updatedSteps
      }))
      setEditingStepId(null)
    } catch (err) {
      setError(err.message)
    }
  }

  const deleteStep = async (stepId) => {
    if (!recipe || !user?.uid) return

    try {
      setError(null)
      const docRef = doc(db, `users/${user.uid}/recipes`, recipeId)
      const updatedSteps = (recipe.steps || []).filter((s) => s.id !== stepId)
      await updateDoc(docRef, { steps: updatedSteps })
      setRecipe((prev) => ({
        ...prev,
        steps: updatedSteps
      }))
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-slate-600">Loading recipe...</p>
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">
            {error || 'Recipe not found'}
          </p>
          <button
            onClick={() => navigate('/recipes')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Back to Recipes
          </button>
        </div>
      </div>
    )
  }

  const paintMap = paints.reduce((acc, p) => {
    acc[p.id] = p
    return acc
  }, {})

  const steps = recipe.steps || []

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
        <button
          onClick={() => navigate('/recipes')}
          className="text-blue-600 hover:text-blue-700 font-medium mb-6"
        >
          ← Back to Recipes
        </button>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
            {recipe.name}
          </h1>
          {recipe.miniature && (
            <p className="text-slate-600 text-lg">
              For: {recipe.miniature}
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Painting Steps */}
        {steps.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center mb-6">
            <p className="text-slate-600 text-lg mb-4">
              No steps yet. Add the first step below!
            </p>
          </div>
        ) : (
          <div className="space-y-4 mb-6">
            {steps.map((step, index) => {
              const paint = paintMap[step.paintId]
              const isEditing = editingStepId === step.id

              return (
                <div
                  key={step.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="bg-slate-100 px-4 py-3 border-b border-slate-200">
                    <h3 className="font-bold text-slate-900">
                      Step {index + 1}
                    </h3>
                  </div>
                  <div className="p-4">
                    {isEditing ? (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Paint
                          </label>
                          <select
                            value={step.paintId}
                            onChange={(e) =>
                              updateStep(step.id, { paintId: e.target.value })
                            }
                            className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select Paint</option>
                            {paints.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name} ({p.brand})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Notes
                          </label>
                          <textarea
                            value={step.notes || ''}
                            onChange={(e) =>
                              updateStep(step.id, { notes: e.target.value })
                            }
                            placeholder="e.g., 'Thin 2:1 with medium', 'Apply in recesses'"
                            className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="3"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingStepId(null)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition"
                          >
                            Done
                          </button>
                          <button
                            onClick={() => deleteStep(step.id)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        {paint ? (
                          <div className="flex gap-4 items-start mb-3">
                            <div
                              className="w-16 h-16 rounded border-2 border-slate-300 flex-shrink-0"
                              style={{ backgroundColor: paint.hex }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-slate-900 break-words">
                                {paint.name}
                              </p>
                              <p className="text-sm text-slate-600">
                                {paint.brand} · {paint.type}
                              </p>
                              <p className="text-sm text-slate-700 mt-1">
                                {paint.description}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-red-600 mb-3">
                            Paint not found
                          </p>
                        )}
                        {step.notes && (
                          <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-3">
                            <p className="text-sm font-medium text-blue-900">
                              Notes:
                            </p>
                            <p className="text-sm text-blue-800 whitespace-pre-wrap">
                              {step.notes}
                            </p>
                          </div>
                        )}
                        <button
                          onClick={() => setEditingStepId(step.id)}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Add Step Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Add Step
          </h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Paint
              </label>
              <select
                value={newStep.paintId}
                onChange={(e) =>
                  setNewStep((prev) => ({
                    ...prev,
                    paintId: e.target.value
                  }))
                }
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Paint</option>
                {paints.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.brand})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Notes (optional)
              </label>
              <textarea
                value={newStep.notes}
                onChange={(e) =>
                  setNewStep((prev) => ({
                    ...prev,
                    notes: e.target.value
                  }))
                }
                placeholder="e.g., 'Thin 2:1 with medium', 'Apply over grey primer'"
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>
            <button
              onClick={addStep}
              disabled={!newStep.paintId}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium py-2 rounded transition"
            >
              Add Step
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
