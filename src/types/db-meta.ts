/**
 * Auto-generated - DO NOT edit manually.
 * Regenerate with: npm run db:codegen
 */

// All table names exactly as they appear in the database.
export const Tables = {
  analysis: 'analysis',
  backlog: 'backlog',
  metrics: 'metrics',
  project: 'project',
  sprint: 'sprint',
  sprint_schedule: 'sprint_schedule',
  task: 'task',
  user: 'user',
} as const;

export type TableName = keyof typeof Tables;

// Runtime column names for the Analysis interface.
export const Analysis = {
  analysis_type: 'analysis_type',
  created_by: 'created_by',
  data: 'data',
  deleted_at: 'deleted_at',
  generated_at: 'generated_at',
  id: 'id',
  insights: 'insights',
  project_id: 'project_id',
  sprint_id: 'sprint_id',
  summary: 'summary',
} as const;

// Runtime column names for the Backlog interface.
export const Backlog = {
  created_at: 'created_at',
  deleted_at: 'deleted_at',
  description: 'description',
  id: 'id',
  name: 'name',
  priority: 'priority',
  project_id: 'project_id',
  updated_at: 'updated_at',
} as const;

// Runtime column names for the Metrics interface.
export const Metrics = {
  deleted_at: 'deleted_at',
  id: 'id',
  metadata: 'metadata',
  metric_name: 'metric_name',
  metric_type: 'metric_type',
  project_id: 'project_id',
  recorded_at: 'recorded_at',
  sprint_id: 'sprint_id',
  task_id: 'task_id',
  unit: 'unit',
  value: 'value',
} as const;

// Runtime column names for the Project interface.
export const Project = {
  created_at: 'created_at',
  deleted_at: 'deleted_at',
  description: 'description',
  icon_url: 'icon_url',
  id: 'id',
  key: 'key',
  name: 'name',
  owner_id: 'owner_id',
  status: 'status',
  task_counter: 'task_counter',
  updated_at: 'updated_at',
} as const;

// Runtime column names for the Sprint interface.
export const Sprint = {
  created_at: 'created_at',
  deleted_at: 'deleted_at',
  end_date: 'end_date',
  goal: 'goal',
  id: 'id',
  name: 'name',
  project_id: 'project_id',
  start_date: 'start_date',
  status: 'status',
  updated_at: 'updated_at',
} as const;

// Runtime column names for the SprintSchedule interface.
export const SprintSchedule = {
  created_at: 'created_at',
  deleted_at: 'deleted_at',
  duration_minutes: 'duration_minutes',
  event_type: 'event_type',
  id: 'id',
  is_completed: 'is_completed',
  location: 'location',
  notes: 'notes',
  scheduled_date: 'scheduled_date',
  sprint_id: 'sprint_id',
  updated_at: 'updated_at',
} as const;

// Runtime column names for the Task interface.
export const Task = {
  actual_hours: 'actual_hours',
  assignee_id: 'assignee_id',
  backlog_id: 'backlog_id',
  completed_at: 'completed_at',
  created_at: 'created_at',
  deleted_at: 'deleted_at',
  description: 'description',
  due_date: 'due_date',
  estimated_hours: 'estimated_hours',
  id: 'id',
  parent_task_id: 'parent_task_id',
  priority: 'priority',
  project_id: 'project_id',
  reporter_id: 'reporter_id',
  sprint_id: 'sprint_id',
  status: 'status',
  story_points: 'story_points',
  tags: 'tags',
  task_key: 'task_key',
  task_type: 'task_type',
  title: 'title',
  updated_at: 'updated_at',
} as const;

// Runtime column names for the User interface.
export const User = {
  avatar_url: 'avatar_url',
  created_at: 'created_at',
  deleted_at: 'deleted_at',
  email: 'email',
  full_name: 'full_name',
  id: 'id',
  is_active: 'is_active',
  password_hash: 'password_hash',
  role: 'role',
  updated_at: 'updated_at',
  username: 'username',
} as const;
