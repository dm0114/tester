import { createFileRoute } from '@tanstack/react-router'
import { Card } from '@portfolio/ui'

export const Route = createFileRoute('/payslips')({
  component: Payslips,
})

function Payslips() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold text-gray-900 pt-2">급여명세서</h1>

      {/* Year/Month Filter */}
      <div className="flex gap-2">
        <select className="flex-1 rounded-lg border border-gray-300 px-3 py-2">
          <option>2024년</option>
          <option>2023년</option>
        </select>
      </div>

      {/* Payslip List */}
      <div className="space-y-3">
        <Card className="p-4">
          <p className="text-gray-500 text-center py-8">
            급여명세서가 없습니다.
          </p>
        </Card>
      </div>
    </div>
  )
}
