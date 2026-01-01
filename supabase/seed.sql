-- ============================================================================
-- HR System Seed Data
-- ============================================================================

-- 1. Auth Users (테스트용)
-- ============================================================================
-- Password: password123 (bcrypt hash)

INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  raw_app_meta_data,
  created_at,
  updated_at,
  role,
  aud,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change,
  email_change_token_current,
  phone_change,
  phone_change_token,
  reauthentication_token,
  is_sso_user,
  is_anonymous
) VALUES
-- Admin User
(
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000000',
  'admin@company.com',
  '$2b$12$jgSLiF5CdB1nZ7ucuzp5H.OLQCs9LfqYxp.2bnVR8vR7q95Ck6Qaq',
  now(),
  '{"name": "관리자"}',
  '{"provider": "email", "providers": ["email"]}',
  now(),
  now(),
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  false,
  false
),
-- Employee User
(
  '22222222-2222-2222-2222-222222222222',
  '00000000-0000-0000-0000-000000000000',
  'employee@company.com',
  '$2b$12$jgSLiF5CdB1nZ7ucuzp5H.OLQCs9LfqYxp.2bnVR8vR7q95Ck6Qaq',
  now(),
  '{"name": "홍길동"}',
  '{"provider": "email", "providers": ["email"]}',
  now(),
  now(),
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  false,
  false
);

-- Auth Identities (필수)
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  created_at,
  updated_at
) VALUES
(
  '11111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  '{"sub": "11111111-1111-1111-1111-111111111111", "email": "admin@company.com"}',
  'email',
  '11111111-1111-1111-1111-111111111111',
  now(),
  now()
),
(
  '22222222-2222-2222-2222-222222222222',
  '22222222-2222-2222-2222-222222222222',
  '{"sub": "22222222-2222-2222-2222-222222222222", "email": "employee@company.com"}',
  'email',
  '22222222-2222-2222-2222-222222222222',
  now(),
  now()
);

-- 2. Departments (부서)
-- ============================================================================
INSERT INTO public.departments (id, name, code) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '경영지원팀', 'MGMT'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '개발팀', 'DEV'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '디자인팀', 'DESIGN'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', '영업팀', 'SALES');

-- 3. Positions (직급)
-- ============================================================================
INSERT INTO public.positions (id, name, level, base_salary) VALUES
('11111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '사원', 1, 3000000),
('22222222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '대리', 2, 4000000),
('33333333-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '과장', 3, 5000000),
('44444444-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '차장', 4, 6500000),
('55555555-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '부장', 5, 8000000);

-- 4. Employees (직원) - first_name, last_name 분리
-- ============================================================================
INSERT INTO public.employees (
  id, user_id, employee_number, first_name, last_name, email, phone,
  department_id, position_id, hire_date, role, status
) VALUES
-- Admin
(
  'eeeeeeee-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  'EMP-001',
  '관리',
  '자',
  'admin@company.com',
  '010-0000-0001',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '55555555-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '2020-01-02',
  'ADMIN',
  'ACTIVE'
),
-- Employee (홍길동)
(
  'eeeeeeee-2222-2222-2222-222222222222',
  '22222222-2222-2222-2222-222222222222',
  'EMP-002',
  '길동',
  '홍',
  'employee@company.com',
  '010-1234-5678',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  '22222222-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '2023-01-02',
  'EMPLOYEE',
  'ACTIVE'
);

-- 5. Leave Balances (휴가 잔여)
-- leave_types는 마이그레이션에서 이미 생성됨
-- ============================================================================
INSERT INTO public.leave_balances (employee_id, leave_type_id, year, total_days, used_days)
SELECT
  'eeeeeeee-1111-1111-1111-111111111111',
  id,
  2024,
  default_days,
  CASE WHEN code = 'ANNUAL' THEN 3 ELSE 0 END
FROM public.leave_types WHERE code IN ('ANNUAL', 'SICK');

INSERT INTO public.leave_balances (employee_id, leave_type_id, year, total_days, used_days)
SELECT
  'eeeeeeee-2222-2222-2222-222222222222',
  id,
  2024,
  default_days,
  0
FROM public.leave_types WHERE code IN ('ANNUAL', 'SICK');
