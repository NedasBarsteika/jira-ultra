-- Iterova Database Schema
-- PostgreSQL 18

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE subscription_tier AS ENUM ('free', 'pro', 'enterprise');
CREATE TYPE user_role AS ENUM ('member', 'leader', 'viewer');
CREATE TYPE team_role AS ENUM ('admin', 'member', 'viewer');
CREATE TYPE sprint_status AS ENUM ('planned', 'active', 'completed', 'closed');
CREATE TYPE task_status AS ENUM ('to_do', 'in_progress', 'review', 'test', 'done');
CREATE TYPE task_priority AS ENUM ('critical', 'high', 'medium', 'low');
CREATE TYPE task_type AS ENUM ('epic', 'story', 'task', 'bug', 'spike');
CREATE TYPE poker_session_status AS ENUM ('voting', 'revealed', 'completed');
CREATE TYPE availability_status AS ENUM ('pending', 'approved', 'rejected');


-- ORGANIZATION table
CREATE TABLE organization (
    organization_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    subscription_tier subscription_tier NOT NULL DEFAULT 'free',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- USER table
CREATE TABLE "user" (
    id TEXT PRIMARY KEY,

    -- better-auth fields (keep exact names)
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    "emailVerified" BOOLEAN NOT NULL,
    image TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- custom fields
    organization_id UUID REFERENCES organization(organization_id) ON DELETE CASCADE,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'member',
    is_active BOOLEAN DEFAULT true
);

create table "session" (
  id TEXT NOT NULL PRIMARY KEY,
  "expiresAt" TIMESTAMPTZ NOT NULL,
  token TEXT NOT NULL UNIQUE,
  "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "userId" TEXT NOT NULL
    REFERENCES "user" ("id") ON DELETE CASCADE
);

create table "account" (
  id TEXT NOT NULL PRIMARY KEY,
  "accountId" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "userId" TEXT NOT NULL
    REFERENCES "user" ("id") ON DELETE CASCADE,
  "accessToken" TEXT,
  "refreshToken" TEXT,
  "idToken" TEXT,
  "accessTokenExpiresAt" TIMESTAMPTZ,
  "refreshTokenExpiresAt" TIMESTAMPTZ,
  scope TEXT,
  password TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

create table "verification" (
  id TEXT NOT NULL PRIMARY KEY,
  identifier TEXT NOT NULL,
  value TEXT NOT NULL,
  "expiresAt" TIMESTAMPTZ NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- TEAM table
CREATE TABLE team (
    team_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organization(organization_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    lead_user_id TEXT REFERENCES "user"(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- TEAM_MEMBERSHIP table
CREATE TABLE team_membership (
    membership_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES team(team_id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    role_in_team team_role NOT NULL DEFAULT 'member',
    UNIQUE(team_id, user_id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- PROJECT table
CREATE TABLE project (
    project_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organization(organization_id) ON DELETE CASCADE,
    team_id UUID REFERENCES team(team_id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    key VARCHAR(10) UNIQUE NOT NULL,
    description TEXT,
    owner_id TEXT REFERENCES "user"(id) ON DELETE SET NULL,
    icon_url TEXT,
    status VARCHAR(50) DEFAULT 'active',
    task_counter INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- SPRINT table
CREATE TABLE sprint (
    sprint_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES project(project_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status sprint_status NOT NULL DEFAULT 'planned',
    total_points INTEGER NOT NULL DEFAULT 0,
    completed_points INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT valid_dates CHECK (end_date >= start_date),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- BACKLOG table
CREATE TABLE backlog (
    backlog_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES project(project_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- TASK table
CREATE TABLE task (
    task_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES project(project_id) ON DELETE CASCADE,
    sprint_id UUID REFERENCES sprint(sprint_id) ON DELETE SET NULL,
    backlog_id UUID REFERENCES backlog(backlog_id) ON DELETE SET NULL,
    assignee_id TEXT REFERENCES "user"(id) ON DELETE SET NULL,
    reporter_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE SET NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    estimated_hours INTEGER,
    status task_status NOT NULL DEFAULT 'to_do',
    priority task_priority NOT NULL DEFAULT 'medium',
    task_type task_type NOT NULL DEFAULT 'task',
    story_points INTEGER,
    due_date DATE,
    time_taken_to_complete INTEGER, -- in hours or minutes, adjust as needed,
    task_key VARCHAR(20),
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- POKER_SESSION table
CREATE TABLE poker_session (
    session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sprint_id UUID NOT NULL REFERENCES sprint(sprint_id) ON DELETE CASCADE,
    task_id UUID NOT NULL REFERENCES task(task_id) ON DELETE CASCADE,
    created_by TEXT NOT NULL REFERENCES "user"(id) ON DELETE SET NULL,
    status poker_session_status NOT NULL DEFAULT 'voting',
    final_estimate INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- POKER_VOTE table
CREATE TABLE poker_vote (
    vote_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES poker_session(session_id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    vote_value INTEGER NOT NULL,
    UNIQUE(session_id, user_id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- SPRINT_AVAILABILITY table
CREATE TABLE sprint_availability (
    availability_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sprint_id UUID NOT NULL REFERENCES sprint(sprint_id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    submitted_by TEXT NOT NULL REFERENCES "user"(id) ON DELETE SET NULL,
    approved_by TEXT REFERENCES "user"(id) ON DELETE SET NULL,
    status availability_status NOT NULL DEFAULT 'pending',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP,
    availability_pattern JSONB NOT NULL,
    total_hours DECIMAL(10, 2) NOT NULL,
    working_days INTEGER NOT NULL,
    half_days INTEGER NOT NULL DEFAULT 0,
    off_days INTEGER NOT NULL,
    notes TEXT,
    UNIQUE(sprint_id, user_id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- USER_ANALYTICS table
CREATE TABLE user_analytics (
    analytics_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    sprint_id UUID NOT NULL REFERENCES sprint(sprint_id) ON DELETE CASCADE,
    stories_completed INTEGER NOT NULL DEFAULT 0,
    bugs_fixed INTEGER NOT NULL DEFAULT 0,
    total_story_points INTEGER NOT NULL DEFAULT 0,
    hours_logged DECIMAL(10, 2) NOT NULL DEFAULT 0,
    hours_available DECIMAL(10, 2) NOT NULL DEFAULT 0,
    utilization_rate DECIMAL(5, 2) GENERATED ALWAYS AS (
        CASE 
            WHEN hours_available > 0 THEN (hours_logged / hours_available) * 100 
            ELSE 0 
        END
    ) STORED,
    UNIQUE(user_id, sprint_id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- SPRINT_METRICS table
CREATE TABLE sprint_metrics (
    metrics_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sprint_id UUID NOT NULL UNIQUE REFERENCES sprint(sprint_id) ON DELETE CASCADE,
    total_tasks INTEGER NOT NULL DEFAULT 0,
    completed_tasks INTEGER NOT NULL DEFAULT 0,
    total_points INTEGER NOT NULL DEFAULT 0,
    completed_points INTEGER NOT NULL DEFAULT 0,
    completion_percentage DECIMAL(5, 2) GENERATED ALWAYS AS (
        CASE 
            WHEN total_tasks > 0 THEN (completed_tasks::DECIMAL / total_tasks) * 100 
            ELSE 0 
        END
    ) STORED,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- VELOCITY_DATA table
CREATE TABLE velocity_data (
    velocity_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metrics_id UUID NOT NULL REFERENCES sprint_metrics(metrics_id) ON DELETE CASCADE,
    sprint_number INTEGER NOT NULL,
    committed_points INTEGER NOT NULL,
    completed_points INTEGER NOT NULL,
    velocity DECIMAL(10, 2) GENERATED ALWAYS AS (
        CASE 
            WHEN committed_points > 0 THEN (completed_points::DECIMAL / committed_points) * 100 
            ELSE 0 
        END
    ) STORED,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- BURNDOWN_DATA table
CREATE TABLE burndown_data (
    burndown_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metrics_id UUID NOT NULL REFERENCES sprint_metrics(metrics_id) ON DELETE CASCADE,
    entry_date DATE NOT NULL,
    remaining_points INTEGER NOT NULL,
    ideal_points INTEGER NOT NULL,
    UNIQUE(metrics_id, entry_date),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- ── Seed data (development) ──────────────────────────────────────────────────
INSERT INTO organization (organization_id, name)
VALUES ('b0000000-0000-0000-0000-000000000001', 'Demo Organization');

INSERT INTO "user" (id, organization_id, name, email)
VALUES (
    'c0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000001',
    'Demo User',
    'demo@example.com'
);

INSERT INTO project (project_id, organization_id, name, key)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000001',
    'Demo Project',
    'DEMO'
);

COMMIT;