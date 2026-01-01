import { useContext } from 'react'
import { AuthContext } from './AuthProvider'
import type { AuthContextValue } from './auth.types'

/**
 * Auth 상태 및 액션에 접근하는 훅
 * AuthProvider 내부에서만 사용 가능
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
