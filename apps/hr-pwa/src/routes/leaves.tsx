import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, Button } from '@portfolio/ui'

export const Route = createFileRoute('/leaves')({
  component: Leaves,
})

function Leaves() {
  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center pt-2">
        <h1 className="text-xl font-bold text-gray-900">휴가</h1>
        <Link to="/leaves/request">
          <Button size="sm">휴가 신청</Button>
        </Link>
      </div>

      {/* Leave Balance */}
      <Card className="p-4">
        <h2 className="font-semibold text-gray-900 mb-3">휴가 잔여</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600">15</p>
            <p className="text-xs text-gray-500">총 연차</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-orange-600">0</p>
            <p className="text-xs text-gray-500">사용</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">15</p>
            <p className="text-xs text-gray-500">잔여</p>
          </div>
        </div>
      </Card>

      {/* Leave History */}
      <Card className="p-4">
        <h2 className="font-semibold text-gray-900 mb-3">신청 내역</h2>
        <p className="text-gray-500 text-center py-4">
          휴가 신청 내역이 없습니다.
        </p>
      </Card>
    </div>
  )
}
