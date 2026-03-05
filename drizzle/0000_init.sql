CREATE TYPE "public"."availability_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."poker_session_status" AS ENUM('voting', 'revealed', 'completed');--> statement-breakpoint
CREATE TYPE "public"."sprint_status" AS ENUM('planned', 'active', 'completed', 'closed');--> statement-breakpoint
CREATE TYPE "public"."subscription_tier" AS ENUM('free', 'pro', 'enterprise');--> statement-breakpoint
CREATE TYPE "public"."task_priority" AS ENUM('critical', 'high', 'medium', 'low');--> statement-breakpoint
CREATE TYPE "public"."task_status" AS ENUM('to_do', 'in_progress', 'review', 'test', 'done');--> statement-breakpoint
CREATE TYPE "public"."task_type" AS ENUM('epic', 'story', 'task', 'bug', 'spike');--> statement-breakpoint
CREATE TYPE "public"."team_role" AS ENUM('admin', 'member', 'viewer');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('member', 'leader', 'viewer');--> statement-breakpoint
CREATE TABLE "organization" (
	"organization_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"subscription_tier" "subscription_tier" DEFAULT 'free' NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"emailVerified" boolean,
	"image" text,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"organization_id" uuid,
	"first_name" varchar(255),
	"last_name" varchar(255),
	"role" varchar(50) DEFAULT 'member',
	"is_active" boolean DEFAULT true,
	"deleted_at" timestamp,
	CONSTRAINT "user_email_key" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "team_membership" (
	"membership_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"team_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"role_in_team" "team_role" DEFAULT 'member' NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "team_membership_team_id_user_id_key" UNIQUE("user_id","team_id")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expiresAt" timestamp with time zone NOT NULL,
	"token" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"ipAddress" text,
	"userAgent" text,
	"userId" text NOT NULL,
	CONSTRAINT "session_token_key" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"accountId" text NOT NULL,
	"providerId" text NOT NULL,
	"userId" text NOT NULL,
	"accessToken" text,
	"refreshToken" text,
	"idToken" text,
	"accessTokenExpiresAt" timestamp with time zone,
	"refreshTokenExpiresAt" timestamp with time zone,
	"scope" text,
	"password" text,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expiresAt" timestamp with time zone NOT NULL,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "team" (
	"team_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"lead_user_id" text,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "project" (
	"project_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"team_id" uuid,
	"name" varchar(255) NOT NULL,
	"key" varchar(10) NOT NULL,
	"description" text,
	"owner_id" text,
	"icon_url" text,
	"status" varchar(50) DEFAULT 'active',
	"task_counter" integer DEFAULT 0,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "project_key_organization_key" UNIQUE("key", "organization_id")
);
--> statement-breakpoint
CREATE TABLE "sprint" (
	"sprint_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"status" "sprint_status" DEFAULT 'planned' NOT NULL,
	"total_points" integer DEFAULT 0 NOT NULL,
	"completed_points" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "valid_dates" CHECK (end_date >= start_date)
);
--> statement-breakpoint
CREATE TABLE "backlog" (
	"backlog_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "task" (
	"task_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"sprint_id" uuid,
	"backlog_id" uuid,
	"assignee_id" text,
	"reporter_id" text NOT NULL,
	"title" varchar(500) NOT NULL,
	"description" text,
	"estimated_hours" integer,
	"status" "task_status" DEFAULT 'to_do' NOT NULL,
	"priority" "task_priority" DEFAULT 'medium' NOT NULL,
	"task_type" "task_type" DEFAULT 'task' NOT NULL,
	"story_points" integer,
	"due_date" date,
	"time_taken_to_complete" integer,
	"task_key" varchar(20),
	"tags" text[] DEFAULT '{}',
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "poker_vote" (
	"vote_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"vote_value" integer NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "poker_vote_session_id_user_id_key" UNIQUE("user_id","session_id")
);
--> statement-breakpoint
CREATE TABLE "poker_session" (
	"session_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sprint_id" uuid NOT NULL,
	"task_id" uuid NOT NULL,
	"created_by" text NOT NULL,
	"status" "poker_session_status" DEFAULT 'voting' NOT NULL,
	"final_estimate" integer,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "sprint_availability" (
	"availability_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sprint_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"submitted_by" text NOT NULL,
	"approved_by" text,
	"status" "availability_status" DEFAULT 'pending' NOT NULL,
	"submitted_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"approved_at" timestamp,
	"availability_pattern" jsonb NOT NULL,
	"total_hours" numeric(10, 2) NOT NULL,
	"working_days" integer NOT NULL,
	"half_days" integer DEFAULT 0 NOT NULL,
	"off_days" integer NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "sprint_availability_sprint_id_user_id_key" UNIQUE("user_id","sprint_id")
);
--> statement-breakpoint
CREATE TABLE "user_analytics" (
	"analytics_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"sprint_id" uuid NOT NULL,
	"stories_completed" integer DEFAULT 0 NOT NULL,
	"bugs_fixed" integer DEFAULT 0 NOT NULL,
	"total_story_points" integer DEFAULT 0 NOT NULL,
	"hours_logged" numeric(10, 2) DEFAULT '0' NOT NULL,
	"hours_available" numeric(10, 2) DEFAULT '0' NOT NULL,
	"utilization_rate" numeric(5, 2) GENERATED ALWAYS AS (
CASE
    WHEN (hours_available > (0)::numeric) THEN ((hours_logged / hours_available) * (100)::numeric)
    ELSE (0)::numeric
END) STORED,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "user_analytics_user_id_sprint_id_key" UNIQUE("user_id","sprint_id")
);
--> statement-breakpoint
CREATE TABLE "sprint_metrics" (
	"metrics_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sprint_id" uuid NOT NULL,
	"total_tasks" integer DEFAULT 0 NOT NULL,
	"completed_tasks" integer DEFAULT 0 NOT NULL,
	"total_points" integer DEFAULT 0 NOT NULL,
	"completed_points" integer DEFAULT 0 NOT NULL,
	"completion_percentage" numeric(5, 2) GENERATED ALWAYS AS (
CASE
    WHEN (total_tasks > 0) THEN (((completed_tasks)::numeric / (total_tasks)::numeric) * (100)::numeric)
    ELSE (0)::numeric
END) STORED,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "sprint_metrics_sprint_id_key" UNIQUE("sprint_id")
);
--> statement-breakpoint
CREATE TABLE "velocity_data" (
	"velocity_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"metrics_id" uuid NOT NULL,
	"sprint_number" integer NOT NULL,
	"committed_points" integer NOT NULL,
	"completed_points" integer NOT NULL,
	"velocity" numeric(10, 2) GENERATED ALWAYS AS (
CASE
    WHEN (committed_points > 0) THEN (((completed_points)::numeric / (committed_points)::numeric) * (100)::numeric)
    ELSE (0)::numeric
END) STORED,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "burndown_data" (
	"burndown_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"metrics_id" uuid NOT NULL,
	"entry_date" date NOT NULL,
	"remaining_points" integer NOT NULL,
	"ideal_points" integer NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "burndown_data_metrics_id_entry_date_key" UNIQUE("metrics_id","entry_date")
);
--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("organization_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_membership" ADD CONSTRAINT "team_membership_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."team"("team_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_membership" ADD CONSTRAINT "team_membership_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team" ADD CONSTRAINT "team_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("organization_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team" ADD CONSTRAINT "team_lead_user_id_fkey" FOREIGN KEY ("lead_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("organization_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."team"("team_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sprint" ADD CONSTRAINT "sprint_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."project"("project_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "backlog" ADD CONSTRAINT "backlog_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."project"("project_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task" ADD CONSTRAINT "task_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."project"("project_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task" ADD CONSTRAINT "task_sprint_id_fkey" FOREIGN KEY ("sprint_id") REFERENCES "public"."sprint"("sprint_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task" ADD CONSTRAINT "task_backlog_id_fkey" FOREIGN KEY ("backlog_id") REFERENCES "public"."backlog"("backlog_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task" ADD CONSTRAINT "task_assignee_id_fkey" FOREIGN KEY ("assignee_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task" ADD CONSTRAINT "task_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "poker_vote" ADD CONSTRAINT "poker_vote_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "public"."poker_session"("session_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "poker_vote" ADD CONSTRAINT "poker_vote_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "poker_session" ADD CONSTRAINT "poker_session_sprint_id_fkey" FOREIGN KEY ("sprint_id") REFERENCES "public"."sprint"("sprint_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "poker_session" ADD CONSTRAINT "poker_session_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "public"."task"("task_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "poker_session" ADD CONSTRAINT "poker_session_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sprint_availability" ADD CONSTRAINT "sprint_availability_sprint_id_fkey" FOREIGN KEY ("sprint_id") REFERENCES "public"."sprint"("sprint_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sprint_availability" ADD CONSTRAINT "sprint_availability_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sprint_availability" ADD CONSTRAINT "sprint_availability_submitted_by_fkey" FOREIGN KEY ("submitted_by") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sprint_availability" ADD CONSTRAINT "sprint_availability_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_analytics" ADD CONSTRAINT "user_analytics_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_analytics" ADD CONSTRAINT "user_analytics_sprint_id_fkey" FOREIGN KEY ("sprint_id") REFERENCES "public"."sprint"("sprint_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sprint_metrics" ADD CONSTRAINT "sprint_metrics_sprint_id_fkey" FOREIGN KEY ("sprint_id") REFERENCES "public"."sprint"("sprint_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "velocity_data" ADD CONSTRAINT "velocity_data_metrics_id_fkey" FOREIGN KEY ("metrics_id") REFERENCES "public"."sprint_metrics"("metrics_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "burndown_data" ADD CONSTRAINT "burndown_data_metrics_id_fkey" FOREIGN KEY ("metrics_id") REFERENCES "public"."sprint_metrics"("metrics_id") ON DELETE cascade ON UPDATE no action;