import { createFileRoute } from '@tanstack/react-router'
import { Card } from '@portfolio/ui'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="pt-2">
        <p className="text-gray-500 text-sm">안녕하세요</p>
        <h1 className="text-2xl font-bold text-gray-900">홍길동님</h1>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-blue-50 border-blue-100">
          <p className="text-sm text-blue-600">이번 달 급여</p>
          <p className="text-xl font-bold text-blue-900 mt-1">₩0</p>
        </Card>
        <Card className="p-4 bg-green-50 border-green-100">
          <p className="text-sm text-green-600">남은 연차</p>
          <p className="text-xl font-bold text-green-900 mt-1">0일</p>
        </Card>
      </div>

      {/* Recent Payslips */}
      <Card className="p-4">
        <h2 className="font-semibold text-gray-900 mb-3">최근 급여명세서</h2>
        <p className="text-gray-500 text-sm">급여명세서가 없습니다.</p>
      </Card>

      {/* Pending Leaves */}
      <Card className="p-4">
        <h2 className="font-semibold text-gray-900 mb-3">휴가 신청 현황</h2>
        <p className="text-gray-500 text-sm">신청 중인 휴가가 없습니다.</p>
      </Card>
    </div>
  )
}
