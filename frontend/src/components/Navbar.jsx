import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

function Navbar() {
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isActive = (path) => {
    return location.pathname === path
  }

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLinkClick = () => {
    setIsMenuOpen(false)
  }

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location])

  return (
    <nav className="bg-white dark:bg-slate-800 shadow-md sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4">
        <Link to="/" className="flex items-center gap-3 py-4 font-bold text-xl text-slate-800 dark:text-white hover:text-green-600 dark:hover:text-green-400 transition-colors">
          <span className="text-2xl">🌱</span>
          Campus Resource Monitor
        </Link>
        
        <div className="flex items-center gap-4 md:hidden absolute right-4 top-4">
          <button 
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-2xl"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          
          <button 
            className={`flex flex-col justify-center items-center w-10 h-10 relative transition-all ${isMenuOpen ? 'gap-0' : 'gap-1.5'}`}
            onClick={handleMenuToggle}
            aria-label="Toggle menu"
          >
            <span className={`block h-0.5 w-6 bg-slate-800 dark:bg-white transition-all ${isMenuOpen ? 'rotate-45 translate-y-0.5' : ''}`}></span>
            <span className={`block h-0.5 w-6 bg-slate-800 dark:bg-white transition-all ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`block h-0.5 w-6 bg-slate-800 dark:bg-white transition-all ${isMenuOpen ? '-rotate-45 -translate-y-0.5' : ''}`}></span>
          </button>
        </div>

        <ul className={`flex-col md:flex-row md:flex gap-2 pb-4 md:pb-0 ${isMenuOpen ? 'flex' : 'hidden md:flex'}`}>
          <li>
            <Link 
              to="/" 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isActive('/') 
                  ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 font-semibold' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
              onClick={handleLinkClick}
            >
              <span className="text-xl">📊</span>
              Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="/electricity" 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isActive('/electricity')
                  ? 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 font-semibold' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
              onClick={handleLinkClick}
            >
              <span className="text-xl">⚡</span>
              Electricity
            </Link>
          </li>
          <li>
            <Link 
              to="/water" 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isActive('/water')
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
              onClick={handleLinkClick}
            >
              <span className="text-xl">💧</span>
              Water
            </Link>
          </li>
          <li>
            <Link 
              to="/food-waste" 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isActive('/food-waste')
                  ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 font-semibold' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
              onClick={handleLinkClick}
            >
              <span className="text-xl">🍽️</span>
              Food Waste
            </Link>
          </li>
          <li className="hidden md:block ml-auto">
            <button 
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-2xl"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
