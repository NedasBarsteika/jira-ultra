'use client';

import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';

import AppTable, { type AppTableColumn } from '@/components/utils/table/AppTable';

type Priority = 'low' | 'medium' | 'high' | 'critical';
type Status = 'todo' | 'in_progress' | 'in_review' | 'done';

interface Issue {
  id: string;
  title: string;
  status: Status;
  priority: Priority;
  assignee: string;
  points: number;
}

const ISSUES: Issue[] = [
  {
    id: 'KS-1',
    title: 'Set up authentication',
    status: 'done',
    priority: 'high',
    assignee: 'AJ',
    points: 5,
  },
  {
    id: 'KS-2',
    title: 'Design database schema',
    status: 'done',
    priority: 'high',
    assignee: 'BS',
    points: 8,
  },
  {
    id: 'KS-3',
    title: 'Build issue list API',
    status: 'in_review',
    priority: 'medium',
    assignee: 'CW',
    points: 3,
  },
  {
    id: 'KS-4',
    title: 'Implement drag-and-drop board',
    status: 'in_progress',
    priority: 'medium',
    assignee: 'DL',
    points: 13,
  },
  {
    id: 'KS-5',
    title: 'Add file attachments',
    status: 'todo',
    priority: 'low',
    assignee: 'EM',
    points: 5,
  },
  {
    id: 'KS-6',
    title: 'Email notification system',
    status: 'todo',
    priority: 'medium',
    assignee: 'AJ',
    points: 8,
  },
  {
    id: 'KS-7',
    title: 'Fix login redirect bug',
    status: 'in_progress',
    priority: 'critical',
    assignee: 'BS',
    points: 2,
  },
  {
    id: 'KS-8',
    title: 'Add sprint planning view',
    status: 'todo',
    priority: 'high',
    assignee: 'CW',
    points: 21,
  },
  {
    id: 'KS-9',
    title: 'Export issues to CSV',
    status: 'todo',
    priority: 'low',
    assignee: 'DL',
    points: 3,
  },
  {
    id: 'KS-10',
    title: 'Dark mode support',
    status: 'done',
    priority: 'medium',
    assignee: 'EM',
    points: 5,
  },
  {
    id: 'KS-11',
    title: 'Performance audit',
    status: 'todo',
    priority: 'low',
    assignee: 'AJ',
    points: 3,
  },
  {
    id: 'KS-12',
    title: 'Unit test coverage',
    status: 'in_progress',
    priority: 'high',
    assignee: 'BS',
    points: 8,
  },
];

const STATUS_COLORS: Record<Status, 'default' | 'primary' | 'warning' | 'success'> = {
  todo: 'default',
  in_progress: 'primary',
  in_review: 'warning',
  done: 'success',
};

const STATUS_LABELS: Record<Status, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  in_review: 'In Review',
  done: 'Done',
};

const PRIORITY_COLORS: Record<Priority, 'default' | 'primary' | 'warning' | 'error'> = {
  low: 'default',
  medium: 'primary',
  high: 'warning',
  critical: 'error',
};

const PRIORITY_ORDER: Priority[] = ['low', 'medium', 'high', 'critical'];

const ASSIGNEE_COLORS: Record<string, string> = {
  AJ: '#1976d2',
  BS: '#9c27b0',
  CW: '#2e7d32',
  DL: '#ed6c02',
  EM: '#d32f2f',
};

const COLUMNS: AppTableColumn<Issue>[] = [
  {
    key: 'id',
    header: 'ID',
    sortable: true,
    width: 80,
    render: row => (
      <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'inherit', opacity: 0.6 }}>
        {row.id}
      </span>
    ),
  },
  { key: 'title', header: 'Title' },
  {
    key: 'status',
    header: 'Status',
    render: row => (
      <Chip
        label={STATUS_LABELS[row.status]}
        color={STATUS_COLORS[row.status]}
        size="small"
        variant="outlined"
      />
    ),
  },
  {
    key: 'priority',
    header: 'Priority',
    sortable: true,
    getValue: row => PRIORITY_ORDER.indexOf(row.priority),
    render: row => <Chip label={row.priority} color={PRIORITY_COLORS[row.priority]} size="small" />,
  },
  {
    key: 'assignee',
    header: 'Assignee',
    render: row => (
      <Tooltip title={row.assignee} arrow>
        <Avatar
          sx={{ width: 24, height: 24, fontSize: 10, bgcolor: ASSIGNEE_COLORS[row.assignee] }}
        >
          {row.assignee}
        </Avatar>
      </Tooltip>
    ),
  },
  {
    key: 'points',
    header: 'Points',
    sortable: true,
    align: 'right',
    getValue: row => row.points,
  },
];

export default function TableShowcase() {
  return (
    <AppTable
      columns={COLUMNS}
      rows={ISSUES}
      getRowKey={row => row.id}
      defaultSortKey="id"
      rowsPerPageOptions={[5, 10]}
      defaultRowsPerPage={5}
    />
  );
}
