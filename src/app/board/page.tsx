'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import TaskModal from '@/components/modals-and-forms/tasks/TaskModal';
import CustomButton from '@/components/utils/buttons/CustomButton';
import TaskCard from '@/components/utils/card/Card';
import { getTasks, updateTask } from '@/server/tasks/tasks';
import type { TaskRow } from '@/server/tasks/tasks';
import type { TaskPriority, TaskStatus } from '@/types/db';

const PLACEHOLDER_PROJECT_ID = 'a0000000-0000-0000-0000-000000000001';

const DND_ITEM_TYPE = 'TASK';

const COLUMNS: Array<{ key: string; label: string; value: TaskStatus; dotClass: string }> = [
  { key: 'to_do', label: 'To Do', value: 'to_do', dotClass: 'bg-slate-300' },
  { key: 'in_progress', label: 'In Progress', value: 'in_progress', dotClass: 'bg-sky-400' },
  { key: 'review', label: 'Review', value: 'review', dotClass: 'bg-amber-400' },
  { key: 'test', label: 'Test', value: 'test', dotClass: 'bg-fuchsia-400' },
  { key: 'done', label: 'Done', value: 'done', dotClass: 'bg-emerald-400' },
];

type DragItem = { taskId: string };

function sumStoryPoints(tasks: TaskRow[]) {
  return tasks.reduce((acc, t) => acc + (t.story_points ?? 0), 0);
}

// Custom dropdown instead of native <select> to ensure proper contrast and styling
type PriorityFilter = 'all' | TaskPriority;

const PRIORITY_OPTIONS: Array<{ value: PriorityFilter; label: string }> = [
  { value: 'all', label: 'All priorities' },
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

function useOutsideClick(onOutside: () => void) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      const el = ref.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) onOutside();
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onOutside]);

  return ref;
}

function PriorityDropdown({
  value,
  onChange,
}: {
  value: PriorityFilter;
  onChange: (v: PriorityFilter) => void;
}) {
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const wrapRef = useOutsideClick(() => setOpen(false));
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const label = useMemo(() => {
    return PRIORITY_OPTIONS.find(o => o.value === value)?.label ?? 'All priorities';
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setOpen(true);
        setFocusedIndex(0);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => (prev + 1) % PRIORITY_OPTIONS.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => (prev - 1 + PRIORITY_OPTIONS.length) % PRIORITY_OPTIONS.length);
        break;
      case 'Home':
        e.preventDefault();
        setFocusedIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setFocusedIndex(PRIORITY_OPTIONS.length - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        onChange(PRIORITY_OPTIONS[focusedIndex].value);
        setOpen(false);
        break;
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        break;
    }
  };

  useEffect(() => {
    if (open && optionRefs.current[focusedIndex]) {
      optionRefs.current[focusedIndex]?.focus();
    }
  }, [open, focusedIndex]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        onKeyDown={handleKeyDown}
        className="bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none text-white/90 flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2f2f44]"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="priority-menu"
      >
        <span>{label}</span>
        <span className="text-white/60">▾</span>
      </button>

      {open && (
        <div
          id="priority-menu"
          role="listbox"
          aria-label="Priority filter options"
          className="absolute left-0 mt-2 w-full rounded-xl border border-white/10 bg-[#2f2f44] shadow-lg overflow-hidden z-50"
          onKeyDown={handleKeyDown}
        >
          {PRIORITY_OPTIONS.map((opt, idx) => (
            <button
              key={opt.value}
              ref={el => {
                optionRefs.current[idx] = el;
              }}
              type="button"
              role="option"
              aria-selected={value === opt.value}
              tabIndex={focusedIndex === idx ? 0 : -1}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              onMouseEnter={() => setFocusedIndex(idx)}
              className={[
                'w-full text-left px-3 py-2 text-sm',
                'text-white/90 hover:bg-white/10 transition',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30',
                value === opt.value ? 'bg-white/10' : '',
              ].join(' ')}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Column({
  col,
  tasks,
  onDropTask,
  children,
}: {
  col: (typeof COLUMNS)[number];
  tasks: TaskRow[];
  onDropTask: (taskId: string, newStatus: TaskStatus) => void;
  children: React.ReactNode;
}) {
  const dropRef = useRef<HTMLDivElement | null>(null);

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: DND_ITEM_TYPE,
      drop: (item: DragItem) => {
        void onDropTask(item.taskId, col.value);
      },
      collect: monitor => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [col.value, onDropTask],
  );

  drop(dropRef);

  const pts = sumStoryPoints(tasks);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className={['h-2 w-2 rounded-full', col.dotClass].join(' ')} />
          <span className="text-sm font-semibold text-white/90">{col.label}</span>
          <span className="text-xs text-white/60 rounded-full bg-white/10 px-2 py-0.5">
            {tasks.length}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-white/60">
          <span>{pts} pts</span>
        </div>
      </div>

      <div
        ref={dropRef}
        className={[
          'rounded-2xl border border-white/10 bg-white/5',
          'min-h-[68vh] p-3',
          isOver && canDrop ? 'ring-2 ring-white/20 border-white/20' : '',
        ].join(' ')}
      >
        <div className="flex flex-col gap-3">{children}</div>
      </div>
    </div>
  );
}

function DraggableTask({
  task,
  onClick,
  dragDisabled,
}: {
  task: TaskRow;
  onClick: (task: TaskRow) => void;
  dragDisabled: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const dragEndTimeRef = useRef<number>(0);

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: DND_ITEM_TYPE,
      item: { taskId: task.task_id } satisfies DragItem,
      canDrag: !dragDisabled,
      collect: monitor => ({ isDragging: monitor.isDragging() }),
      end: () => {
        dragEndTimeRef.current = Date.now();
      },
    }),
    [task.task_id, dragDisabled],
  );

  drag(ref);

  const handleClick = () => {
    const timeSinceDragEnd = Date.now() - dragEndTimeRef.current;
    // Ignore clicks within 200ms of drag end to prevent accidental modal opens
    if (timeSinceDragEnd < 200) return;
    onClick(task);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      aria-disabled={dragDisabled}
      className={[
        dragDisabled ? 'cursor-not-allowed opacity-70' : 'cursor-grab active:cursor-grabbing',
        isDragging ? 'opacity-60' : '',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2f2f44] rounded-2xl',
      ].join(' ')}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {/* Drag by grabbing the full card, no special handles needed. */}
      <TaskCard task={task} />
    </div>
  );
}

export default function BoardsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskRow | undefined>();
  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(0);

  const [query, setQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');

  // Keep a stable reference to the current tasks for lookups
  const tasksRef = useRef<TaskRow[]>([]);

  // Track in-flight saves to prevent refetch from overwriting optimistic updates
  const pendingSavesRef = useRef(0);

  // Track per-task in-flight updates to prevent concurrent drags of the same task
  const taskInFlightRef = useRef<Record<string, boolean>>({});
  const [taskInFlightState, setTaskInFlightState] = useState<Record<string, boolean>>({});

  // Track server-confirmed status per task for safe rollbacks
  // IMPORTANT: only update this from server responses (fetch/refetch), NOT from optimistic `tasks`.
  const lastConfirmedStatusRef = useRef<Record<string, TaskStatus>>({});

  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  const applyServerTasks = useCallback((data: TaskRow[]) => {
    setTasks(data);

    const statusMap: Record<string, TaskStatus> = {};
    data.forEach(t => {
      statusMap[t.task_id] = t.status;
    });
    lastConfirmedStatusRef.current = statusMap;
  }, []);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = (await getTasks({ projectId: PLACEHOLDER_PROJECT_ID })) ?? [];
      // Guard: only apply server results if no saves are pending to avoid clobbering optimistic updates
      if (pendingSavesRef.current === 0) {
        applyServerTasks(data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  }, [applyServerTasks]);

  useEffect(() => {
    void fetchTasks();
  }, [fetchTasks]);

  const filteredTasks = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks.filter(t => {
      const matchesQuery =
        q.length === 0 ||
        (t.title ?? '').toLowerCase().includes(q) ||
        (t.task_key ?? '').toLowerCase().includes(q);

      const matchesPriority = priorityFilter === 'all' ? true : t.priority === priorityFilter;

      return matchesQuery && matchesPriority;
    });
  }, [tasks, query, priorityFilter]);

  const tasksByStatus = useMemo(() => {
    const map = new Map<TaskStatus | string, TaskRow[]>();
    COLUMNS.forEach(c => map.set(c.value, []));

    // Create fallback for unexpected statuses
    const FALLBACK_STATUS = '__fallback__';
    map.set(FALLBACK_STATUS, []);

    for (const t of filteredTasks) {
      const arr = map.get(t.status);
      if (arr) arr.push(t);
      else {
        console.warn(`Unexpected task status: task_id=${t.task_id}, status=${t.status}`);
        map.get(FALLBACK_STATUS)?.push(t);
      }
    }

    // Merge fallback tasks into the first column before returning
    const fallbackTasks = map.get(FALLBACK_STATUS) || [];
    if (fallbackTasks.length > 0 && COLUMNS.length > 0) {
      const firstColumnKey = COLUMNS[0].value;
      map.get(firstColumnKey)?.push(...fallbackTasks);
      map.delete(FALLBACK_STATUS);
    }

    return map;
  }, [filteredTasks]);

  // Calculate progress based on filtered tasks to match the displayed task count
  const total = filteredTasks.length;
  const doneCount = filteredTasks.filter(t => t.status === 'done').length;
  const progress = total === 0 ? 0 : Math.round((doneCount / total) * 100);

  const setTaskInFlight = useCallback((taskId: string, inFlight: boolean) => {
    if (inFlight) taskInFlightRef.current[taskId] = true;
    else delete taskInFlightRef.current[taskId];

    // trigger rerender so draggable can be disabled
    setTaskInFlightState(prev => {
      const next = { ...prev };
      if (inFlight) next[taskId] = true;
      else delete next[taskId];
      return next;
    });
  }, []);

  const handleDropTask = useCallback(
    async (taskId: string, newStatus: TaskStatus) => {
      // Prevent concurrent drags of the same task
      if (taskInFlightRef.current[taskId]) {
        console.warn(`Task ${taskId} is already being updated, ignoring concurrent drag`);
        return;
      }

      const snapshot = tasksRef.current;
      const current = snapshot.find(t => t.task_id === taskId);
      if (!current) return;
      if (current.status === newStatus) return;

      // Lock this task
      setTaskInFlight(taskId, true);

      // Roll back to the last server-confirmed status (not an optimistic one)
      const confirmedStatus = lastConfirmedStatusRef.current[taskId] ?? current.status;

      // Optimistic update
      setTasks(prev =>
        prev.map(t => (t.task_id === taskId ? { ...t, status: newStatus } : t)),
      );

      pendingSavesRef.current += 1;
      setSaving(n => n + 1);
      setError(null);

      let updateSucceeded = false;

      try {
        await updateTask(taskId, { status: newStatus });
        updateSucceeded = true;
        // Update confirmed status immediately to reflect this successful change
        lastConfirmedStatusRef.current[taskId] = newStatus;
      } catch (err) {
        console.error(err);
        setError('Failed to update task.');
        // Rollback to last confirmed
        setTasks(prev =>
          prev.map(t => (t.task_id === taskId ? { ...t, status: confirmedStatus } : t)),
        );
      } finally {
        // Unlock
        setTaskInFlight(taskId, false);

        // Decrement counters safely
        pendingSavesRef.current = Math.max(0, pendingSavesRef.current - 1);
        setSaving(n => Math.max(0, n - 1));

        // Refetch only when this succeeded and nothing else is in-flight
        if (updateSucceeded && pendingSavesRef.current === 0) {
          try {
            const data = (await getTasks({ projectId: PLACEHOLDER_PROJECT_ID })) ?? [];
            // re-check after await to avoid clobbering new optimistic updates
            if (pendingSavesRef.current === 0) {
              applyServerTasks(data);
            }
          } catch (err) {
            console.error(err);
            setError('Failed to refresh tasks.');
          }
        }
      }
    },
    [applyServerTasks, setTaskInFlight],
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen px-6 py-6 bg-[#2f2f44] text-white">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center font-semibold">
                ||
              </div>
              <div>
                {/* TODO: Replace hardcoded project name and sprint details with dynamic data from project.name and sprint.start/sprint.end once project/sprint data is fetched */}
                <h1 className="text-lg font-semibold leading-tight">Project Alpha</h1>
                <p className="text-xs text-white/60">Sprint 4 · Feb 10 – Feb 24, 2026</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 min-w-[260px]">
            <div className="text-xs text-white/60">
              {doneCount}/{total} done
            </div>
            <div className="h-2 w-[220px] rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-violet-400" style={{ width: `${progress}%` }} />
            </div>

            <div className="text-xs text-white/60 rounded-lg bg-white/10 px-2 py-1">
              {filteredTasks.length} tasks
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full max-w-[520px]">
            <div className="flex items-center gap-2 bg-white/10 border border-white/10 rounded-xl px-3 py-2 w-full">
              <span className="text-white/50">⌕</span>
              <input
                id="search-tasks"
                aria-label="Search tasks"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search tasks…"
                className="bg-transparent outline-none text-sm w-full placeholder:text-white/40"
              />
            </div>

            <PriorityDropdown value={priorityFilter} onChange={setPriorityFilter} />
          </div>

          <CustomButton color="primary" onClick={() => setModalOpen(true)}>
            + Create Task
          </CustomButton>
        </div>

        {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
        {saving > 0 && <p className="mt-1 text-xs text-white/50">Saving…</p>}

        <div className="mt-6">
          {loading ? (
            <div className="text-white/60 text-sm">Loading…</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
              {COLUMNS.map(col => {
                const colTasks = tasksByStatus.get(col.value) ?? [];
                return (
                  <Column key={col.key} col={col} tasks={colTasks} onDropTask={handleDropTask}>
                    {colTasks.length === 0 ? (
                      <div className="text-xs text-white/40 px-1 py-2">Drop tasks here</div>
                    ) : (
                      colTasks.map(task => (
                        <DraggableTask
                          key={task.task_id}
                          task={task}
                          dragDisabled={!!taskInFlightState[task.task_id]}
                          onClick={t => {
                            setSelectedTask(t);
                            setModalOpen(true);
                          }}
                        />
                      ))
                    )}
                  </Column>
                );
              })}
            </div>
          )}
        </div>

        <TaskModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedTask(undefined);
          }}
          task={selectedTask}
          projectId={PLACEHOLDER_PROJECT_ID}
          onSuccess={() => void fetchTasks()}
        />
      </div>
    </DndProvider>
  );
}