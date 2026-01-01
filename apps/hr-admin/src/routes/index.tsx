import { createFileRoute } from '@tanstack/react-router'
import { Card } from '@portfolio/ui'

export const Route = createFileRoute('/')({
  component: Dashboard,
})

function Dashboard() {
  const stats = [
    { label: '전체 직원', value: 0, change: '+0%' },
    { label: '이번 달 급여 지급', value: '₩0', change: '-' },
    { label: '대기 중 휴가 신청', value: 0, change: '-' },
    { label: '이번 달 신규 입사', value: 0, change: '-' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            <p className="text-sm text-gray-400 mt-1">{stat.change}</p>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            최근 급여 처리
          </h2>
          <p className="text-gray-500">데이터가 없습니다.</p>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            대기 중인 휴가 신청
          </h2>
          <p className="text-gray-500">데이터가 없습니다.</p>
        </Card>
      </div>
    </div>
  )
}
