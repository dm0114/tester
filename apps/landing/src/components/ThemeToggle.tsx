import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </button>
  )
}
