-- Jira Ultra Database Schema
-- PostgreSQL 18

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

-- PROJECT table
CREATE TABLE project (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    key VARCHAR(10) UNIQUE NOT NULL,
    description TEXT,
    owner_id TEXT REFERENCES "user"(id) ON DELETE SET NULL,
    icon_url TEXT,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SPRINT table
CREATE TABLE sprint (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES project(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    goal TEXT,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    status VARCHAR(50) DEFAULT 'planned', -- planned, active, completed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- BACKLOG table
CREATE TABLE backlog (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES project(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TASK table
CREATE TABLE task (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES project(id) ON DELETE CASCADE,
    sprint_id UUID REFERENCES sprint(id) ON DELETE SET NULL,
    backlog_id UUID REFERENCES backlog(id) ON DELETE SET NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'todo', -- todo, in_progress, in_review, done
    priority VARCHAR(50) DEFAULT 'medium', -- low, medium, high, critical
    task_type VARCHAR(50) DEFAULT 'task', -- task, bug, story, epic
    assignee_id TEXT REFERENCES "user"(id) ON DELETE SET NULL,
    reporter_id TEXT REFERENCES "user"(id) ON DELETE SET NULL,
    story_points INTEGER,
    estimated_hours DECIMAL(10, 2),
    actual_hours DECIMAL(10, 2),
    parent_task_id UUID REFERENCES task(id) ON DELETE SET NULL,
    due_date TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SPRINT_SCHEDULE table
CREATE TABLE sprint_schedule (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sprint_id UUID NOT NULL REFERENCES sprint(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL, -- planning, daily_standup, review, retrospective
    scheduled_date TIMESTAMP NOT NULL,
    duration_minutes INTEGER,
    location VARCHAR(255),
    notes TEXT,
    is_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ANALYSIS table
CREATE TABLE analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES project(id) ON DELETE CASCADE,
    sprint_id UUID REFERENCES sprint(id) ON DELETE CASCADE,
    analysis_type VARCHAR(100) NOT NULL, -- velocity, burndown, productivity, quality
    data JSONB NOT NULL,
    summary TEXT,
    insights TEXT[],
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT REFERENCES "user"(id) ON DELETE SET NULL
);

-- METRICS table
CREATE TABLE metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES project(id) ON DELETE CASCADE,
    sprint_id UUID REFERENCES sprint(id) ON DELETE CASCADE,
    task_id UUID REFERENCES task(id) ON DELETE CASCADE,
    metric_type VARCHAR(100) NOT NULL, -- velocity, cycle_time, lead_time, throughput, etc.
    metric_name VARCHAR(255) NOT NULL,
    value DECIMAL(15, 4) NOT NULL,
    unit VARCHAR(50),
    metadata JSONB,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX idx_user_email ON "user"(email);
CREATE INDEX idx_user_name ON "user"(name);

CREATE INDEX idx_project_owner ON project(owner_id);
CREATE INDEX idx_project_status ON project(status);

CREATE INDEX idx_sprint_project ON sprint(project_id);
CREATE INDEX idx_sprint_status ON sprint(status);
CREATE INDEX idx_sprint_dates ON sprint(start_date, end_date);

CREATE INDEX idx_backlog_project ON backlog(project_id);

CREATE INDEX idx_task_project ON task(project_id);
CREATE INDEX idx_task_sprint ON task(sprint_id);
CREATE INDEX idx_task_backlog ON task(backlog_id);
CREATE INDEX idx_task_assignee ON task(assignee_id);
CREATE INDEX idx_task_reporter ON task(reporter_id);
CREATE INDEX idx_task_status ON task(status);
CREATE INDEX idx_task_priority ON task(priority);
CREATE INDEX idx_task_parent ON task(parent_task_id);

CREATE INDEX idx_sprint_schedule_sprint ON sprint_schedule(sprint_id);
CREATE INDEX idx_sprint_schedule_date ON sprint_schedule(scheduled_date);

CREATE INDEX idx_analysis_project ON analysis(project_id);
CREATE INDEX idx_analysis_sprint ON analysis(sprint_id);
CREATE INDEX idx_analysis_type ON analysis(analysis_type);

CREATE INDEX idx_metrics_project ON metrics(project_id);
CREATE INDEX idx_metrics_sprint ON metrics(sprint_id);
CREATE INDEX idx_metrics_task ON metrics(task_id);
CREATE INDEX idx_metrics_type ON metrics(metric_type);
CREATE INDEX idx_metrics_recorded ON metrics(recorded_at);

CREATE INDEX session_userId_idx ON "session" ("userId");

CREATE INDEX account_userId_idx ON "account" ("userId");

CREATE INDEX verification_identifier_idx ON "verification" ("identifier");


-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update triggers to tables with updated_at

CREATE TRIGGER update_project_updated_at BEFORE UPDATE ON project
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sprint_updated_at BEFORE UPDATE ON sprint
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_backlog_updated_at BEFORE UPDATE ON backlog
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_task_updated_at BEFORE UPDATE ON task
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sprint_schedule_updated_at BEFORE UPDATE ON sprint_schedule
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;