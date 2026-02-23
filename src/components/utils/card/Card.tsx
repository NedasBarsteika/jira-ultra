'use client';

import ArrowDownIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpIcon from '@mui/icons-material/ArrowUpward';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import MinusIcon from '@mui/icons-material/Remove';
import FlameIcon from '@mui/icons-material/Whatshot';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import { useDrag } from 'react-dnd';

import type { TaskRow } from '@/server/tasks/tasks';

export const DRAG_TYPE = 'TASK_CARD';

// ── Priority config ───────────────────────────────────────────────────────────

type Priority = 'critical' | 'high' | 'medium' | 'low';

const priorityConfig: Record<Priority, { icon: React.ElementType; label: string; color: string }> =
  {
    critical: { icon: FlameIcon, label: 'Critical', color: '#f87171' },
    high: { icon: ArrowUpIcon, label: 'High', color: '#fb923c' },
    medium: { icon: MinusIcon, label: 'Medium', color: '#facc15' },
    low: { icon: ArrowDownIcon, label: 'Low', color: '#60a5fa' },
  };

// ── Tag colours (mirrors Figma palette) ──────────────────────────────────────

const tagStyles: Record<string, { bg: string; color: string }> = {
  Design: { bg: 'rgba(236,72,153,0.15)', color: '#f9a8d4' },
  UX: { bg: 'rgba(217,70,239,0.15)', color: '#e879f9' },
  DevOps: { bg: 'rgba(249,115,22,0.15)', color: '#fdba74' },
  Infrastructure: { bg: 'rgba(120,113,108,0.15)', color: '#d6d3d1' },
  Frontend: { bg: 'rgba(14,165,233,0.15)', color: '#7dd3fc' },
  Backend: { bg: 'rgba(99,102,241,0.15)', color: '#a5b4fc' },
  UI: { bg: 'rgba(139,92,246,0.15)', color: '#c4b5fd' },
  Documentation: { bg: 'rgba(20,184,166,0.15)', color: '#5eead4' },
  Security: { bg: 'rgba(239,68,68,0.15)', color: '#fca5a5' },
  Performance: { bg: 'rgba(16,185,129,0.15)', color: '#6ee7b7' },
  Analytics: { bg: 'rgba(6,182,212,0.15)', color: '#67e8f9' },
  Refactor: { bg: 'rgba(245,158,11,0.15)', color: '#fcd34d' },
  Mobile: { bg: 'rgba(132,204,22,0.15)', color: '#bef264' },
  QA: { bg: 'rgba(244,63,94,0.15)', color: '#fda4af' },
  Payments: { bg: 'rgba(34,197,94,0.15)', color: '#86efac' },
  Testing: { bg: 'rgba(59,130,246,0.15)', color: '#93c5fd' },
  Setup: { bg: 'rgba(100,116,139,0.15)', color: '#cbd5e1' },
  Database: { bg: 'rgba(168,85,247,0.15)', color: '#d8b4fe' },
};

const fallbackTag = { bg: 'rgba(107,114,128,0.15)', color: '#d1d5db' };

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDueDate(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDueDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = Math.round(
    (startOfDueDate.getTime() - startOfToday.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diff < 0) return 'Overdue';
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function dueDateColor(date: Date | string): string {
  const diff = Math.ceil((new Date(date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return '#f87171';
  if (diff <= 2) return '#fbbf24';
  return '#9ca3af';
}

// ── Component ─────────────────────────────────────────────────────────────────

interface TaskCardProps {
  task: TaskRow;
  onClick?: (task: TaskRow) => void;
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const [{ isDragging }, drag] = useDrag<{ id: string }, void, { isDragging: boolean }>(
    () => ({
      type: DRAG_TYPE,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      item: { id: task?.task_id ?? '' },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      collect: (monitor): { isDragging: boolean } => ({ isDragging: monitor.isDragging() }),
    }),
    [task?.task_id]
  );

  const priority = (task?.priority ?? 'medium') as Priority;
  const {
    icon: PriorityIcon,
    label: priorityLabel,
    color: priorityColor,
  } = priorityConfig[priority] ?? priorityConfig.medium;

  const tags = (task?.tags ?? []) as string[];

  return (
    <div
      ref={drag as unknown as React.Ref<HTMLDivElement>}
      onClick={() => onClick?.(task)}
      className={[
        'bg-white dark:bg-gray-900 rounded-lg border border-gray-200/60 dark:border-gray-700/60',
        'p-3 cursor-grab active:cursor-grabbing',
        'transition-all duration-150 hover:shadow-lg hover:shadow-black/20 hover:border-violet-400/30',
        'group select-none',
        isDragging ? 'opacity-40 shadow-lg rotate-2 scale-105' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Header: task key + priority */}
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-gray-500 dark:text-gray-400">{task?.task_key ?? '-'}</span>
        <Tooltip title={`${priorityLabel} priority`} placement="top" arrow>
          <span className="flex items-center" style={{ color: priorityColor }}>
            <PriorityIcon sx={{ fontSize: 14 }} />
          </span>
        </Tooltip>
      </div>

      {/* Title */}
      <h4
        className="text-sm mb-2 leading-snug text-gray-900 dark:text-white group-hover:text-violet-400 transition-colors"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {task?.title}
      </h4>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2.5">
          {tags.map(tag => {
            const style = tagStyles[tag] ?? fallbackTag;
            return (
              <Chip
                key={tag}
                label={tag}
                size="small"
                sx={{
                  bgcolor: style.bg,
                  color: style.color,
                  fontSize: '10px',
                  height: '18px',
                  borderRadius: '4px',
                  border: 'none',
                  '& .MuiChip-label': { px: '6px', py: 0 },
                }}
              />
            );
          })}
        </div>
      )}

      {/* Footer: assignee + story points + due date */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Tooltip title={task?.assignee_id ? 'Assigned' : 'Unassigned'} placement="bottom" arrow>
            <Avatar
              sx={{
                width: 24,
                height: 24,
                bgcolor: task?.assignee_id ? '#6d28d9' : '#4b5563',
                fontSize: 10,
              }}
            >
              <PersonIcon sx={{ fontSize: 13 }} />
            </Avatar>
          </Tooltip>

          {task?.story_points != null && (
            <span className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded px-1.5 py-0.5">
              {task?.story_points} SP
            </span>
          )}
        </div>

        {task?.due_date != null && (
          <div
            className="flex items-center gap-1 text-xs"
            style={{ color: dueDateColor(task?.due_date) }}
          >
            <CalendarTodayIcon sx={{ fontSize: 12 }} />
            <span>{formatDueDate(task?.due_date)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
