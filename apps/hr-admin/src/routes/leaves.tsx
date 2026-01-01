import { createFileRoute } from '@tanstack/react-router'
import { Card, Button } from '@portfolio/ui'

export const Route = createFileRoute('/leaves')({
  component: LeaveManagement,
})

function LeaveManagement() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">휴가 관리</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button className="px-4 py-2 text-blue-600 border-b-2 border-blue-600 font-medium">
          대기 중
        </button>
        <button className="px-4 py-2 text-gray-500 hover:text-gray-700">
          승인됨
        </button>
        <button className="px-4 py-2 text-gray-500 hover:text-gray-700">
          반려됨
        </button>
        <button className="px-4 py-2 text-gray-500 hover:text-gray-700">
          전체
        </button>
      </div>

      {/* Leave Requests */}
      <Card className="overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                신청자
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                휴가 유형
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                기간
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                일수
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                사유
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
                휴가 신청이 없습니다.
              </td>
            </tr>
          </tbody>
        </table>
      </Card>
    </div>
  )
}
