-- ============================================================================
-- CONTACTS (포트폴리오 문의)
-- ============================================================================

-- Contact Status Enum
CREATE TYPE contact_status AS ENUM ('PENDING', 'READ', 'REPLIED');

-- Contacts Table
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  status contact_status NOT NULL DEFAULT 'PENDING',
  replied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE contacts IS '포트폴리오 문의';
COMMENT ON COLUMN contacts.name IS '문의자 이름';
COMMENT ON COLUMN contacts.email IS '문의자 이메일';
COMMENT ON COLUMN contacts.subject IS '문의 제목';
COMMENT ON COLUMN contacts.message IS '문의 내용';
COMMENT ON COLUMN contacts.status IS '처리 상태';
COMMENT ON COLUMN contacts.replied_at IS '답변 일시';

-- Indexes
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_created ON contacts(created_at DESC);
CREATE INDEX idx_contacts_email ON contacts(email);

-- Row Level Security
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- 익명 사용자도 문의 생성 가능
CREATE POLICY "Anyone can create contact"
  ON contacts FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 본인 문의만 조회 가능 (이메일 기준)
CREATE POLICY "Users can view own contacts"
  ON contacts FOR SELECT
  TO authenticated
  USING (
    email = auth.jwt() ->> 'email'
    OR EXISTS (
      SELECT 1 FROM employees
      WHERE user_id = auth.uid()
      AND role = 'ADMIN'
    )
  );

-- 관리자만 상태 업데이트 가능
CREATE POLICY "Only admins can update contacts"
  ON contacts FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE user_id = auth.uid()
      AND role = 'ADMIN'
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
