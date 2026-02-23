/**
 * Auto-generated - DO NOT edit manually.
 * Regenerate with: npm run db:codegen
 */

// All table names exactly as they appear in the database.
export const Tables = {
  backlog: 'backlog',
  burndown_data: 'burndown_data',
  organization: 'organization',
  poker_session: 'poker_session',
  poker_vote: 'poker_vote',
  project: 'project',
  sprint: 'sprint',
  sprint_availability: 'sprint_availability',
  sprint_metrics: 'sprint_metrics',
  task: 'task',
  team: 'team',
  team_membership: 'team_membership',
  user: 'user',
  user_analytics: 'user_analytics',
  velocity_data: 'velocity_data',
} as const;

export type TableName = keyof typeof Tables;

// Runtime column names for the Backlog interface.
export const Backlog = {
  backlog_id: 'backlog_id',
  created_at: 'created_at',
  deleted_at: 'deleted_at',
  name: 'name',
  project_id: 'project_id',
  updated_at: 'updated_at',
} as const;

// Runtime column names for the BurndownData interface.
export const BurndownData = {
  burndown_id: 'burndown_id',
  created_at: 'created_at',
  deleted_at: 'deleted_at',
  entry_date: 'entry_date',
  ideal_points: 'ideal_points',
  metrics_id: 'metrics_id',
  remaining_points: 'remaining_points',
  updated_at: 'updated_at',
} as const;

// Runtime column names for the Organization interface.
export const Organization = {
  created_at: 'created_at',
  deleted_at: 'deleted_at',
  name: 'name',
  organization_id: 'organization_id',
  subscription_tier: 'subscription_tier',
  updated_at: 'updated_at',
} as const;

// Runtime column names for the PokerSession interface.
export const PokerSession = {
  created_at: 'created_at',
  created_by: 'created_by',
  deleted_at: 'deleted_at',
  final_estimate: 'final_estimate',
  session_id: 'session_id',
  sprint_id: 'sprint_id',
  status: 'status',
  task_id: 'task_id',
  updated_at: 'updated_at',
} as const;

// Runtime column names for the PokerVote interface.
export const PokerVote = {
  created_at: 'created_at',
  deleted_at: 'deleted_at',
  session_id: 'session_id',
  updated_at: 'updated_at',
  user_id: 'user_id',
  vote_id: 'vote_id',
  vote_value: 'vote_value',
} as const;

// Runtime column names for the Project interface.
export const Project = {
  created_at: 'created_at',
  deleted_at: 'deleted_at',
  key: 'key',
  name: 'name',
  organization_id: 'organization_id',
  project_id: 'project_id',
  task_counter: 'task_counter',
  team_id: 'team_id',
  updated_at: 'updated_at',
} as const;

// Runtime column names for the Sprint interface.
export const Sprint = {
  completed_points: 'completed_points',
  created_at: 'created_at',
  deleted_at: 'deleted_at',
  end_date: 'end_date',
  name: 'name',
  project_id: 'project_id',
  sprint_id: 'sprint_id',
  start_date: 'start_date',
  status: 'status',
  total_points: 'total_points',
  updated_at: 'updated_at',
} as const;

// Runtime column names for the SprintAvailability interface.
export const SprintAvailability = {
  approved_at: 'approved_at',
  approved_by: 'approved_by',
  availability_id: 'availability_id',
  availability_pattern: 'availability_pattern',
  created_at: 'created_at',
  deleted_at: 'deleted_at',
  half_days: 'half_days',
  notes: 'notes',
  off_days: 'off_days',
  sprint_id: 'sprint_id',
  status: 'status',
  submitted_at: 'submitted_at',
  submitted_by: 'submitted_by',
  total_hours: 'total_hours',
  updated_at: 'updated_at',
  user_id: 'user_id',
  working_days: 'working_days',
} as const;

// Runtime column names for the SprintMetrics interface.
export const SprintMetrics = {
  completed_points: 'completed_points',
  completed_tasks: 'completed_tasks',
  completion_percentage: 'completion_percentage',
  created_at: 'created_at',
  deleted_at: 'deleted_at',
  metrics_id: 'metrics_id',
  sprint_id: 'sprint_id',
  total_points: 'total_points',
  total_tasks: 'total_tasks',
  updated_at: 'updated_at',
} as const;

// Runtime column names for the Task interface.
export const Task = {
  assignee_id: 'assignee_id',
  backlog_id: 'backlog_id',
  created_at: 'created_at',
  deleted_at: 'deleted_at',
  description: 'description',
  due_date: 'due_date',
  estimated_hours: 'estimated_hours',
  priority: 'priority',
  project_id: 'project_id',
  reporter_id: 'reporter_id',
  sprint_id: 'sprint_id',
  status: 'status',
  story_points: 'story_points',
  tags: 'tags',
  task_id: 'task_id',
  task_key: 'task_key',
  task_type: 'task_type',
  time_taken_to_complete: 'time_taken_to_complete',
  title: 'title',
  updated_at: 'updated_at',
} as const;

// Runtime column names for the Team interface.
export const Team = {
  created_at: 'created_at',
  deleted_at: 'deleted_at',
  lead_user_id: 'lead_user_id',
  name: 'name',
  organization_id: 'organization_id',
  team_id: 'team_id',
  updated_at: 'updated_at',
} as const;

// Runtime column names for the TeamMembership interface.
export const TeamMembership = {
  created_at: 'created_at',
  deleted_at: 'deleted_at',
  membership_id: 'membership_id',
  role_in_team: 'role_in_team',
  team_id: 'team_id',
  updated_at: 'updated_at',
  user_id: 'user_id',
} as const;

// Runtime column names for the User interface.
export const User = {
  created_at: 'created_at',
  deleted_at: 'deleted_at',
  email: 'email',
  full_name: 'full_name',
  organization_id: 'organization_id',
  role: 'role',
  updated_at: 'updated_at',
  user_id: 'user_id',
} as const;

// Runtime column names for the UserAnalytics interface.
export const UserAnalytics = {
  analytics_id: 'analytics_id',
  bugs_fixed: 'bugs_fixed',
  created_at: 'created_at',
  deleted_at: 'deleted_at',
  hours_available: 'hours_available',
  hours_logged: 'hours_logged',
  sprint_id: 'sprint_id',
  stories_completed: 'stories_completed',
  total_story_points: 'total_story_points',
  updated_at: 'updated_at',
  user_id: 'user_id',
  utilization_rate: 'utilization_rate',
} as const;

// Runtime column names for the VelocityData interface.
export const VelocityData = {
  committed_points: 'committed_points',
  completed_points: 'completed_points',
  created_at: 'created_at',
  deleted_at: 'deleted_at',
  metrics_id: 'metrics_id',
  sprint_number: 'sprint_number',
  updated_at: 'updated_at',
  velocity: 'velocity',
  velocity_id: 'velocity_id',
} as const;
