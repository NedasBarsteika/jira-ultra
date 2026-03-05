import { sql } from 'drizzle-orm';
import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  foreignKey,
  unique,
  text,
  boolean,
  integer,
  check,
  date,
  jsonb,
  numeric,
  pgEnum,
} from 'drizzle-orm/pg-core';

export const availabilityStatus = pgEnum('availability_status', [
  'pending',
  'approved',
  'rejected',
]);
export const pokerSessionStatus = pgEnum('poker_session_status', [
  'voting',
  'revealed',
  'completed',
]);
export const sprintStatus = pgEnum('sprint_status', ['planned', 'active', 'completed', 'closed']);
export const subscriptionTier = pgEnum('subscription_tier', ['free', 'pro', 'enterprise']);
export const taskPriority = pgEnum('task_priority', ['critical', 'high', 'medium', 'low']);
export const taskStatus = pgEnum('task_status', ['to_do', 'in_progress', 'review', 'test', 'done']);
export const taskType = pgEnum('task_type', ['epic', 'story', 'task', 'bug', 'spike']);
export const teamRole = pgEnum('team_role', ['admin', 'member', 'viewer']);
export const userRole = pgEnum('user_role', ['member', 'leader', 'viewer']);

export const organization = pgTable('organization', {
  organizationId: uuid('organization_id')
    .default(sql`gen_random_uuid()`)
    .primaryKey()
    .notNull(),
  name: varchar({ length: 255 }).notNull(),
  subscriptionTier: subscriptionTier('subscription_tier').default('free').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  deletedAt: timestamp('deleted_at', { mode: 'string' }),
});

export const user = pgTable(
  'user',
  {
    id: text().primaryKey().notNull(),
    name: text(),
    email: text(),
    emailVerified: boolean(),
    image: text(),
    createdAt: timestamp({ withTimezone: true, mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ withTimezone: true, mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    organizationId: uuid('organization_id'),
    firstName: varchar('first_name', { length: 255 }),
    lastName: varchar('last_name', { length: 255 }),
    role: varchar({ length: 50 }).default('member'),
    isActive: boolean('is_active').default(true),
    deletedAt: timestamp('deleted_at', { mode: 'string' }),
  },
  table => [
    foreignKey({
      columns: [table.organizationId],
      foreignColumns: [organization.organizationId],
      name: 'user_organization_id_fkey',
    }).onDelete('cascade'),
    unique('user_email_key').on(table.email),
  ]
);

export const teamMembership = pgTable(
  'team_membership',
  {
    membershipId: uuid('membership_id')
      .default(sql`gen_random_uuid()`)
      .primaryKey()
      .notNull(),
    teamId: uuid('team_id').notNull(),
    userId: text('user_id').notNull(),
    roleInTeam: teamRole('role_in_team').default('member').notNull(),
    createdAt: timestamp('created_at', { mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    deletedAt: timestamp('deleted_at', { mode: 'string' }),
  },
  table => [
    foreignKey({
      columns: [table.teamId],
      foreignColumns: [team.teamId],
      name: 'team_membership_team_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: 'team_membership_user_id_fkey',
    }).onDelete('cascade'),
    unique('team_membership_team_id_user_id_key').on(table.userId, table.teamId),
  ]
);

export const session = pgTable(
  'session',
  {
    id: text().primaryKey().notNull(),
    expiresAt: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
    token: text().notNull(),
    createdAt: timestamp({ withTimezone: true, mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ withTimezone: true, mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    ipAddress: text(),
    userAgent: text(),
    userId: text().notNull(),
  },
  table => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: 'session_userId_fkey',
    }).onDelete('cascade'),
    unique('session_token_key').on(table.token),
  ]
);

export const account = pgTable(
  'account',
  {
    id: text().primaryKey().notNull(),
    accountId: text().notNull(),
    providerId: text().notNull(),
    userId: text().notNull(),
    accessToken: text(),
    refreshToken: text(),
    idToken: text(),
    accessTokenExpiresAt: timestamp({ withTimezone: true, mode: 'string' }),
    refreshTokenExpiresAt: timestamp({ withTimezone: true, mode: 'string' }),
    scope: text(),
    password: text(),
    createdAt: timestamp({ withTimezone: true, mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ withTimezone: true, mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  table => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: 'account_userId_fkey',
    }).onDelete('cascade'),
  ]
);

export const verification = pgTable('verification', {
  id: text().primaryKey().notNull(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
  createdAt: timestamp({ withTimezone: true, mode: 'string' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp({ withTimezone: true, mode: 'string' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const team = pgTable(
  'team',
  {
    teamId: uuid('team_id')
      .default(sql`gen_random_uuid()`)
      .primaryKey()
      .notNull(),
    organizationId: uuid('organization_id').notNull(),
    name: varchar({ length: 255 }).notNull(),
    leadUserId: text('lead_user_id'),
    createdAt: timestamp('created_at', { mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    deletedAt: timestamp('deleted_at', { mode: 'string' }),
  },
  table => [
    foreignKey({
      columns: [table.organizationId],
      foreignColumns: [organization.organizationId],
      name: 'team_organization_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.leadUserId],
      foreignColumns: [user.id],
      name: 'team_lead_user_id_fkey',
    }).onDelete('set null'),
  ]
);

export const project = pgTable(
  'project',
  {
    projectId: uuid('project_id')
      .default(sql`gen_random_uuid()`)
      .primaryKey()
      .notNull(),
    organizationId: uuid('organization_id').notNull(),
    teamId: uuid('team_id'),
    name: varchar({ length: 255 }).notNull(),
    key: varchar({ length: 10 }).notNull(),
    description: text(),
    ownerId: text('owner_id'),
    iconUrl: text('icon_url'),
    status: varchar({ length: 50 }).default('active'),
    taskCounter: integer('task_counter').default(0),
    createdAt: timestamp('created_at', { mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    deletedAt: timestamp('deleted_at', { mode: 'string' }),
  },
  table => [
    foreignKey({
      columns: [table.organizationId],
      foreignColumns: [organization.organizationId],
      name: 'project_organization_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.teamId],
      foreignColumns: [team.teamId],
      name: 'project_team_id_fkey',
    }).onDelete('set null'),
    foreignKey({
      columns: [table.ownerId],
      foreignColumns: [user.id],
      name: 'project_owner_id_fkey',
    }).onDelete('set null'),
    unique('project_key_organization_key').on(table.key, table.organizationId),
  ]
);

export const sprint = pgTable(
  'sprint',
  {
    sprintId: uuid('sprint_id')
      .default(sql`gen_random_uuid()`)
      .primaryKey()
      .notNull(),
    projectId: uuid('project_id').notNull(),
    name: varchar({ length: 255 }).notNull(),
    startDate: date('start_date').notNull(),
    endDate: date('end_date').notNull(),
    status: sprintStatus().default('planned').notNull(),
    totalPoints: integer('total_points').default(0).notNull(),
    completedPoints: integer('completed_points').default(0).notNull(),
    createdAt: timestamp('created_at', { mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    deletedAt: timestamp('deleted_at', { mode: 'string' }),
  },
  table => [
    foreignKey({
      columns: [table.projectId],
      foreignColumns: [project.projectId],
      name: 'sprint_project_id_fkey',
    }).onDelete('cascade'),
    check('valid_dates', sql`end_date >= start_date`),
  ]
);

export const backlog = pgTable(
  'backlog',
  {
    backlogId: uuid('backlog_id')
      .default(sql`gen_random_uuid()`)
      .primaryKey()
      .notNull(),
    projectId: uuid('project_id').notNull(),
    name: varchar({ length: 255 }).notNull(),
    createdAt: timestamp('created_at', { mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    deletedAt: timestamp('deleted_at', { mode: 'string' }),
  },
  table => [
    foreignKey({
      columns: [table.projectId],
      foreignColumns: [project.projectId],
      name: 'backlog_project_id_fkey',
    }).onDelete('cascade'),
  ]
);

export const task = pgTable(
  'task',
  {
    taskId: uuid('task_id')
      .default(sql`gen_random_uuid()`)
      .primaryKey()
      .notNull(),
    projectId: uuid('project_id').notNull(),
    sprintId: uuid('sprint_id'),
    backlogId: uuid('backlog_id'),
    assigneeId: text('assignee_id'),
    reporterId: text('reporter_id').notNull(),
    title: varchar({ length: 500 }).notNull(),
    description: text(),
    estimatedHours: numeric('estimated_hours', { precision: 10, scale: 2 }),
    status: taskStatus().default('to_do').notNull(),
    priority: taskPriority().default('medium').notNull(),
    taskType: taskType('task_type').default('task').notNull(),
    storyPoints: integer('story_points'),
    dueDate: date('due_date'),
    timeTakenToComplete: integer('time_taken_to_complete'),
    taskKey: varchar('task_key', { length: 20 }),
    tags: text().array().default([]),
    createdAt: timestamp('created_at', { mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    deletedAt: timestamp('deleted_at', { mode: 'string' }),
  },
  table => [
    foreignKey({
      columns: [table.projectId],
      foreignColumns: [project.projectId],
      name: 'task_project_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.sprintId],
      foreignColumns: [sprint.sprintId],
      name: 'task_sprint_id_fkey',
    }).onDelete('set null'),
    foreignKey({
      columns: [table.backlogId],
      foreignColumns: [backlog.backlogId],
      name: 'task_backlog_id_fkey',
    }).onDelete('set null'),
    foreignKey({
      columns: [table.assigneeId],
      foreignColumns: [user.id],
      name: 'task_assignee_id_fkey',
    }).onDelete('restrict'),
    foreignKey({
      columns: [table.reporterId],
      foreignColumns: [user.id],
      name: 'task_reporter_id_fkey',
    }).onDelete('restrict'),
  ]
);

export const pokerVote = pgTable(
  'poker_vote',
  {
    voteId: uuid('vote_id')
      .default(sql`gen_random_uuid()`)
      .primaryKey()
      .notNull(),
    sessionId: uuid('session_id').notNull(),
    userId: text('user_id').notNull(),
    voteValue: integer('vote_value').notNull(),
    createdAt: timestamp('created_at', { mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    deletedAt: timestamp('deleted_at', { mode: 'string' }),
  },
  table => [
    foreignKey({
      columns: [table.sessionId],
      foreignColumns: [pokerSession.sessionId],
      name: 'poker_vote_session_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: 'poker_vote_user_id_fkey',
    }).onDelete('cascade'),
    unique('poker_vote_session_id_user_id_key').on(table.userId, table.sessionId),
  ]
);

export const pokerSession = pgTable(
  'poker_session',
  {
    sessionId: uuid('session_id')
      .default(sql`gen_random_uuid()`)
      .primaryKey()
      .notNull(),
    sprintId: uuid('sprint_id').notNull(),
    taskId: uuid('task_id').notNull(),
    createdBy: text('created_by').notNull(),
    status: pokerSessionStatus().default('voting').notNull(),
    finalEstimate: integer('final_estimate'),
    createdAt: timestamp('created_at', { mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    deletedAt: timestamp('deleted_at', { mode: 'string' }),
  },
  table => [
    foreignKey({
      columns: [table.sprintId],
      foreignColumns: [sprint.sprintId],
      name: 'poker_session_sprint_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.taskId],
      foreignColumns: [task.taskId],
      name: 'poker_session_task_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.createdBy],
      foreignColumns: [user.id],
      name: 'poker_session_created_by_fkey',
    }).onDelete('restrict'),
  ]
);

export const sprintAvailability = pgTable(
  'sprint_availability',
  {
    availabilityId: uuid('availability_id')
      .default(sql`gen_random_uuid()`)
      .primaryKey()
      .notNull(),
    sprintId: uuid('sprint_id').notNull(),
    userId: text('user_id').notNull(),
    submittedBy: text('submitted_by').notNull(),
    approvedBy: text('approved_by'),
    status: availabilityStatus().default('pending').notNull(),
    submittedAt: timestamp('submitted_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
    approvedAt: timestamp('approved_at', { mode: 'string' }),
    availabilityPattern: jsonb('availability_pattern').notNull(),
    totalHours: numeric('total_hours', { precision: 10, scale: 2 }).notNull(),
    workingDays: integer('working_days').notNull(),
    halfDays: integer('half_days').default(0).notNull(),
    offDays: integer('off_days').notNull(),
    notes: text(),
    createdAt: timestamp('created_at', { mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    deletedAt: timestamp('deleted_at', { mode: 'string' }),
  },
  table => [
    foreignKey({
      columns: [table.sprintId],
      foreignColumns: [sprint.sprintId],
      name: 'sprint_availability_sprint_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: 'sprint_availability_user_id_fkey',
    }).onDelete('restrict'),
    foreignKey({
      columns: [table.submittedBy],
      foreignColumns: [user.id],
      name: 'sprint_availability_submitted_by_fkey',
    }).onDelete('restrict'),
    foreignKey({
      columns: [table.approvedBy],
      foreignColumns: [user.id],
      name: 'sprint_availability_approved_by_fkey',
    }).onDelete('restrict'),
    unique('sprint_availability_sprint_id_user_id_key').on(table.userId, table.sprintId),
  ]
);

export const userAnalytics = pgTable(
  'user_analytics',
  {
    analyticsId: uuid('analytics_id')
      .default(sql`gen_random_uuid()`)
      .primaryKey()
      .notNull(),
    userId: text('user_id').notNull(),
    sprintId: uuid('sprint_id').notNull(),
    storiesCompleted: integer('stories_completed').default(0).notNull(),
    bugsFixed: integer('bugs_fixed').default(0).notNull(),
    totalStoryPoints: integer('total_story_points').default(0).notNull(),
    hoursLogged: numeric('hours_logged', { precision: 10, scale: 2 }).default('0').notNull(),
    hoursAvailable: numeric('hours_available', { precision: 10, scale: 2 }).default('0').notNull(),
    utilizationRate: numeric('utilization_rate', { precision: 5, scale: 2 }).generatedAlwaysAs(sql`
CASE
    WHEN (hours_available > (0)::numeric) THEN ((hours_logged / hours_available) * (100)::numeric)
    ELSE (0)::numeric
END`),
    createdAt: timestamp('created_at', { mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    deletedAt: timestamp('deleted_at', { mode: 'string' }),
  },
  table => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: 'user_analytics_user_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.sprintId],
      foreignColumns: [sprint.sprintId],
      name: 'user_analytics_sprint_id_fkey',
    }).onDelete('cascade'),
    unique('user_analytics_user_id_sprint_id_key').on(table.userId, table.sprintId),
  ]
);

export const sprintMetrics = pgTable(
  'sprint_metrics',
  {
    metricsId: uuid('metrics_id')
      .default(sql`gen_random_uuid()`)
      .primaryKey()
      .notNull(),
    sprintId: uuid('sprint_id').notNull(),
    totalTasks: integer('total_tasks').default(0).notNull(),
    completedTasks: integer('completed_tasks').default(0).notNull(),
    totalPoints: integer('total_points').default(0).notNull(),
    completedPoints: integer('completed_points').default(0).notNull(),
    completionPercentage: numeric('completion_percentage', { precision: 5, scale: 2 })
      .generatedAlwaysAs(sql`
CASE
    WHEN (total_tasks > 0) THEN (((completed_tasks)::numeric / (total_tasks)::numeric) * (100)::numeric)
    ELSE (0)::numeric
END`),
    createdAt: timestamp('created_at', { mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    deletedAt: timestamp('deleted_at', { mode: 'string' }),
  },
  table => [
    foreignKey({
      columns: [table.sprintId],
      foreignColumns: [sprint.sprintId],
      name: 'sprint_metrics_sprint_id_fkey',
    }).onDelete('cascade'),
    unique('sprint_metrics_sprint_id_key').on(table.sprintId),
  ]
);

export const velocityData = pgTable(
  'velocity_data',
  {
    velocityId: uuid('velocity_id')
      .default(sql`gen_random_uuid()`)
      .primaryKey()
      .notNull(),
    metricsId: uuid('metrics_id').notNull(),
    sprintNumber: integer('sprint_number').notNull(),
    committedPoints: integer('committed_points').notNull(),
    completedPoints: integer('completed_points').notNull(),
    velocity: numeric({ precision: 10, scale: 2 }).generatedAlwaysAs(sql`
CASE
    WHEN (committed_points > 0) THEN (((completed_points)::numeric / (committed_points)::numeric) * (100)::numeric)
    ELSE (0)::numeric
END`),
    createdAt: timestamp('created_at', { mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    deletedAt: timestamp('deleted_at', { mode: 'string' }),
  },
  table => [
    foreignKey({
      columns: [table.metricsId],
      foreignColumns: [sprintMetrics.metricsId],
      name: 'velocity_data_metrics_id_fkey',
    }).onDelete('cascade'),
  ]
);

export const burndownData = pgTable(
  'burndown_data',
  {
    burndownId: uuid('burndown_id')
      .default(sql`gen_random_uuid()`)
      .primaryKey()
      .notNull(),
    metricsId: uuid('metrics_id').notNull(),
    entryDate: date('entry_date').notNull(),
    remainingPoints: integer('remaining_points').notNull(),
    idealPoints: integer('ideal_points').notNull(),
    createdAt: timestamp('created_at', { mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    deletedAt: timestamp('deleted_at', { mode: 'string' }),
  },
  table => [
    foreignKey({
      columns: [table.metricsId],
      foreignColumns: [sprintMetrics.metricsId],
      name: 'burndown_data_metrics_id_fkey',
    }).onDelete('cascade'),
    unique('burndown_data_metrics_id_entry_date_key').on(table.metricsId, table.entryDate),
  ]
);
