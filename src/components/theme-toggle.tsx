import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/components/theme-provider'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  function toggleTheme() {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="bg-accent p-1.5 rounded-sm"
    >
      {theme === 'dark' ? <Moon className="size-5"/> : <Sun className="size-5"/>}
    </button>
  )
}
