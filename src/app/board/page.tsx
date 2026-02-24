'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import TaskModal from '@/components/modals-and-forms/tasks/TaskModal';
import CustomButton from '@/components/utils/buttons/CustomButton';
import TaskCard from '@/components/utils/card/Card';
import { deleteTask, getTasks, updateTask } from '@/server/tasks/tasks';
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
      drop: (item: DragItem) => onDropTask(item.taskId, col.value),
      collect: monitor => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [col.value, onDropTask],
  );

  // ✅ prijungiam drop prie realaus DOM ref
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
          <button
            type="button"
            className="h-6 w-6 rounded-md bg-white/10 hover:bg-white/15 text-white/70"
            title="Add"
            onClick={() => {}}
          >
            +
          </button>
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
  onDelete,
}: {
  task: TaskRow;
  onClick: (task: TaskRow) => void;
  onDelete: (taskId: string) => void;
}) {
  const previewRef = useRef<HTMLDivElement | null>(null);
  const dragHandleRef = useRef<HTMLDivElement | null>(null);

  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: DND_ITEM_TYPE,
      item: { taskId: task.task_id } satisfies DragItem,
      collect: monitor => ({ isDragging: monitor.isDragging() }),
    }),
    [task.task_id],
  );

  // ✅ prijungiam preview ir drag per ref
  preview(previewRef);
  drag(dragHandleRef);

  return (
    <div ref={previewRef} className={isDragging ? 'opacity-50' : ''}>
      <div className="relative">
        <div
          ref={dragHandleRef}
          className="absolute left-2 top-2 z-20 select-none cursor-grab active:cursor-grabbing text-white/40"
          title="Drag"
          onClick={(e) => e.stopPropagation()}
        >
          ⠿
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.task_id);
          }}
          className="absolute right-2 top-2 z-20 h-7 w-7 rounded-md bg-white/10 hover:bg-white/15 text-white/70"
          aria-label="Delete task"
          title="Delete"
        >
          ×
        </button>

        <div onClick={() => onClick(task)} className="cursor-pointer">
          <TaskCard task={task} onClick={onClick} />
        </div>
      </div>
    </div>
  );
}

export default function BoardsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskRow | undefined>();
  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [query, setQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'all' | TaskPriority>('all');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTasks({ projectId: PLACEHOLDER_PROJECT_ID });
      setTasks(data ?? []);
    } catch (err) {
      console.error(err);
      setError('Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  }, []);

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

      const matchesPriority =
        priorityFilter === 'all' ? true : (t.priority ?? 'medium') === priorityFilter;

      return matchesQuery && matchesPriority;
    });
  }, [tasks, query, priorityFilter]);

  const tasksByStatus = useMemo(() => {
    const map = new Map<TaskStatus, TaskRow[]>();
    COLUMNS.forEach(c => map.set(c.value, []));
    for (const t of filteredTasks) {
      const arr = map.get(t.status);
      if (arr) arr.push(t);
    }
    return map;
  }, [filteredTasks]);

  const total = tasks.length;
  const doneCount = tasks.filter(t => t.status === 'done').length;
  const progress = total === 0 ? 0 : Math.round((doneCount / total) * 100);

  const handleDropTask = useCallback(
    async (taskId: string, newStatus: TaskStatus) => {
      const current = tasks.find(t => t.task_id === taskId);
      if (!current) return;
      if (current.status === newStatus) return;

      setSaving(true);
      setError(null);
      try {
        await updateTask(taskId, { status: newStatus });
        await fetchTasks();
      } catch (err) {
        console.error(err);
        setError('Failed to update task.');
      } finally {
        setSaving(false);
      }
    },
    [tasks, fetchTasks],
  );

  const handleDelete = useCallback(
    async (taskId: string) => {
      setSaving(true);
      setError(null);
      try {
        await deleteTask(taskId);
        await fetchTasks();
      } catch (err) {
        console.error(err);
        setError('Failed to delete task.');
      } finally {
        setSaving(false);
      }
    },
    [fetchTasks],
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
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {['AC', 'JW', 'ED', 'LZ', 'SM'].map(x => (
                  <div
                    key={x}
                    className="h-7 w-7 rounded-full bg-white/15 border border-white/10 flex items-center justify-center text-[10px]"
                    title={x}
                  >
                    {x}
                  </div>
                ))}
                <div className="h-7 w-7 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-[10px]">
                  +1
                </div>
              </div>

              <div className="text-xs text-white/60 rounded-lg bg-white/10 px-2 py-1">
                {filteredTasks.length} tasks
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full max-w-[520px]">
            <div className="flex items-center gap-2 bg-white/10 border border-white/10 rounded-xl px-3 py-2 w-full">
              <span className="text-white/50">⌕</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tasks…"
                className="bg-transparent outline-none text-sm w-full placeholder:text-white/40"
              />
            </div>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none"
            >
              <option value="all">All priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <CustomButton color="primary" onClick={() => setModalOpen(true)}>
            + Create Task
          </CustomButton>
        </div>

        {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
        {saving && <p className="mt-1 text-xs text-white/50">Saving…</p>}

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
                          onClick={(t) => {
                            setSelectedTask(t);
                            setModalOpen(true);
                          }}
                          onDelete={handleDelete}
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