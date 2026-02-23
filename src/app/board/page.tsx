'use client';

import { useCallback, useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import TaskModal from '@/components/modals-and-forms/tasks/TaskModal';
import CustomButton from '@/components/utils/buttons/CustomButton';
import TaskCard from '@/components/utils/card/Card';
import { getTasks } from '@/server/tasks/tasks';
import type { TaskRow } from '@/server/tasks/tasks';

// Seed project inserted by init.sql - will come from project context once that system is built
const PLACEHOLDER_PROJECT_ID = 'a0000000-0000-0000-0000-000000000001';

export default function BoardsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskRow | undefined>(undefined);
  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTasks({ projectId: PLACEHOLDER_PROJECT_ID });
      setTasks(data ?? []);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  function openCreate() {
    setSelectedTask(undefined);
    setModalOpen(true);
  }

  function openEdit(task: TaskRow) {
    setSelectedTask(task);
    setModalOpen(true);
  }

  function handleClose() {
    setModalOpen(false);
    setSelectedTask(undefined);
  }

  useEffect(() => {
    void fetchTasks();
  }, [fetchTasks]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-background p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Board</h1>
          <CustomButton color="primary" onClick={openCreate}>
            + Create Task
          </CustomButton>
        </div>

        {/* Task column */}
        {loading ? (
          <div className="flex flex-col gap-3 max-w-sm">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="h-28 rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800 animate-pulse"
              />
            ))}
          </div>
        ) : tasks?.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500">
            {error ? error : 'No tasks yet - create one to get started.'}
          </p>
        ) : (
          <div className="flex flex-col gap-3 max-w-sm">
            {tasks?.map(task => (
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              <TaskCard key={task.task_id} task={task} onClick={openEdit} />
            ))}
          </div>
        )}

        {/* Create / Update modal */}
        <TaskModal
          open={modalOpen}
          onClose={handleClose}
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
