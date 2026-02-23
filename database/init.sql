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
    subscription_tier subscription_tier NOT NULL DEFAULT 'free'
);

-- USER table
CREATE TABLE "user" (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organization(organization_id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'member'
);

-- TEAM table
CREATE TABLE team (
    team_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organization(organization_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    lead_user_id UUID REFERENCES "user"(user_id) ON DELETE SET NULL
);

-- TEAM_MEMBERSHIP table
CREATE TABLE team_membership (
    membership_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES team(team_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES "user"(user_id) ON DELETE CASCADE,
    role_in_team team_role NOT NULL DEFAULT 'member',
    UNIQUE(team_id, user_id)
);

-- PROJECT table
CREATE TABLE project (
    project_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organization(organization_id) ON DELETE CASCADE,
    team_id UUID REFERENCES team(team_id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL
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
    CONSTRAINT valid_dates CHECK (end_date >= start_date)
);

-- BACKLOG table
CREATE TABLE backlog (
    backlog_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES project(project_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL
);

-- TASK table
CREATE TABLE task (
    task_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES project(project_id) ON DELETE CASCADE,
    sprint_id UUID REFERENCES sprint(sprint_id) ON DELETE SET NULL,
    backlog_id UUID REFERENCES backlog(backlog_id) ON DELETE SET NULL,
    assignee_id UUID REFERENCES "user"(user_id) ON DELETE SET NULL,
    reporter_id UUID NOT NULL REFERENCES "user"(user_id) ON DELETE SET NULL,
    title VARCHAR(500) NOT NULL,
    status task_status NOT NULL DEFAULT 'to_do',
    priority task_priority NOT NULL DEFAULT 'medium',
    task_type task_type NOT NULL DEFAULT 'task',
    story_points INTEGER,
    due_date DATE,
    time_taken_to_complete INTEGER -- in hours or minutes, adjust as needed
);

-- POKER_SESSION table
CREATE TABLE poker_session (
    session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sprint_id UUID NOT NULL REFERENCES sprint(sprint_id) ON DELETE CASCADE,
    task_id UUID NOT NULL REFERENCES task(task_id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES "user"(user_id) ON DELETE SET NULL,
    status poker_session_status NOT NULL DEFAULT 'voting',
    final_estimate INTEGER
);

-- POKER_VOTE table
CREATE TABLE poker_vote (
    vote_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES poker_session(session_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES "user"(user_id) ON DELETE CASCADE,
    vote_value INTEGER NOT NULL,
    UNIQUE(session_id, user_id)
);

-- SPRINT_AVAILABILITY table
CREATE TABLE sprint_availability (
    availability_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sprint_id UUID NOT NULL REFERENCES sprint(sprint_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES "user"(user_id) ON DELETE CASCADE,
    submitted_by UUID NOT NULL REFERENCES "user"(user_id) ON DELETE SET NULL,
    approved_by UUID REFERENCES "user"(user_id) ON DELETE SET NULL,
    status availability_status NOT NULL DEFAULT 'pending',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP,
    availability_pattern JSONB NOT NULL,
    total_hours DECIMAL(10, 2) NOT NULL,
    working_days INTEGER NOT NULL,
    half_days INTEGER NOT NULL DEFAULT 0,
    off_days INTEGER NOT NULL,
    notes TEXT,
    UNIQUE(sprint_id, user_id)
);

-- USER_ANALYTICS table
CREATE TABLE user_analytics (
    analytics_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES "user"(user_id) ON DELETE CASCADE,
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
    UNIQUE(user_id, sprint_id)
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
    ) STORED
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
    ) STORED
);

-- BURNDOWN_DATA table
CREATE TABLE burndown_data (
    burndown_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metrics_id UUID NOT NULL REFERENCES sprint_metrics(metrics_id) ON DELETE CASCADE,
    entry_date DATE NOT NULL,
    remaining_points INTEGER NOT NULL,
    ideal_points INTEGER NOT NULL,
    UNIQUE(metrics_id, entry_date)
);

COMMIT;