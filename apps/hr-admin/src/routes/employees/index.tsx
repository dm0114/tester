import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, Button, Input } from '@portfolio/ui'

export const Route = createFileRoute('/employees/')({
  component: EmployeeList,
})

function EmployeeList() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">직원 관리</h1>
        <Link to="/employees/new">
          <Button>직원 등록</Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex gap-4">
          <Input placeholder="이름, 이메일로 검색..." className="max-w-xs" />
          <select className="rounded-md border border-gray-300 px-3 py-2">
            <option value="">전체 상태</option>
            <option value="ACTIVE">재직</option>
            <option value="ON_LEAVE">휴직</option>
            <option value="TERMINATED">퇴사</option>
          </select>
          <select className="rounded-md border border-gray-300 px-3 py-2">
            <option value="">전체 부서</option>
          </select>
        </div>
      </Card>

      {/* Employee Table */}
      <Card className="overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                직원
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                부서
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                직급
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                입사일
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                액션
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                등록된 직원이 없습니다.
              </td>
            </tr>
          </tbody>
        </table>
      </Card>
    </div>
  )
}
