import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/payroll')({
  component: PayrollLayout,
})

function PayrollLayout() {
  return <Outlet />
}
