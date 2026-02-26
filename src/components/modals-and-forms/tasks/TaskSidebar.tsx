'use client';

import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  BookOpen,
  Bug,
  Calendar,
  CheckSquare,
  Clock,
  Flame,
  GitBranch,
  Minus,
  Search,
  Tag,
  User,
  X,
  Zap,
  AlignLeft,
} from 'lucide-react';
import Image from 'next/image';
import React, { useEffect } from 'react';

// ─── Types ──────────────────────────────────────────────────────────────────────

type TaskStatus = 'to_do' | 'in_progress' | 'review' | 'test' | 'done';
type TaskPriority = 'critical' | 'high' | 'medium' | 'low';
type TaskType = 'bug' | 'epic' | 'spike' | 'story' | 'task';

interface TaskUser {
  id: string;
  name: string;
  first_name: string | null;
  last_name: string | null;
  image: string | null;
  email: string;
}

interface TaskSprint {
  sprint_id: string;
  name: string;
  status: 'active' | 'closed' | 'completed' | 'planned';
}

export interface Task {
  task_id: string;
  task_key: string | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  task_type: TaskType;
  story_points: number | null;
  estimated_hours: number | null;
  time_taken_to_complete: number | null;
  due_date: Date | string | null;
  tags: string[] | null;
  assignee?: TaskUser | null;
  reporter?: TaskUser | null;
  sprint?: TaskSprint | null;
  created_at: Date | string;
  updated_at: Date | string;
}

interface TaskSidebarProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ─── Config ────────────────────────────────────────────────────────────────────

const priorityConfig: Record<TaskPriority, { icon: React.ElementType; label: string }> = {
  critical: { icon: Flame, label: 'Critical' },
  high: { icon: ArrowUp, label: 'High' },
  medium: { icon: Minus, label: 'Medium' },
  low: { icon: ArrowDown, label: 'Low' },
};

const statusConfig: Record<TaskStatus, { label: string }> = {
  to_do: { label: 'To Do' },
  in_progress: { label: 'In Progress' },
  review: { label: 'Review' },
  test: { label: 'Test' },
  done: { label: 'Done' },
};

const typeConfig: Record<TaskType, { icon: React.ElementType; label: string }> = {
  bug: { icon: Bug, label: 'Bug' },
  epic: { icon: Zap, label: 'Epic' },
  spike: { icon: Search, label: 'Spike' },
  story: { icon: BookOpen, label: 'Story' },
  task: { icon: CheckSquare, label: 'Task' },
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getInitials(user: TaskUser): string {
  if (user.first_name && user.last_name) {
    return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
  }
  return user.name.slice(0, 2).toUpperCase();
}

function formatDate(date: Date | string | null): string | null {
  if (!date) return null;
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function isOverdue(date: Date | string | null, status: TaskStatus): boolean {
  if (!date || status === 'done') return false;
  return new Date(date) < new Date();
}

// ─── Row ───────────────────────────────────────────────────────────────────────

function DetailRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3 py-2 border-b border-border last:border-0">
      <Icon className="size-4 text-muted-foreground shrink-0 mt-0.5" />
      <div className="flex flex-col gap-1 min-w-0">
        <span className="text-xs text-muted-foreground">{label}</span>
        <div className="text-sm">{children}</div>
      </div>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────

export default function TaskSidebar({ task, open, onOpenChange }: TaskSidebarProps) {
  // close on escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onOpenChange]);

  if (!open || !task) return null;

  const PriorityIcon = priorityConfig[task.priority].icon;
  const TypeIcon = typeConfig[task.task_type].icon;
  const overdue = isOverdue(task.due_date, task.status);

  const hasProgress =
    task.estimated_hours != null && task.estimated_hours > 0 && task.time_taken_to_complete != null;
  const progressPct = hasProgress
    ? Math.min(100, Math.round((task.time_taken_to_complete! / task.estimated_hours!) * 100))
    : 0;

  return (
    <>
      {/* backdrop */}
      <div className="fixed inset-0 z-40 bg-black/50" onClick={() => onOpenChange(false)} />

      {/* panel */}
      <div className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-background border-l border-border flex flex-col">
        {/* header */}
        <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-border">
          <div className="flex flex-col gap-2 min-w-0">
            {/* key + type + status */}
            <div className="flex items-center gap-2 flex-wrap">
              {task.task_key && (
                <span className="text-xs text-muted-foreground font-mono">{task.task_key}</span>
              )}
              <span className="text-xs text-muted-foreground">
                <TypeIcon className="size-3 inline mr-1" />
                {typeConfig[task.task_type].label}
              </span>
              <span className="text-xs text-muted-foreground">
                {statusConfig[task.status].label}
              </span>
            </div>
            {/* title */}
            <h2 className="text-base font-semibold leading-snug">{task.title}</h2>
          </div>

          {/* close button */}
          <button
            onClick={() => onOpenChange(false)}
            className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-0">
          {/* description */}
          <DetailRow icon={AlignLeft} label="Description">
            {task.description ?? (
              <span className="italic text-muted-foreground">No description provided.</span>
            )}
          </DetailRow>

          {/* priority */}
          <DetailRow icon={Flame} label="Priority">
            <span className="flex items-center gap-1">
              <PriorityIcon className="size-3" />
              {priorityConfig[task.priority].label}
            </span>
          </DetailRow>

          {/* story points */}
          {task.story_points != null && (
            <DetailRow icon={BarChart3} label="Story Points">
              {task.story_points} pts
            </DetailRow>
          )}

          {/* assignee */}
          <DetailRow icon={User} label="Assignee">
            {task.assignee ? (
              <span className="flex items-center gap-2">
                {task.assignee.image ? (
                  <Image
                    src={task.assignee.image}
                    alt={task.assignee.name}
                    className="size-5 rounded-full object-cover"
                  />
                ) : (
                  <span className="size-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium shrink-0">
                    {getInitials(task.assignee)}
                  </span>
                )}
                {task.assignee.name}
              </span>
            ) : (
              <span className="italic text-muted-foreground">Unassigned</span>
            )}
          </DetailRow>

          {/* reporter */}
          {task.reporter && (
            <DetailRow icon={User} label="Reporter">
              <span className="flex items-center gap-2">
                {task.reporter.image ? (
                  <Image
                    src={task.reporter.image}
                    alt={task.reporter.name}
                    className="size-5 rounded-full object-cover"
                  />
                ) : (
                  <span className="size-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium shrink-0">
                    {getInitials(task.reporter)}
                  </span>
                )}
                {task.reporter.name}
              </span>
            </DetailRow>
          )}

          {/* sprint */}
          {task.sprint && (
            <DetailRow icon={GitBranch} label="Sprint">
              <span className="flex items-center gap-2">
                {task.sprint.name}
                <span className="text-xs text-muted-foreground">({task.sprint.status})</span>
              </span>
            </DetailRow>
          )}

          {/* due date */}
          <DetailRow icon={Calendar} label="Due Date">
            {task.due_date ? (
              <span className={overdue ? 'text-red-500' : undefined}>
                {formatDate(task.due_date)}
                {overdue && <span className="ml-2 text-xs">(Overdue)</span>}
              </span>
            ) : (
              <span className="italic text-muted-foreground">No due date</span>
            )}
          </DetailRow>

          {/* time tracking */}
          {(task.estimated_hours != null || task.time_taken_to_complete != null) && (
            <DetailRow icon={Clock} label="Time Tracking">
              <div className="flex flex-col gap-1.5 w-full">
                <span>
                  {task.time_taken_to_complete != null && `${task.time_taken_to_complete}h logged`}
                  {task.estimated_hours != null && (
                    <span className="text-muted-foreground ml-1">
                      / {task.estimated_hours}h estimated
                    </span>
                  )}
                </span>
                {hasProgress && (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{progressPct}%</span>
                  </div>
                )}
              </div>
            </DetailRow>
          )}

          {/* tags */}
          {task.tags && task.tags.length > 0 && (
            <DetailRow icon={Tag} label="Labels">
              <div className="flex flex-wrap gap-1.5">
                {task.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </DetailRow>
          )}

          {/* timestamps */}
          <DetailRow icon={Calendar} label="Dates">
            <div className="flex flex-col gap-0.5 text-muted-foreground">
              <span>Created: {formatDate(task.created_at)}</span>
              <span>Updated: {formatDate(task.updated_at)}</span>
            </div>
          </DetailRow>
        </div>

        {/* footer */}
        <div className="px-6 py-3 border-t border-border flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-mono truncate max-w-[60%]">
            {task.task_id}
          </span>
        </div>
      </div>
    </>
  );
}
