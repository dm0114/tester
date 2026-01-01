import { createRootRouteWithContext, Outlet, Link, useLocation, useNavigate } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { useAuth } from '@portfolio/api'
import type { QueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
})

function RootComponent() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, isLoading, signOut, user } = useAuth()

  const isLoginPage = location.pathname === '/login'

  // 인증되지 않은 상태에서 로그인 페이지가 아니면 리다이렉트
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isLoginPage) {
      navigate({ to: '/login' })
    }
  }, [isLoading, isAuthenticated, isLoginPage, navigate])

  // 인증된 상태에서 로그인 페이지면 대시보드로 리다이렉트
  useEffect(() => {
    if (!isLoading && isAuthenticated && isLoginPage) {
      navigate({ to: '/' })
    }
  }, [isLoading, isAuthenticated, isLoginPage, navigate])

  const handleSignOut = async () => {
    await signOut()
    navigate({ to: '/login' })
  }

  // 로딩 중
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    )
  }

  // 로그인 페이지는 레이아웃 없이 렌더링
  if (isLoginPage) {
    return <Outlet />
  }

  // 인증되지 않은 상태 (리다이렉트 대기)
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="text-xl font-bold text-gray-900">
                HR Admin
              </Link>
              <nav className="hidden md:flex gap-6">
                <Link
                  to="/"
                  className="text-gray-600 hover:text-gray-900 [&.active]:text-blue-600 [&.active]:font-medium"
                >
                  대시보드
                </Link>
                <Link
                  to="/employees"
                  className="text-gray-600 hover:text-gray-900 [&.active]:text-blue-600 [&.active]:font-medium"
                >
                  직원 관리
                </Link>
                <Link
                  to="/payroll"
                  className="text-gray-600 hover:text-gray-900 [&.active]:text-blue-600 [&.active]:font-medium"
                >
                  급여 관리
                </Link>
                <Link
                  to="/leaves"
                  className="text-gray-600 hover:text-gray-900 [&.active]:text-blue-600 [&.active]:font-medium"
                >
                  휴가 관리
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">{user?.email}</span>
              <button
                onClick={handleSignOut}
                className="text-gray-600 hover:text-gray-900"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Dev Tools */}
      {import.meta.env.DEV && <TanStackRouterDevtools position="bottom-right" />}
    </div>
  )
}
