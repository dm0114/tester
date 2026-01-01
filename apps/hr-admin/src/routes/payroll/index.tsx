import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, Button } from '@portfolio/ui'

export const Route = createFileRoute('/payroll/')({
  component: PayrollList,
})

function PayrollList() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">급여 관리</h1>
        <Link to="/payroll/calculate">
          <Button>급여 계산</Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex gap-4">
          <select className="rounded-md border border-gray-300 px-3 py-2">
            <option value="">전체 상태</option>
            <option value="DRAFT">초안</option>
            <option value="CALCULATED">계산완료</option>
            <option value="APPROVED">승인</option>
            <option value="PAID">지급완료</option>
          </select>
          <input
            type="month"
            className="rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
      </Card>

      {/* Payroll Table */}
      <Card className="overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                직원
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                지급 기간
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                기본급
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                공제
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                실지급액
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                상태
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                액션
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                급여 데이터가 없습니다.
              </td>
            </tr>
          </tbody>
        </table>
      </Card>
    </div>
  )
}
