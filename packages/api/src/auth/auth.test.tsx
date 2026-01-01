/**
 * Auth Module Tests
 *
 * @vitest-environment happy-dom
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { AuthProvider } from './AuthProvider'
import { useAuth } from './useAuth'
import { ApiError } from '../shared/errors'

// Mock Supabase client
const mockSignInWithPassword = vi.fn()
const mockSignUp = vi.fn()
const mockSignOut = vi.fn()
const mockResetPasswordForEmail = vi.fn()
const mockGetSession = vi.fn()
const mockOnAuthStateChange = vi.fn()
const mockUnsubscribe = vi.fn()

vi.mock('../shared/client/supabase', () => ({
  getSupabaseClient: () => ({
    auth: {
      signInWithPassword: mockSignInWithPassword,
      signUp: mockSignUp,
      signOut: mockSignOut,
      resetPasswordForEmail: mockResetPasswordForEmail,
      getSession: mockGetSession,
      onAuthStateChange: mockOnAuthStateChange,
    },
  }),
}))

// Test wrapper
function createWrapper() {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <AuthProvider>{children}</AuthProvider>
  }
}

// Mock user/session data
const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
  user_metadata: { name: '테스트 유저' },
}

const mockSession = {
  access_token: 'mock-token',
  refresh_token: 'mock-refresh',
  user: mockUser,
}

describe('Auth Module', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Default: 로그아웃 상태
    mockGetSession.mockResolvedValue({ data: { session: null } })
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: mockUnsubscribe } },
    })
  })

  describe('useAuth', () => {
    it('AuthProvider 없이 사용하면 에러를 던진다', () => {
      expect(() => {
        renderHook(() => useAuth())
      }).toThrow('useAuth must be used within an AuthProvider')
    })

    it('AuthProvider 내에서 정상 동작한다', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.user).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
    })
  })

  describe('AuthProvider - 초기화', () => {
    it('마운트 시 현재 세션을 가져온다', async () => {
      mockGetSession.mockResolvedValue({ data: { session: mockSession } })

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(mockGetSession).toHaveBeenCalled()
      expect(result.current.user?.id).toBe('user-123')
      expect(result.current.isAuthenticated).toBe(true)
    })

    it('Auth 상태 변경을 구독한다', async () => {
      renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(mockOnAuthStateChange).toHaveBeenCalled()
      })
    })

    it('언마운트 시 구독을 해제한다', async () => {
      const { unmount } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(mockOnAuthStateChange).toHaveBeenCalled()
      })

      unmount()

      expect(mockUnsubscribe).toHaveBeenCalled()
    })
  })

  describe('signIn', () => {
    it('로그인 성공', async () => {
      mockSignInWithPassword.mockResolvedValue({ error: null })

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // 성공 시 에러 없이 완료되어야 함
      await expect(result.current.signIn({
        email: 'test@example.com',
        password: 'password123',
      })).resolves.toBeUndefined()

      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })

    it('로그인 실패 시 ApiError를 던진다', async () => {
      mockSignInWithPassword.mockResolvedValue({
        error: { message: 'Invalid credentials', code: 'invalid_credentials' },
      })

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await expect(
        act(async () => {
          await result.current.signIn({
            email: 'test@example.com',
            password: 'wrong',
          })
        }),
      ).rejects.toThrow(ApiError)
    })

    it('invalid_credentials 에러 코드가 매핑된다', async () => {
      mockSignInWithPassword.mockResolvedValue({
        error: { message: 'Invalid login credentials', code: 'invalid_credentials' },
      })

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      try {
        await act(async () => {
          await result.current.signIn({
            email: 'test@example.com',
            password: 'wrong',
          })
        })
        expect.fail('Should throw')
      } catch (e) {
        expect(e).toBeInstanceOf(ApiError)
        expect((e as ApiError).code).toBe('AUTH_INVALID_CREDENTIALS')
      }
    })
  })

  describe('signUp', () => {
    it('회원가입 성공', async () => {
      mockSignUp.mockResolvedValue({ error: null })

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await expect(result.current.signUp({
        email: 'new@example.com',
        password: 'password123',
        name: '새 유저',
      })).resolves.toBeUndefined()

      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'new@example.com',
        password: 'password123',
        options: { data: { name: '새 유저' } },
      })
    })

    it('회원가입 실패 시 ApiError를 던진다', async () => {
      mockSignUp.mockResolvedValue({
        error: { message: 'User already registered' },
      })

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      try {
        await act(async () => {
          await result.current.signUp({
            email: 'existing@example.com',
            password: 'password123',
          })
        })
        expect.fail('Should throw')
      } catch (e) {
        expect(e).toBeInstanceOf(ApiError)
        expect((e as ApiError).code).toBe('AUTH_SIGN_UP_FAILED')
      }
    })
  })

  describe('signOut', () => {
    it('로그아웃 성공', async () => {
      mockGetSession.mockResolvedValue({ data: { session: mockSession } })
      mockSignOut.mockResolvedValue({ error: null })

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true)
      })

      await expect(result.current.signOut()).resolves.toBeUndefined()

      expect(mockSignOut).toHaveBeenCalled()
    })

    it('로그아웃 실패 시 ApiError를 던진다', async () => {
      mockSignOut.mockResolvedValue({
        error: { message: 'Logout failed' },
      })

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      try {
        await act(async () => {
          await result.current.signOut()
        })
        expect.fail('Should throw')
      } catch (e) {
        expect(e).toBeInstanceOf(ApiError)
        expect((e as ApiError).code).toBe('AUTH_SIGN_OUT_FAILED')
      }
    })
  })

  describe('resetPassword', () => {
    it('비밀번호 재설정 이메일 발송 성공', async () => {
      mockResetPasswordForEmail.mockResolvedValue({ error: null })

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await expect(result.current.resetPassword('test@example.com')).resolves.toBeUndefined()

      expect(mockResetPasswordForEmail).toHaveBeenCalledWith('test@example.com')
    })

    it('비밀번호 재설정 실패 시 ApiError를 던진다', async () => {
      mockResetPasswordForEmail.mockResolvedValue({
        error: { message: 'Rate limit exceeded' },
      })

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      try {
        await act(async () => {
          await result.current.resetPassword('test@example.com')
        })
        expect.fail('Should throw')
      } catch (e) {
        expect(e).toBeInstanceOf(ApiError)
        expect((e as ApiError).code).toBe('AUTH_PASSWORD_RESET_FAILED')
      }
    })
  })

  describe('Auth 상태 변경 구독', () => {
    it('SIGNED_IN 이벤트 시 상태가 업데이트된다', async () => {
      let authChangeCallback: (event: string, session: unknown) => void

      mockOnAuthStateChange.mockImplementation((callback) => {
        authChangeCallback = callback
        return { data: { subscription: { unsubscribe: mockUnsubscribe } } }
      })

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.isAuthenticated).toBe(false)

      // 로그인 이벤트 시뮬레이션
      act(() => {
        authChangeCallback('SIGNED_IN', mockSession)
      })

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true)
        expect(result.current.user?.id).toBe('user-123')
      })
    })

    it('SIGNED_OUT 이벤트 시 상태가 초기화된다', async () => {
      mockGetSession.mockResolvedValue({ data: { session: mockSession } })

      let authChangeCallback: (event: string, session: unknown) => void

      mockOnAuthStateChange.mockImplementation((callback) => {
        authChangeCallback = callback
        return { data: { subscription: { unsubscribe: mockUnsubscribe } } }
      })

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true)
      })

      // 로그아웃 이벤트 시뮬레이션
      act(() => {
        authChangeCallback('SIGNED_OUT', null)
      })

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false)
        expect(result.current.user).toBeNull()
      })
    })
  })
})
