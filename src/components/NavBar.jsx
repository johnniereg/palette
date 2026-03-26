import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function NavBar() {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  return (
    <nav className="bg-slate-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="font-bold text-lg sm:text-xl">
            🎨 Palette
          </Link>

          {user && (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex gap-4">
                <Link
                  to="/collection"
                  className="hover:text-slate-300 transition text-sm sm:text-base"
                >
                  Collection
                </Link>
                <Link
                  to="/palettes"
                  className="hover:text-slate-300 transition text-sm sm:text-base"
                >
                  Palettes
                </Link>
                <Link
                  to="/recipes"
                  className="hover:text-slate-300 transition text-sm sm:text-base"
                >
                  Recipes
                </Link>
              </div>

              {/* Mobile menu */}
              <div className="sm:hidden flex gap-2 text-xs">
                <Link
                  to="/collection"
                  className="hover:text-slate-300 transition"
                >
                  Collection
                </Link>
                <Link
                  to="/palettes"
                  className="hover:text-slate-300 transition"
                >
                  Palettes
                </Link>
                <Link
                  to="/recipes"
                  className="hover:text-slate-300 transition"
                >
                  Recipes
                </Link>
              </div>

              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded text-sm font-medium transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
