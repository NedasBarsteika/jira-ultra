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

import type { TaskRow } from '@/server/tasks/tasks';

type Priority = 'critical' | 'high' | 'medium' | 'low';

const priorityConfig: Record<Priority, { icon: React.ElementType; label: string; color: string }> =
  {
    critical: { icon: FlameIcon, label: 'Critical', color: '#fb7185' },
    high: { icon: ArrowUpIcon, label: 'High', color: '#fbbf24' },
    medium: { icon: MinusIcon, label: 'Medium', color: '#a78bfa' },
    low: { icon: ArrowDownIcon, label: 'Low', color: '#60a5fa' },
  };

const tagStyles: Record<string, { bg: string; color: string }> = {
  Design: { bg: 'rgba(236,72,153,0.18)', color: '#f9a8d4' },
  UX: { bg: 'rgba(217,70,239,0.18)', color: '#e879f9' },
  DevOps: { bg: 'rgba(249,115,22,0.18)', color: '#fdba74' },
  Infrastructure: { bg: 'rgba(120,113,108,0.18)', color: '#d6d3d1' },
  Frontend: { bg: 'rgba(14,165,233,0.18)', color: '#7dd3fc' },
  Backend: { bg: 'rgba(99,102,241,0.18)', color: '#a5b4fc' },
  UI: { bg: 'rgba(139,92,246,0.18)', color: '#c4b5fd' },
  Documentation: { bg: 'rgba(20,184,166,0.18)', color: '#5eead4' },
  Security: { bg: 'rgba(239,68,68,0.18)', color: '#fca5a5' },
  Performance: { bg: 'rgba(16,185,129,0.18)', color: '#6ee7b7' },
  Analytics: { bg: 'rgba(6,182,212,0.18)', color: '#67e8f9' },
  Refactor: { bg: 'rgba(245,158,11,0.18)', color: '#fcd34d' },
  Mobile: { bg: 'rgba(132,204,22,0.18)', color: '#bef264' },
  QA: { bg: 'rgba(244,63,94,0.18)', color: '#fda4af' },
  Payments: { bg: 'rgba(34,197,94,0.18)', color: '#86efac' },
  Testing: { bg: 'rgba(59,130,246,0.18)', color: '#93c5fd' },
  Setup: { bg: 'rgba(100,116,139,0.18)', color: '#cbd5e1' },
  Database: { bg: 'rgba(168,85,247,0.18)', color: '#d8b4fe' },
};

const fallbackTag = { bg: 'rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.75)' };

function formatDueDate(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDueDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = Math.round((startOfDueDate.getTime() - startOfToday.getTime()) / (1000 * 60 * 60 * 24));

  if (diff < 0) return 'Overdue';
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function dueDateTone(date: Date | string): { color: string; bg: string } {
  const diff = Math.ceil((new Date(date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return { color: '#fca5a5', bg: 'rgba(248,113,113,0.12)' };
  if (diff <= 2) return { color: '#fcd34d', bg: 'rgba(251,191,36,0.12)' };
  return { color: 'rgba(255,255,255,0.70)', bg: 'rgba(255,255,255,0.08)' };
}

interface TaskCardProps {
  task: TaskRow;
  onClick?: (task: TaskRow) => void;
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
  const priority = (task?.priority ?? 'medium') as Priority;
  const { icon: PriorityIcon, label: priorityLabel, color: priorityColor } =
    priorityConfig[priority] ?? priorityConfig.medium;

  const tags = (task?.tags ?? []) as string[];

  const due = task?.due_date;
  const dueStyle = due ? dueDateTone(due) : null;

  const rawKey = (task?.task_key ?? '-') as string;
  const cleanKey = rawKey.replace(/^[\s⋮⠿]+/g, ''); // ✅ nuima “⋮⋮” ir pan.

  return (
    <div
      onClick={() => onClick?.(task)}
      className={[
        'w-full',
        'rounded-xl border border-white/10 bg-white/5',
        'p-3',
        'transition-all duration-150',
        'hover:bg-white/7 hover:border-white/15 hover:shadow-[0_10px_30px_rgba(0,0,0,0.25)]',
        'cursor-pointer select-none',
      ].join(' ')}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-white/55">{cleanKey}</span>

        <Tooltip title={`${priorityLabel} priority`} placement="top" arrow>
          <span className="flex items-center" style={{ color: priorityColor }}>
            <PriorityIcon sx={{ fontSize: 14 }} />
          </span>
        </Tooltip>
      </div>

      <div className="mt-1">
        <h4
          className="text-sm font-semibold text-white/90 leading-snug"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {task?.title}
        </h4>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {tags.slice(0, 4).map(tag => {
            const style = tagStyles[tag] ?? fallbackTag;
            return (
              <Chip
                key={`${task.task_id}-${tag}`}
                label={tag}
                size="small"
                sx={{
                  bgcolor: style.bg,
                  color: style.color,
                  fontSize: '10px',
                  height: '18px',
                  borderRadius: '6px',
                  '& .MuiChip-label': { px: '7px', py: 0 },
                }}
              />
            );
          })}
          {tags.length > 4 && (
            <span className="text-[10px] text-white/50 px-1.5 py-0.5 rounded-md bg-white/5">
              +{tags.length - 4}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2">
          <Tooltip title={task?.assignee_id ? 'Assigned' : 'Unassigned'} placement="bottom" arrow>
            <Avatar
              sx={{
                width: 22,
                height: 22,
                bgcolor: task?.assignee_id ? 'rgba(167,139,250,0.9)' : 'rgba(255,255,255,0.18)',
                color: task?.assignee_id ? '#111827' : 'rgba(255,255,255,0.75)',
                fontSize: 10,
              }}
            >
              <PersonIcon sx={{ fontSize: 13 }} />
            </Avatar>
          </Tooltip>

          {task?.story_points != null && (
            <span className="text-[10px] rounded-md bg-white/8 text-white/70 px-2 py-0.5">
              {task.story_points} SP
            </span>
          )}
        </div>

        {dueStyle && (
          <div
            className="flex items-center gap-1 text-[11px] rounded-md px-2 py-0.5"
            style={{ color: dueStyle.color, background: dueStyle.bg }}
          >
            <CalendarTodayIcon sx={{ fontSize: 12 }} />
            <span>{formatDueDate(due!)}</span>
          </div>
        )}
      </div>
    </div>
  );
}