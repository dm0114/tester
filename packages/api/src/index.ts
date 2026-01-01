/**
 * @portfolio/api - Supabase 클라이언트 + TanStack Query hooks
 *
 * ## Domain-Driven 구조 (권장)
 * ```ts
 * import { usePayrolls, payrollService } from '@portfolio/api/domains/payroll'
 * ```
 *
 * ## 기존 구조 (호환성 유지)
 * ```ts
 * import { usePayrolls, supabase } from '@portfolio/api'
 * ```
 */

// ============================================================================
// Shared (공통)
// ============================================================================
export {
  supabase,
  getSupabaseClient,
  createSupabaseClient,
  type SupabaseClient,
} from './shared/client'

export { ApiError, ensureApiError, type ApiErrorCode } from './shared/errors'

// ============================================================================
// Auth
// ============================================================================
export {
  AuthProvider,
  useAuth,
  type AuthState,
  type AuthContextValue,
  type SignInCredentials,
  type SignUpCredentials,
  type User,
  type Session,
} from './auth'

// ============================================================================
// Domains (모두 마이그레이션 완료)
// ============================================================================

// Payroll Domain
export {
  payrollKeys,
  payrollRepository,
  payrollService,
  calculatePayroll,
  getHourlyRate,
  getOvertimeRate,
  usePayrolls,
  usePayroll,
  useCreatePayroll,
  useUpdatePayrollStatus,
  useApprovePayroll,
  useMarkPayrollPaid,
} from './domains/payroll'

// Employee Domain
export {
  employeeKeys,
  employeeRepository,
  useEmployees,
  useEmployee,
} from './domains/employee'

// Leave Domain
export {
  leaveKeys,
  leaveRepository,
  leaveService,
  calculateLeaveDays,
  useLeaves,
  useLeaveBalance,
  useCreateLeave,
  useProcessLeave,
  useCancelLeave,
} from './domains/leave'

// ============================================================================
// Legacy Services (deprecated - 새로운 service 사용 권장)
// ============================================================================
export { PayrollCalculator } from './services/payroll.calculator'
