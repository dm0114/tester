-- HR System RLS Policies
-- Created: 2024-12-27

-- ============================================================================
-- Enable RLS on all tables
-- ============================================================================
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE payrolls ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaves ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendances ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Helper function: Get current employee
-- ============================================================================
CREATE OR REPLACE FUNCTION get_current_employee()
RETURNS employees AS $$
  SELECT * FROM employees WHERE user_id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper function: Check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM employees
    WHERE user_id = auth.uid() AND role = 'ADMIN'
  )
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper function: Check if current user is manager
CREATE OR REPLACE FUNCTION is_manager()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM employees
    WHERE user_id = auth.uid() AND role IN ('ADMIN', 'MANAGER')
  )
$$ LANGUAGE sql SECURITY DEFINER;

-- ============================================================================
-- DEPARTMENTS: 모두 조회 가능, 관리자만 수정
-- ============================================================================
CREATE POLICY "Departments are viewable by all authenticated users"
  ON departments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Departments are editable by admins only"
  ON departments FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================================================
-- POSITIONS: 모두 조회 가능, 관리자만 수정
-- ============================================================================
CREATE POLICY "Positions are viewable by all authenticated users"
  ON positions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Positions are editable by admins only"
  ON positions FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================================================
-- EMPLOYEES: 본인 또는 관리자만 조회/수정
-- ============================================================================
CREATE POLICY "Employees can view themselves"
  ON employees FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR is_manager());

CREATE POLICY "Employees can update their own profile"
  ON employees FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all employees"
  ON employees FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================================================
-- PAYROLLS: 본인 급여만 조회, 관리자만 생성/수정
-- ============================================================================
CREATE POLICY "Employees can view their own payrolls"
  ON payrolls FOR SELECT
  TO authenticated
  USING (
    employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
    OR is_manager()
  );

CREATE POLICY "Admins can manage all payrolls"
  ON payrolls FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================================================
-- PAYROLL_ITEMS: 부모 payroll의 권한 따름
-- ============================================================================
CREATE POLICY "Payroll items follow payroll permissions"
  ON payroll_items FOR SELECT
  TO authenticated
  USING (
    payroll_id IN (
      SELECT id FROM payrolls
      WHERE employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
    )
    OR is_manager()
  );

CREATE POLICY "Admins can manage all payroll items"
  ON payroll_items FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================================================
-- LEAVE_TYPES: 모두 조회 가능
-- ============================================================================
CREATE POLICY "Leave types are viewable by all authenticated users"
  ON leave_types FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Leave types are editable by admins only"
  ON leave_types FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================================================
-- LEAVE_BALANCES: 본인만 조회, 관리자는 전체
-- ============================================================================
CREATE POLICY "Employees can view their own leave balances"
  ON leave_balances FOR SELECT
  TO authenticated
  USING (
    employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
    OR is_manager()
  );

CREATE POLICY "Admins can manage all leave balances"
  ON leave_balances FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================================================
-- LEAVES: 본인 신청/조회, 관리자 승인
-- ============================================================================
CREATE POLICY "Employees can view their own leaves"
  ON leaves FOR SELECT
  TO authenticated
  USING (
    employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
    OR is_manager()
  );

CREATE POLICY "Employees can create their own leave requests"
  ON leaves FOR INSERT
  TO authenticated
  WITH CHECK (
    employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
  );

CREATE POLICY "Employees can cancel their pending leaves"
  ON leaves FOR UPDATE
  TO authenticated
  USING (
    employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
    AND status = 'PENDING'
  )
  WITH CHECK (status = 'CANCELLED');

CREATE POLICY "Managers can approve/reject leaves"
  ON leaves FOR UPDATE
  TO authenticated
  USING (is_manager())
  WITH CHECK (is_manager());

-- ============================================================================
-- ATTENDANCES: 본인만 조회/기록, 관리자는 전체
-- ============================================================================
CREATE POLICY "Employees can view their own attendances"
  ON attendances FOR SELECT
  TO authenticated
  USING (
    employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
    OR is_manager()
  );

CREATE POLICY "Employees can log their own attendance"
  ON attendances FOR INSERT
  TO authenticated
  WITH CHECK (
    employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
  );

CREATE POLICY "Employees can update their own attendance"
  ON attendances FOR UPDATE
  TO authenticated
  USING (
    employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
  )
  WITH CHECK (
    employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can manage all attendances"
  ON attendances FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());
