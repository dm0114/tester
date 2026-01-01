import { createRootRouteWithContext, Outlet, Link } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import type { QueryClient } from '@tanstack/react-query'

interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
})

function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold">
            Freight Calculator
          </Link>
          <a
            href="https://portfolio-landing.vercel.app"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Portfolio
          </a>
        </nav>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t py-6 text-center text-muted-foreground">
        <p>&copy; 2025 Freight Calculator. Part of Portfolio.</p>
      </footer>

      <TanStackRouterDevtools />
    </div>
  )
}
