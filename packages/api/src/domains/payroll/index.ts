/**
 * Payroll Domain
 *
 * 급여 관련 모든 기능을 제공합니다.
 *
 * @example
 * ```ts
 * import { usePayrolls, useCreatePayroll, payrollService } from '@portfolio/api/domains/payroll'
 *
 * // React Query hooks
 * const { data } = usePayrolls({ status: 'DRAFT' })
 * const createMutation = useCreatePayroll()
 *
 * // 순수 함수 사용 (테스트, 서버 등)
 * const result = payrollService.calculate(input)
 * ```
 */

// Query Keys
export { payrollKeys } from './payroll.keys'

// Repository (데이터 접근 - 테스트, 서버 사용)
export {
  payrollRepository,
  findPayrolls,
  findPayrollById,
  createPayroll,
  createPayrollItems,
  updatePayrollStatus,
  type CreatePayrollInput,
  type PayrollItemInput,
} from './payroll.repository'

// Service (비즈니스 로직 - 순수 함수)
export {
  payrollService,
  calculatePayroll,
  getHourlyRate,
  getOvertimeRate,
  createPayrollWithCalculation,
  approvePayroll,
  markPayrollPaid,
  validateStatusTransition,
} from './payroll.service'

// React Query Hooks (클라이언트 사용)
export { usePayrolls, usePayroll } from './payroll.hooks'
export {
  useCreatePayroll,
  useUpdatePayrollStatus,
  useApprovePayroll,
  useMarkPayrollPaid,
} from './payroll.mutations'
