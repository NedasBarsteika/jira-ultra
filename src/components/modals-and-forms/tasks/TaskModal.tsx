'use client';

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Chip from '@mui/material/Chip';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as yup from 'yup';

import DatePicker from '@/components/utils/date-pickers/DatePicker';
import Modal from '@/components/utils/modals/Modal';
import { useToast } from '@/components/utils/toast/ToastProvider';
import { ALL_TAGS } from '@/config/constants';
import { createTask, deleteTask, updateTask } from '@/server/tasks/tasks';
import type { TaskRow } from '@/server/tasks/tasks';
import { getAssigneesForProject } from '@/server/users/users';

// ── Placeholders (replace once auth + project membership are implemented) ──────

// reporter_id / sprint_id / backlog_id will be null until real auth + project context are wired in.
const PLACEHOLDER_REPORTER_ID = 'c0000000-0000-0000-0000-000000000001';
const PLACEHOLDER_SPRINT_ID = null;
const PLACEHOLDER_BACKLOG_ID = null;

// ── Props ─────────────────────────────────────────────────────────────────────

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  /** Provide to switch to update mode and pre-fill the form. */
  task?: TaskRow;
  /** Required when creating (no task provided). If not provided in update mode, will use task.projectId */
  projectId?: string;
  onSuccess?: () => void;
}

// ── Form state ────────────────────────────────────────────────────────────────

interface FormState {
  title: string;
  description: string;
  priority: string;
  task_type: string;
  story_points: string;
  tags: string[];
  due_date: Date | null;
  assignee_id: string;
  estimated_hours: string;
}

type AssigneeOption = { id: string; name: string };

const emptyForm: FormState = {
  title: '',
  description: '',
  priority: 'medium',
  task_type: 'task',
  story_points: '',
  tags: [],
  due_date: null,
  assignee_id: '',
  estimated_hours: '',
};

function taskToForm(task: TaskRow): FormState {
  return {
    title: task?.title,
    description: task?.description ?? '',
    priority: task?.priority ?? 'medium',
    task_type: task?.taskType ?? 'task',
    story_points: task?.storyPoints?.toString() ?? '',
    tags: task?.tags ?? [],
    due_date: task?.dueDate ? new Date(task?.dueDate as unknown as string) : null,
    assignee_id: task?.assigneeId ?? '',
    estimated_hours: task?.estimatedHours?.toString() ?? '',
  };
}

// ── Validation ────────────────────────────────────────────────────────────────

const taskSchema = yup.object({
  title: yup
    .string()
    .trim()
    .required('Title is required')
    .min(3, 'At least 3 characters')
    .max(500, 'At most 500 characters'),
  description: yup.string().trim().max(2000, 'Description is too long').optional(),
  priority: yup
    .string()
    .oneOf(['low', 'medium', 'high', 'critical'], 'Invalid priority')
    .required('Priority is required'),
  task_type: yup
    .string()
    .oneOf(['task', 'bug', 'story', 'epic'], 'Invalid type')
    .required('Type is required'),
  story_points: yup
    .string()
    .optional()
    .test('valid-points', 'Must be a whole number between 0–999', value => {
      if (!value || value === '') return true;
      const n = Number(value);
      return Number.isInteger(n) && n >= 0 && n <= 999;
    }),
  estimated_hours: yup
    .string()
    .optional()
    .test('valid-hours', 'Must be a number between 0–9999', value => {
      if (!value || value === '') return true;
      const n = Number(value);
      return !isNaN(n) && n >= 0 && n <= 9999;
    }),
});

type FieldErrors = Partial<Record<keyof Omit<FormState, 'tags' | 'due_date'>, string>>;

// ── Styles ────────────────────────────────────────────────────────────────────

const inputClasses =
  'block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 shadow-sm transition-colors placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400';

const inputErrorClasses =
  'block w-full rounded-lg border border-red-500 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 shadow-sm transition-colors placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white dark:border-red-500 dark:placeholder-gray-400';

const labelClasses = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';

// ── Component ─────────────────────────────────────────────────────────────────

export default function TaskModal({ open, onClose, task, projectId, onSuccess }: TaskModalProps) {
  const toast = useToast();
  const isUpdate = !!task;

  const resolvedProjectId = useMemo(() => {
    return projectId ?? task?.projectId ?? undefined;
  }, [projectId, task?.projectId]);

  const [form, setForm] = useState<FormState>(task ? taskToForm(task) : emptyForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const [assignees, setAssignees] = useState<AssigneeOption[]>([{ id: '', name: 'Unassigned' }]);
  const [assigneesLoading, setAssigneesLoading] = useState(false);

  // ✅ Ref tam, kad useEffect nereikėtų priklausyti nuo form.assignee_id (ir neliktų eslint warning)
  const assigneeIdRef = useRef<string>('');

  useEffect(() => {
    const nextForm = task ? taskToForm(task) : emptyForm;
    setForm(nextForm);
    assigneeIdRef.current = nextForm.assignee_id ?? '';
    setErrors({});
    setConfirmingDelete(false);
  }, [task, open]);

  useEffect(() => {
    let cancelled = false;

    async function loadAssignees() {
      if (!open) return;

      // reset kiekvieną kartą atidarius
      setAssigneesLoading(true);

      if (!resolvedProjectId) {
        setAssignees([{ id: '', name: 'Unassigned' }]);
        setAssigneesLoading(false);
        return;
      }

      try {
        const list = await getAssigneesForProject(resolvedProjectId);
        if (cancelled) return;

        const withUnassigned: AssigneeOption[] = [{ id: '', name: 'Unassigned' }, ...(list ?? [])];
        setAssignees(withUnassigned);

        // jei dabartinis assignee_id neegzistuoja sąraše — permetam į Unassigned
        const current = assigneeIdRef.current ?? '';
        if (current && !withUnassigned.some(a => a.id === current)) {
          assigneeIdRef.current = '';
          setForm(prev => ({ ...prev, assignee_id: '' }));
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setAssignees([{ id: '', name: 'Unassigned' }]);
        }
      } finally {
        if (!cancelled) setAssigneesLoading(false);
      }
    }

    void loadAssignees();

    return () => {
      cancelled = true;
    };
  }, [open, resolvedProjectId]);

  function update(field: keyof Omit<FormState, 'tags' | 'due_date'>, value: string) {
    if (field === 'assignee_id') assigneeIdRef.current = value;

    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  function toggleTag(tag: string) {
    setForm(prev => ({
      ...prev,
      tags: prev?.tags?.includes(tag)
        ? prev?.tags?.filter(t => t !== tag)
        : [...(prev?.tags ?? []), tag],
    }));
  }

  async function handleSubmit() {
    try {
      const validated = await taskSchema.validate(form, { abortEarly: false });
      setErrors({});
      setLoading(true);

      try {
        const editableFields: Partial<TaskRow> = {
          title: validated?.title,
          description: validated?.description?.trim() || null,
          priority: validated?.priority,
          taskType: validated?.task_type,
          storyPoints: validated?.story_points ? parseInt(validated?.story_points, 10) : null,
          tags: (form?.tags?.length ?? 0) > 0 ? form?.tags : null,
          dueDate: form?.due_date?.toISOString().split('T')[0] ?? null,
          assigneeId: form?.assignee_id || null,
          estimatedHours: validated?.estimated_hours
            ? parseFloat(validated?.estimated_hours).toString()
            : null,
        };

        if (isUpdate) {
          await updateTask(task?.taskId, editableFields);
          toast.success('Task updated successfully');
        } else {
          if (!resolvedProjectId) {
            toast.error('Project ID is required to create a task.');
            return;
          }
          await createTask({
            projectId: resolvedProjectId,
            ...editableFields,
            title: validated?.title,
            reporterId: PLACEHOLDER_REPORTER_ID,
            sprintId: PLACEHOLDER_SPRINT_ID,
            backlogId: PLACEHOLDER_BACKLOG_ID,
          });
          toast.success('Task created successfully');
        }

        setForm(emptyForm);
        assigneeIdRef.current = '';
        onSuccess?.();
        onClose();
      } catch {
        toast.error(
          isUpdate
            ? 'Failed to update task. Please try again.'
            : 'Failed to create task. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const fieldErrors: FieldErrors = {};
        for (const inner of err?.inner ?? []) {
          if (inner?.path && !fieldErrors[inner?.path as keyof FieldErrors]) {
            fieldErrors[inner?.path as keyof FieldErrors] = inner?.message;
          }
        }
        setErrors(fieldErrors);
      }
    }
  }

  async function handleDelete() {
    if (!task || !task?.taskId) return;
    setDeleting(true);
    try {
      await deleteTask(task?.taskId);
      toast.success('Task deleted');
      onSuccess?.();
      onClose();
    } catch {
      toast.error('Failed to delete task. Please try again.');
    } finally {
      setDeleting(false);
    }
  }

  function handleClose() {
    const nextForm = task ? taskToForm(task) : emptyForm;
    setForm(nextForm);
    assigneeIdRef.current = nextForm.assignee_id ?? '';
    setErrors({});
    setConfirmingDelete(false);
    onClose();
  }

  const deleteButton = isUpdate ? (
    confirmingDelete ? (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">Are you sure?</span>
        <button
          type="button"
          onClick={() => {
            void handleDelete();
          }}
          disabled={deleting}
          className="text-sm font-medium text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {deleting ? 'Deleting…' : 'Yes, delete'}
        </button>
        <span className="text-gray-300 dark:text-gray-600">·</span>
        <button
          type="button"
          onClick={() => setConfirmingDelete(false)}
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors cursor-pointer"
        >
          Cancel
        </button>
      </div>
    ) : (
      <button
        type="button"
        onClick={() => setConfirmingDelete(true)}
        className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors cursor-pointer"
      >
        <DeleteOutlineIcon sx={{ fontSize: 18 }} />
        Delete task
      </button>
    )
  ) : undefined;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isUpdate ? 'Update Task' : 'Create Task'}
      submitLabel={isUpdate ? 'Save' : 'Create'}
      onSubmit={() => {
        void handleSubmit();
      }}
      submitLoading={loading}
      size="lg"
      footerLeft={deleteButton}
    >
      <div className="flex flex-col gap-4">
        {/* Title */}
        <div>
          <label htmlFor="task-title" className={labelClasses}>
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="task-title"
            type="text"
            className={errors.title ? inputErrorClasses : inputClasses}
            placeholder="Enter task title"
            value={form.title}
            onChange={e => update('title', e.target.value)}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className={labelClasses}>Description</label>
          <textarea
            className={`${errors.description ? inputErrorClasses : inputClasses} resize-none`}
            rows={3}
            placeholder="Describe the task..."
            value={form.description}
            onChange={e => update('description', e.target.value)}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
          )}
        </div>

        {/* Priority + Type */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClasses}>Priority</label>
            <select
              className={`${errors.priority ? inputErrorClasses : inputClasses} cursor-pointer`}
              value={form.priority}
              onChange={e => update('priority', e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
            {errors.priority && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.priority}</p>
            )}
          </div>

          <div>
            <label className={labelClasses}>Type</label>
            <select
              className={`${errors.task_type ? inputErrorClasses : inputClasses} cursor-pointer`}
              value={form.task_type}
              onChange={e => update('task_type', e.target.value)}
            >
              <option value="task">Task</option>
              <option value="bug">Bug</option>
              <option value="story">Story</option>
              <option value="epic">Epic</option>
            </select>
            {errors.task_type && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.task_type}</p>
            )}
          </div>
        </div>

        {/* Assignee + Due date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClasses}>
              Assignee{' '}
              {assigneesLoading ? <span className="text-xs opacity-70">(loading…)</span> : null}
            </label>
            <select
              className={`${inputClasses} cursor-pointer`}
              value={form.assignee_id}
              onChange={e => update('assignee_id', e.target.value)}
              disabled={assigneesLoading}
            >
              {assignees.map(u => (
                <option key={u.id || 'unassigned'} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <DatePicker
              label="Due Date"
              placeholder="Select date"
              value={form.due_date}
              onChange={date => setForm(prev => ({ ...prev, due_date: date }))}
              fullWidth
            />
          </div>
        </div>

        {/* Story Points + Estimated Hours */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClasses}>Story Points</label>
            <input
              type="number"
              min={0}
              max={999}
              className={errors.story_points ? inputErrorClasses : inputClasses}
              placeholder="e.g. 3"
              value={form.story_points}
              onChange={e => update('story_points', e.target.value)}
            />
            {errors.story_points && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.story_points}</p>
            )}
          </div>

          <div>
            <label className={labelClasses}>Estimated Hours</label>
            <input
              type="number"
              min={0}
              max={9999}
              step={0.5}
              className={errors.estimated_hours ? inputErrorClasses : inputClasses}
              placeholder="e.g. 4"
              value={form.estimated_hours}
              onChange={e => update('estimated_hours', e.target.value)}
            />
            {errors.estimated_hours && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.estimated_hours}
              </p>
            )}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className={labelClasses}>Tags</label>
          <div className="flex flex-wrap gap-1.5 p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 min-h-[44px]">
            {ALL_TAGS.map(tag => {
              const selected = form?.tags?.includes(tag);
              return (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  onClick={() => toggleTag(tag)}
                  variant={selected ? 'filled' : 'outlined'}
                  color={selected ? 'primary' : 'default'}
                  sx={{ cursor: 'pointer', fontSize: '11px' }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
}
