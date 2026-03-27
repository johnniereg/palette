import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function NavBar() {
  const { user, logout } = useAuth()
  const location = useLocation()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  const navLinks = [
    { to: '/my-paints', label: 'My Paints' },
    { to: '/browse',    label: 'Browse'    },
    { to: '/palettes',  label: 'Palettes'  },
    { to: '/recipes',   label: 'Recipes'   },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-slate-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex justify-between items-center">
          <Link to="/my-paints" className="font-bold text-lg sm:text-xl tracking-tight">
            🎨 Palette
          </Link>

          {user && (
            <div className="flex items-center gap-4">
              {/* Desktop nav */}
              <div className="hidden sm:flex gap-1">
                {navLinks.map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-3 py-1.5 rounded text-sm font-medium transition ${
                      isActive(link.to)
                        ? 'bg-slate-700 text-white'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Mobile nav */}
              <div className="sm:hidden flex gap-1 text-xs">
                {navLinks.map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-2 py-1 rounded transition ${
                      isActive(link.to)
                        ? 'bg-slate-700 text-white font-medium'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
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
