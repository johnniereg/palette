import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function Login() {
  const navigate = useNavigate()
  const { user, loading, signInWithGoogle, error } = useAuth()

  useEffect(() => {
    if (user && !loading) {
      navigate('/collection')
    }
  }, [user, loading, navigate])

  const handleSignIn = async () => {
    try {
      await signInWithGoogle()
    } catch (err) {
      console.error('Sign in failed:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-white text-center">
          <div className="text-4xl mb-4">🎨</div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 px-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎨</div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Palette</h1>
          <p className="text-slate-600">Warhammer Paint Tracker</p>
        </div>

        <p className="text-center text-slate-700 mb-8">
          Track your Warhammer miniature paints, create colour palettes, and organize painting recipes.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p className="text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={handleSignIn}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-3 text-lg"
        >
          <span>🔑</span>
          Sign in with Google
        </button>

        <p className="text-xs text-slate-500 text-center mt-6">
          Your paint collection is saved securely in the cloud.
        </p>
      </div>
    </div>
  )
}
