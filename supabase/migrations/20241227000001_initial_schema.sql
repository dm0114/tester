-- HR System Initial Schema
-- Created: 2024-12-27

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- DEPARTMENTS
-- ============================================================================
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20) NOT NULL UNIQUE,
  parent_id UUID REFERENCES departments(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE departments IS '부서';

-- ============================================================================
-- POSITIONS (직급)
-- ============================================================================
CREATE TABLE positions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) NOT NULL,
  level INTEGER NOT NULL DEFAULT 1,
  base_salary NUMERIC(15, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE positions IS '직급';

-- ============================================================================
-- EMPLOYEES
-- ============================================================================
CREATE TYPE employee_status AS ENUM ('ACTIVE', 'INACTIVE', 'ON_LEAVE', 'TERMINATED');
CREATE TYPE user_role AS ENUM ('ADMIN', 'MANAGER', 'EMPLOYEE');

CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  employee_number VARCHAR(20) NOT NULL UNIQUE,
  department_id UUID NOT NULL REFERENCES departments(id),
  position_id UUID NOT NULL REFERENCES positions(id),
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  hire_date DATE NOT NULL,
  status employee_status NOT NULL DEFAULT 'ACTIVE',
  role user_role NOT NULL DEFAULT 'EMPLOYEE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE employees IS '직원';

CREATE INDEX idx_employees_department ON employees(department_id);
CREATE INDEX idx_employees_status ON employees(status);
CREATE INDEX idx_employees_user_id ON employees(user_id);

-- ============================================================================
-- PAYROLLS
-- ============================================================================
CREATE TYPE payroll_status AS ENUM ('DRAFT', 'CALCULATED', 'APPROVED', 'PAID');

CREATE TABLE payrolls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES employees(id),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  base_salary NUMERIC(15, 2) NOT NULL,
  overtime_pay NUMERIC(15, 2) NOT NULL DEFAULT 0,
  bonus NUMERIC(15, 2) NOT NULL DEFAULT 0,
  deductions NUMERIC(15, 2) NOT NULL DEFAULT 0,
  tax NUMERIC(15, 2) NOT NULL DEFAULT 0,
  net_salary NUMERIC(15, 2) NOT NULL,
  status payroll_status NOT NULL DEFAULT 'DRAFT',
  calculated_at TIMESTAMPTZ,
  approved_by UUID REFERENCES employees(id),
  approved_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(employee_id, period_start, period_end)
);

COMMENT ON TABLE payrolls IS '급여';

CREATE INDEX idx_payrolls_employee ON payrolls(employee_id);
CREATE INDEX idx_payrolls_status ON payrolls(status);
CREATE INDEX idx_payrolls_period ON payrolls(period_start, period_end);

-- ============================================================================
-- PAYROLL ITEMS (급여 상세)
-- ============================================================================
CREATE TYPE payroll_item_type AS ENUM ('EARNING', 'DEDUCTION');

CREATE TABLE payroll_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payroll_id UUID NOT NULL REFERENCES payrolls(id) ON DELETE CASCADE,
  item_type payroll_item_type NOT NULL,
  item_name VARCHAR(100) NOT NULL,
  amount NUMERIC(15, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE payroll_items IS '급여 항목 (수당/공제)';

CREATE INDEX idx_payroll_items_payroll ON payroll_items(payroll_id);

-- ============================================================================
-- LEAVE TYPES (휴가 유형)
-- ============================================================================
CREATE TYPE leave_type_code AS ENUM ('ANNUAL', 'SICK', 'PERSONAL', 'MATERNITY', 'PATERNITY', 'UNPAID');

CREATE TABLE leave_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) NOT NULL,
  code leave_type_code NOT NULL UNIQUE,
  default_days INTEGER NOT NULL DEFAULT 0,
  is_paid BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE leave_types IS '휴가 유형';

-- Insert default leave types
INSERT INTO leave_types (name, code, default_days, is_paid) VALUES
  ('연차', 'ANNUAL', 15, TRUE),
  ('병가', 'SICK', 3, TRUE),
  ('개인휴가', 'PERSONAL', 3, FALSE),
  ('출산휴가', 'MATERNITY', 90, TRUE),
  ('육아휴직', 'PATERNITY', 10, TRUE),
  ('무급휴가', 'UNPAID', 0, FALSE);

-- ============================================================================
-- LEAVE BALANCES (휴가 잔여)
-- ============================================================================
CREATE TABLE leave_balances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES employees(id),
  leave_type_id UUID NOT NULL REFERENCES leave_types(id),
  year INTEGER NOT NULL,
  total_days NUMERIC(5, 1) NOT NULL DEFAULT 0,
  used_days NUMERIC(5, 1) NOT NULL DEFAULT 0,
  remaining_days NUMERIC(5, 1) GENERATED ALWAYS AS (total_days - used_days) STORED,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(employee_id, leave_type_id, year)
);

COMMENT ON TABLE leave_balances IS '휴가 잔여';

CREATE INDEX idx_leave_balances_employee ON leave_balances(employee_id);

-- ============================================================================
-- LEAVES (휴가 신청)
-- ============================================================================
CREATE TYPE leave_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');

CREATE TABLE leaves (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES employees(id),
  leave_type_id UUID NOT NULL REFERENCES leave_types(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days NUMERIC(5, 1) NOT NULL,
  reason TEXT,
  status leave_status NOT NULL DEFAULT 'PENDING',
  approved_by UUID REFERENCES employees(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE leaves IS '휴가 신청';

CREATE INDEX idx_leaves_employee ON leaves(employee_id);
CREATE INDEX idx_leaves_status ON leaves(status);
CREATE INDEX idx_leaves_date ON leaves(start_date, end_date);

-- ============================================================================
-- ATTENDANCES (출퇴근)
-- ============================================================================
CREATE TYPE attendance_type AS ENUM ('WORK', 'LATE', 'EARLY_LEAVE', 'ABSENT', 'VACATION', 'SICK_LEAVE');

CREATE TABLE attendances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES employees(id),
  date DATE NOT NULL,
  type attendance_type NOT NULL DEFAULT 'WORK',
  check_in TIMESTAMPTZ,
  check_out TIMESTAMPTZ,
  work_hours NUMERIC(5, 2),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(employee_id, date)
);

COMMENT ON TABLE attendances IS '출퇴근 기록';

CREATE INDEX idx_attendances_employee ON attendances(employee_id);
CREATE INDEX idx_attendances_date ON attendances(date);

-- ============================================================================
-- FUNCTIONS (휴가 잔여 관리)
-- ============================================================================

-- 휴가 잔여 차감
CREATE OR REPLACE FUNCTION deduct_leave_balance(
  p_employee_id UUID,
  p_leave_type_id UUID,
  p_year INTEGER,
  p_days NUMERIC
)
RETURNS VOID AS $$
BEGIN
  UPDATE leave_balances
  SET used_days = used_days + p_days,
      updated_at = NOW()
  WHERE employee_id = p_employee_id
    AND leave_type_id = p_leave_type_id
    AND year = p_year;
END;
$$ LANGUAGE plpgsql;

-- 휴가 잔여 복구
CREATE OR REPLACE FUNCTION restore_leave_balance(
  p_employee_id UUID,
  p_leave_type_id UUID,
  p_year INTEGER,
  p_days NUMERIC
)
RETURNS VOID AS $$
BEGIN
  UPDATE leave_balances
  SET used_days = GREATEST(0, used_days - p_days),
      updated_at = NOW()
  WHERE employee_id = p_employee_id
    AND leave_type_id = p_leave_type_id
    AND year = p_year;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGERS (updated_at 자동 갱신)
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER set_updated_at BEFORE UPDATE ON departments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON positions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON employees
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON payrolls
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON leave_types
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON leave_balances
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON leaves
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON attendances
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
