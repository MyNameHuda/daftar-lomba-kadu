-- =====================================================
-- Schema: Daftar Lomba Kadu
-- =====================================================
-- Categories: 'balita' | 'anak' | 'ibu-ibu'
-- Sub-categories (only for 'anak'): 'laki_laki' | 'perempuan'
--
-- Age range per category is defined in api/_lib/ageRange.js (single source
-- of truth). The contests table no longer stores age_min/age_max.
-- =====================================================

-- Clean slate (safe to re-run during dev)
DROP TABLE IF EXISTS participants CASCADE;
DROP TABLE IF EXISTS contests CASCADE;
DROP TABLE IF EXISTS admins CASCADE;
DROP FUNCTION IF EXISTS set_updated_at() CASCADE;

-- Admins (single-admin untuk versi ini)
CREATE TABLE admins (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Contests (lomba)
CREATE TABLE contests (
  id           SERIAL PRIMARY KEY,
  name         VARCHAR(100) NOT NULL,
  category     VARCHAR(20)  NOT NULL CHECK (category IN ('balita', 'anak', 'ibu-ibu')),
  sub_category VARCHAR(20)  CHECK (sub_category IN ('laki_laki', 'perempuan')),
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  CHECK (
    (category = 'anak' AND sub_category IS NOT NULL) OR
    (category <> 'anak' AND sub_category IS NULL)
  )
);

CREATE INDEX idx_contests_category ON contests(category);
CREATE INDEX idx_contests_created_at ON contests(created_at DESC);

-- Participants (peserta)
CREATE TABLE participants (
  id         SERIAL PRIMARY KEY,
  contest_id INT NOT NULL REFERENCES contests(id) ON DELETE CASCADE,
  name       VARCHAR(100) NOT NULL,
  age        INT NOT NULL CHECK (age >= 0 AND age <= 120),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_participants_contest ON participants(contest_id);
CREATE INDEX idx_participants_sort ON participants(contest_id, age ASC, name ASC);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $func$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$func$ LANGUAGE plpgsql;

CREATE TRIGGER contests_updated_at
  BEFORE UPDATE ON contests
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER participants_updated_at
  BEFORE UPDATE ON participants
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();
