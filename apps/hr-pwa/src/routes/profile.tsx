import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth } from '@portfolio/api'
import { Card, Button } from '@portfolio/ui'

export const Route = createFileRoute('/profile')({
  component: Profile,
})

function Profile() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    navigate({ to: '/login' })
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold text-gray-900 pt-2">내 정보</h1>

      {/* Profile Card */}
      <Card className="p-6 text-center">
        <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl font-bold text-blue-600">
            {user?.email?.charAt(0).toUpperCase() ?? '?'}
          </span>
        </div>
        <h2 className="text-xl font-bold text-gray-900">
          {user?.user_metadata?.name ?? '사용자'}
        </h2>
        <p className="text-gray-500">{user?.email}</p>
      </Card>

      {/* Info */}
      <Card className="p-4 space-y-4">
        <div>
          <p className="text-sm text-gray-500">이메일</p>
          <p className="text-gray-900">{user?.email ?? '-'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">가입일</p>
          <p className="text-gray-900">
            {user?.created_at
              ? new Date(user.created_at).toLocaleDateString('ko-KR')
              : '-'}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">사용자 ID</p>
          <p className="text-gray-900 text-xs font-mono truncate">
            {user?.id ?? '-'}
          </p>
        </div>
      </Card>

      {/* Actions */}
      <div className="space-y-2">
        <Button variant="outline" className="w-full">
          비밀번호 변경
        </Button>
        <Button
          variant="destructive"
          className="w-full"
          onClick={handleSignOut}
        >
          로그아웃
        </Button>
      </div>
    </div>
  )
}
