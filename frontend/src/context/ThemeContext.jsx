import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Get theme from localStorage or default to 'light'
    const savedTheme = localStorage.getItem('theme')
    console.log('Initial theme from localStorage:', savedTheme)
    return savedTheme || 'light'
  })

  useEffect(() => {
    // Apply theme to document root for Tailwind dark mode
    const root = document.documentElement
    console.log('Theme changed to:', theme)
    console.log('Root element classes before:', root.classList.toString())
    
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    
    console.log('Root element classes after:', root.classList.toString())
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    console.log('Toggle theme called, current theme:', theme)
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light'
      console.log('Switching from', prevTheme, 'to', newTheme)
      return newTheme
    })
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
