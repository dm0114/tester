import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, Button, Input, Label } from '@portfolio/ui'

export const Route = createFileRoute('/employees/new')({
  component: NewEmployee,
})

function NewEmployee() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link to="/employees" className="text-gray-500 hover:text-gray-700">
          ← 목록으로
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">직원 등록</h1>
      </div>

      <Card className="p-6">
        <form className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">기본 정보</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">이름 (성)</Label>
                <Input id="firstName" placeholder="홍" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">이름</Label>
                <Input id="lastName" placeholder="길동" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input id="email" type="email" placeholder="hong@company.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">연락처</Label>
              <Input id="phone" placeholder="010-1234-5678" />
            </div>
          </div>

          {/* Employment Info */}
          <div className="space-y-4 pt-4 border-t">
            <h2 className="text-lg font-medium text-gray-900">고용 정보</h2>

            <div className="space-y-2">
              <Label htmlFor="employeeNumber">사번</Label>
              <Input id="employeeNumber" placeholder="EMP-001" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">부서</Label>
                <select
                  id="department"
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="">부서 선택</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">직급</Label>
                <select
                  id="position"
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="">직급 선택</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hireDate">입사일</Label>
              <Input id="hireDate" type="date" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <Link to="/employees">
              <Button variant="outline">취소</Button>
            </Link>
            <Button type="submit">등록</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
