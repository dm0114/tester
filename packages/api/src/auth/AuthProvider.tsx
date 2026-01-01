import {
  createContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import { getSupabaseClient } from '../shared/client/supabase'
import { createAuthError } from '../shared/errors'
import type {
  AuthContextValue,
  AuthState,
  SignInCredentials,
  SignUpCredentials,
  User,
  Session,
} from './auth.types'

export const AuthContext = createContext<AuthContextValue | null>(null)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
  })

  const supabase = getSupabaseClient()

  // 세션 상태 업데이트 헬퍼
  const updateAuthState = useCallback(
    (user: User | null, session: Session | null) => {
      setState({
        user,
        session,
        isLoading: false,
        isAuthenticated: !!session,
      })
    },
    [],
  )

  // 초기 세션 로드 및 Auth 상태 구독
  useEffect(() => {
    // 현재 세션 가져오기
    supabase.auth.getSession().then(({ data: { session } }) => {
      updateAuthState(session?.user ?? null, session)
    })

    // Auth 상태 변경 구독
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      updateAuthState(session?.user ?? null, session)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth, updateAuthState])

  // 로그인
  const signIn = useCallback(
    async ({ email, password }: SignInCredentials) => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw createAuthError('AUTH_SIGN_IN_FAILED', error)
      }
    },
    [supabase.auth],
  )

  // 회원가입
  const signUp = useCallback(
    async ({ email, password, name }: SignUpCredentials) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      })

      if (error) {
        throw createAuthError('AUTH_SIGN_UP_FAILED', error)
      }
    },
    [supabase.auth],
  )

  // 로그아웃
  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      throw createAuthError('AUTH_SIGN_OUT_FAILED', error)
    }
  }, [supabase.auth])

  // 비밀번호 재설정
  const resetPassword = useCallback(
    async (email: string) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email)

      if (error) {
        throw createAuthError('AUTH_PASSWORD_RESET_FAILED', error)
      }
    },
    [supabase.auth],
  )

  const value: AuthContextValue = {
    ...state,
    signIn,
    signUp,
    signOut,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
