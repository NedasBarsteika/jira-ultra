export const APP_NAME = 'Jira Ultra';

export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export const PAGINATION_DEFAULT_PAGE_SIZE = 20;
export const DESCRIPTION_MAX_LENGTH = 500;
export const TITLE_MAX_LENGTH = 100;

// Days & Months
export const DAYS_SHORT = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const;
export const MONTHS_FULL = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

// Priority display config
export const PRIORITY_CONFIG = [
  { value: 'low', label: 'Low', color: 'text-gray-500' },
  { value: 'medium', label: 'Medium', color: 'text-blue-500' },
  { value: 'high', label: 'High', color: 'text-orange-500' },
  { value: 'critical', label: 'Critical', color: 'text-red-500' },
] as const;

// Task status display config
export const TASK_STATUS_CONFIG = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'in_review', label: 'In Review' },
  { value: 'done', label: 'Done' },
] as const;
