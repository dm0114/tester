/**
 * Leave Domain
 */

// Query Keys
export { leaveKeys } from './leave.keys'

// Repository
export {
  leaveRepository,
  findLeaves,
  findLeaveById,
  findLeaveBalances,
  createLeave,
  updateLeaveStatus,
  deductLeaveBalance,
  restoreLeaveBalance,
  type CreateLeaveInput,
} from './leave.repository'

// Service
export {
  leaveService,
  calculateLeaveDays,
  validateLeaveStatusTransition,
  createLeaveRequest,
  processLeave,
  cancelLeave,
} from './leave.service'

// Hooks
export { useLeaves, useLeaveBalance } from './leave.hooks'
export { useCreateLeave, useProcessLeave, useCancelLeave } from './leave.mutations'
