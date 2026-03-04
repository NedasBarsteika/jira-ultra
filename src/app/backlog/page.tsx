'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import TaskModal from '@/components/modals-and-forms/tasks/TaskModal';
import CustomButton from '@/components/utils/buttons/CustomButton';
import AppTable from '@/components/utils/table/AppTable';
import type { AppTableColumn } from '@/components/utils/table/AppTable';
import { getTasks } from '@/server/tasks/tasks';
import type { TaskRow } from '@/server/tasks/tasks';
import { getAssigneesForProject } from '@/server/users/users';
import type { AssigneeOption } from '@/server/users/users';

const PLACEHOLDER_PROJECT_ID = 'a0000000-0000-0000-0000-000000000001';

// ✅ NEBEimportuojam TaskPriority, nes pas tave jis lint'e laikomas `string` ir užgožia union'us
type TaskPriorityValue = 'critical' | 'high' | 'medium' | 'low';
type PriorityFilter = 'all' | TaskPriorityValue;

// AssigneeFilter negali būti `'all' | 'unassigned' | string` nes `string` užgožia viską
type AssigneeId = string & { readonly __brand: 'AssigneeId' };
type AssigneeFilter = 'all' | 'unassigned' | AssigneeId;

const PRIORITY_OPTIONS: Array<{ value: PriorityFilter; label: string }> = [
  { value: 'all', label: 'All priorities' },
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

function formatDate(value: unknown): string {
  if (!value) return '-';
  if (typeof value === 'string') return value;
  if (value instanceof Date) return value.toISOString().split('T')[0];
  return '-';
}

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

function PriorityPill({ value }: { value: TaskPriorityValue | null | undefined }) {
  const v: TaskPriorityValue = value ?? 'medium';

  const cls =
    v === 'critical'
      ? 'bg-red-500/15 text-red-200 border border-red-400/20'
      : v === 'high'
        ? 'bg-amber-500/15 text-amber-200 border border-amber-400/20'
        : v === 'medium'
          ? 'bg-sky-500/15 text-sky-200 border border-sky-400/20'
          : 'bg-slate-500/15 text-slate-200 border border-slate-400/20';

  const label = v.charAt(0).toUpperCase() + v.slice(1);

  return (
    <span className={['inline-flex items-center px-2 py-0.5 rounded-full text-xs', cls].join(' ')}>
      {label}
    </span>
  );
}

function Dropdown<T extends string>({
  valueLabel,
  options,
  value,
  onChange,
  widthClass = 'w-[150px]',
}: {
  valueLabel: string;
  options: Array<{ value: T; label: string }>;
  value: T;
  onChange: (v: T) => void;
  widthClass?: string;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useOutsideClick(() => setOpen(false));

  const buttonLabel = options.find(o => o.value === value)?.label ?? valueLabel;

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={[
          'bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none',
          'text-white/90 flex items-center justify-between gap-2',
          widthClass,
        ].join(' ')}
      >
        <span>{buttonLabel}</span>
        <span className="text-white/60">▾</span>
      </button>

      {open && (
        <div
          className={[
            'absolute left-0 mt-2 rounded-xl border border-white/10',
            'bg-[#2f2f44] shadow-lg overflow-hidden z-50',
            widthClass,
          ].join(' ')}
        >
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm text-white/90 hover:bg-white/10 transition"
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function isAssigneeId(v: AssigneeFilter): v is AssigneeId {
  return v !== 'all' && v !== 'unassigned';
}

function normalizePriority(p: TaskRow['priority']): TaskPriorityValue {
  // TaskRow['priority'] pas tave gali būti `string | null`, todėl normalizuojam į mūsų union
  switch (p) {
    case 'critical':
    case 'high':
    case 'medium':
    case 'low':
      return p;
    default:
      return 'medium';
  }
}

export default function BacklogPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskRow | undefined>();

  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');

  const [assignees, setAssignees] = useState<AssigneeOption[]>([]);
  const [assigneeFilter, setAssigneeFilter] = useState<AssigneeFilter>('all');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTasks({ projectId: PLACEHOLDER_PROJECT_ID });
      setTasks(data ?? []);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAssignees = useCallback(async () => {
    try {
      const data = await getAssigneesForProject(PLACEHOLDER_PROJECT_ID);
      setAssignees(data ?? []);
    } catch (error) {
      console.error('Failed to fetch assignees:', error);
      setAssignees([]);
    }
  }, []);

  useEffect(() => {
    void fetchTasks();
    void fetchAssignees();
  }, [fetchTasks, fetchAssignees]);

  const assigneeNameById = useMemo(() => {
    const map = new Map<string, string>();
    assignees.forEach(a => map.set(a.id, a.name));
    return map;
  }, [assignees]);

  const assigneeOptions = useMemo<Array<{ value: AssigneeFilter; label: string }>>(() => {
    return [
      { value: 'all', label: 'All assignees' },
      { value: 'unassigned', label: 'Unassigned' },
      // ✅ čia svarbiausia: a.id (string) paverčiam į AssigneeId
      ...assignees.map(a => ({ value: a.id as AssigneeId, label: a.name })),
    ];
  }, [assignees]);

  const filteredTasks = useMemo(() => {
    const q = query.trim().toLowerCase();

    return tasks.filter(t => {
      const title = (t.title ?? '').toLowerCase();
      const key = (t.taskKey ?? '').toLowerCase();

      const matchesQuery = q.length === 0 || title.includes(q) || key.includes(q);

      const taskPriority = normalizePriority(t.priority);
      const matchesPriority = priorityFilter === 'all' ? true : taskPriority === priorityFilter;

      const matchesAssignee =
        assigneeFilter === 'all'
          ? true
          : assigneeFilter === 'unassigned'
            ? !t.assigneeId
            : isAssigneeId(assigneeFilter)
              ? t.assigneeId === assigneeFilter
              : true;

      return matchesQuery && matchesPriority && matchesAssignee;
    });
  }, [tasks, query, priorityFilter, assigneeFilter]);

  const columns = useMemo<AppTableColumn<TaskRow>[]>(() => {
    const priorityRank: Record<TaskPriorityValue, number> = {
      critical: 4,
      high: 3,
      medium: 2,
      low: 1,
    };

    return [
      {
        key: 'taskKey',
        header: 'Key',
        sortable: true,
        getValue: row => row.taskKey ?? '',
        render: row => <span className="text-white/80">{row.taskKey ?? '-'}</span>,
        width: 120,
      },
      {
        key: 'title',
        header: 'Title',
        sortable: true,
        getValue: row => row.title ?? '',
        render: row => <span className="text-white/90">{row.title ?? '-'}</span>,
      },
      {
        key: 'priority',
        header: 'Priority',
        sortable: true,
        getValue: row => priorityRank[normalizePriority(row.priority)],
        render: row => <PriorityPill value={normalizePriority(row.priority)} />,
        width: 140,
      },
      {
        key: 'tags',
        header: 'Tags',
        sortable: false,
        render: row => {
          const tags = row.tags ?? [];
          return (
            <div className="flex gap-2">
              {tags.slice(0, 3).map(t => (
                <span
                  key={t}
                  className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/80"
                >
                  {t}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                  +{tags.length - 3}
                </span>
              )}
            </div>
          );
        },
      },
      {
        key: 'assigneeId',
        header: 'Assignee',
        sortable: true,
        getValue: row => (row.assigneeId ? (assigneeNameById.get(row.assigneeId) ?? '') : ''),
        render: row => {
          const name = row.assigneeId ? assigneeNameById.get(row.assigneeId) : 'Unassigned';
          return <span className="text-white/80">{name ?? 'Unassigned'}</span>;
        },
        width: 200,
      },
      {
        key: 'storyPoints',
        header: 'Points',
        sortable: true,
        getValue: row => row.storyPoints ?? 0,
        render: row => <span className="text-white/80">{row.storyPoints ?? '-'}</span>,
        width: 100,
      },
      {
        key: 'dueDate',
        header: 'Due Date',
        sortable: true,
        getValue: row => (typeof row.dueDate === 'string' ? row.dueDate : ''),
        render: row => <span className="text-white/70">{formatDate(row.dueDate)}</span>,
        width: 150,
      },
    ];
  }, [assigneeNameById]);

  return (
    <div className="min-h-screen px-6 py-6 bg-[#2f2f44] text-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold">Product Backlog</h1>

        <CustomButton
          color="primary"
          onClick={() => {
            setSelectedTask(undefined);
            setModalOpen(true);
          }}
        >
          + New Task
        </CustomButton>
      </div>

      <div className="flex gap-3 mb-5">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search backlog..."
          className="bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-sm w-[300px]"
        />

        <Dropdown<PriorityFilter>
          valueLabel="All priorities"
          options={PRIORITY_OPTIONS}
          value={priorityFilter}
          onChange={setPriorityFilter}
        />

        <Dropdown<AssigneeFilter>
          valueLabel="All assignees"
          options={assigneeOptions}
          value={assigneeFilter}
          onChange={setAssigneeFilter}
          widthClass="w-[170px]"
        />
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <AppTable<TaskRow>
            columns={columns}
            rows={filteredTasks}
            getRowKey={row => row.taskId}
            defaultSortKey="priority"
            defaultSortDir="desc"
            rowsPerPageOptions={[5, 10, 25]}
            defaultRowsPerPage={10}
            onRowClick={row => {
              setSelectedTask(row);
              setModalOpen(true);
            }}
          />
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
        onSuccess={() => void fetchTasks()}
      />
    </div>
  );
}
