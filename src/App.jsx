import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { NavBar } from './components/NavBar'
import { Login } from './pages/Login'
import { Collection } from './pages/Collection'
import { Palettes } from './pages/Palettes'
import { PaletteDetail } from './pages/PaletteDetail'
import { Recipes } from './pages/Recipes'
import { RecipeDetail } from './pages/RecipeDetail'

function ProtectedRoute({ element }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-slate-600">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  return element
}

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <p className="text-lg text-slate-600">Loading...</p>
      </div>
    )
  }

  return (
    <Router basename="/palette">
      {user && <NavBar />}
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/collection" replace /> : <Login />}
        />
        <Route
          path="/collection"
          element={<ProtectedRoute element={<Collection />} />}
        />
        <Route
          path="/palettes"
          element={<ProtectedRoute element={<Palettes />} />}
        />
        <Route
          path="/palette/:paletteId"
          element={<ProtectedRoute element={<PaletteDetail />} />}
        />
        <Route
          path="/recipes"
          element={<ProtectedRoute element={<Recipes />} />}
        />
        <Route
          path="/recipe/:recipeId"
          element={<ProtectedRoute element={<RecipeDetail />} />}
        />
      </Routes>
    </Router>
  )
}

export default App
