'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import TaskModal from '@/components/modals-and-forms/tasks/TaskModal';
import CustomButton from '@/components/utils/buttons/CustomButton';
import TaskCard from '@/components/utils/card/Card';
import { deleteTask, getTasks, updateTask } from '@/server/tasks/tasks';
import type { TaskRow } from '@/server/tasks/tasks';
import type { TaskStatus } from '@/types/db';

// Įdėk jūsų realų project_id (iš DB project.project_id), jei ne a000...
const PLACEHOLDER_PROJECT_ID = 'a0000000-0000-0000-0000-000000000001';

const DND_ITEM_TYPE = 'TASK';

const COLUMNS: Array<{ key: string; label: string; value: TaskStatus }> = [
  { key: 'to_do', label: 'To do', value: 'to_do' },
  { key: 'in_progress', label: 'In progress', value: 'in_progress' },
  { key: 'test', label: 'Test', value: 'test' },
  { key: 'review', label: 'Review', value: 'review' },
  { key: 'done', label: 'Done', value: 'done' },
];

type DragItem = { taskId: string };

function Column({
  label,
  status,
  tasks,
  onDropTask,
  children,
}: {
  label: string;
  status: TaskStatus;
  tasks: TaskRow[];
  onDropTask: (taskId: string, newStatus: TaskStatus) => void;
  children: React.ReactNode;
}) {
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: DND_ITEM_TYPE,
      drop: (item: DragItem) => onDropTask(item.taskId, status),
      collect: monitor => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [status, onDropTask],
  );

  return (
    <div
      ref={(node) => {
        drop(node); // leidžiam ir null
      }}
      className={[
        'rounded-2xl border p-3 min-h-[70vh] bg-white/50 dark:bg-black/20 transition-colors',
        isOver && canDrop
          ? 'border-gray-400 dark:border-gray-500'
          : 'border-gray-200 dark:border-gray-800',
      ].join(' ')}
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">{label}</h2>
        <span className="text-xs text-gray-500 dark:text-gray-400">{tasks.length}</span>
      </div>

      <div className="flex flex-col gap-3">{children}</div>
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
  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: DND_ITEM_TYPE,
      item: { taskId: task.task_id } satisfies DragItem,
      collect: monitor => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [task.task_id],
  );

  return (
    <div
      ref={(node) => {
        preview(node);
      }}
      className={isDragging ? 'opacity-50' : ''}
    >
      <div className="relative">
        {/* Drag handle – kad TaskCard vidiniai click'ai/elementai nesugadintų drag */}
        <div
          ref={(node) => {
            drag(node);
          }}
          className="absolute left-2 top-2 z-20 select-none cursor-grab active:cursor-grabbing text-gray-400"
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
          className="absolute right-2 top-2 z-20 rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 hover:bg-gray-50
                     dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          aria-label="Delete task"
          title="Delete"
        >
          ✕
        </button>

        {/* Atidarymas edit */}
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

  const tasksByStatus = useMemo(() => {
    const map = new Map<TaskStatus, TaskRow[]>();
    COLUMNS.forEach(col => map.set(col.value, []));
    for (const t of tasks) {
      const list = map.get(t.status);
      if (list) list.push(t);
    }
    return map;
  }, [tasks]);

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
      <div className="min-h-screen bg-background p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Board</h1>
            {error && <p className="text-sm text-red-500">{error}</p>}
            {saving && <p className="text-xs text-gray-400">Saving...</p>}
          </div>

          <CustomButton color="primary" onClick={() => setModalOpen(true)}>
            + Create Task
          </CustomButton>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
            {COLUMNS.map(col => {
              const colTasks = tasksByStatus.get(col.value) ?? [];
              return (
                <Column
                  key={col.key}
                  label={col.label}
                  status={col.value}
                  tasks={colTasks}
                  onDropTask={handleDropTask}
                >
                  {colTasks.length === 0 ? (
                    <p className="text-xs text-gray-400 dark:text-gray-500">Drop tasks here</p>
                  ) : (
                    colTasks.map(task => (
                      <DraggableTask
                        key={task.task_id} // ✅ visada unikalus
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

        <TaskModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedTask(undefined);
          }}
          task={selectedTask}
          projectId={PLACEHOLDER_PROJECT_ID}
          onSuccess={() => {
            void fetchTasks();
          }}
        />
      </div>
    </DndProvider>
  );
}