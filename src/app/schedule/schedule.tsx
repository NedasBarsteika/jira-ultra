import { ChevronLeft, ChevronRight, Plus, MapPin, Home, Palmtree } from 'lucide-react';
import { useState, useEffect } from 'react';

import { cn } from '../../components/utils';

// ─── Types & mock helpers ─────────────────────────────────────────────────────

type Status = 'Office' | 'Remote' | 'Vacation' | 'Off';

interface Shift {
  start: string; // "HH:MM"
  end: string;
  label: string;
  status: Status;
}

interface Employee {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  role: string;
  schedule: Record<string, Shift | null>;
}

interface TeamMember {
  id: string;
  name: string;
  role?: string | null;
}

interface Team {
  members?: TeamMember[];
}

interface AvailabilityEntry {
  availability: string;
  percentage: number;
  comment: string;
}

interface AvailabilityRow {
  user_id: string;
  pattern: Record<string, AvailabilityEntry>;
}

interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  teamId: string;
}

interface CapacityOptionsResponse {
  teams: Team[];
  sprints: Sprint[];
}

interface AvailabilityResponse {
  availabilities: AvailabilityRow[];
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const WEEK_DATES: Record<string, string> = {
  Mon: '16',
  Tue: '17',
  Wed: '18',
  Thu: '19',
  Fri: '20',
  Sat: '21',
  Sun: '22',
};

const STATUS_CONFIG: Record<
  Status,
  { bg: string; text: string; icon: React.ElementType | null; label: string }
> = {
  Office: { bg: '#60a5fa1a', text: '#60a5fa', icon: MapPin, label: 'Office' },
  Remote: { bg: '#22c55e1a', text: '#22c55e', icon: Home, label: 'Remote' },
  Vacation: { bg: '#f59e0b1a', text: '#f59e0b', icon: Palmtree, label: 'Vacation' },
  Off: { bg: '#3d38681a', text: '#6b7280', icon: null, label: 'Off' },
};

const MOCK_EMPLOYEES: Employee[] = [
  {
    id: '1',
    name: 'Alex Rivera',
    initials: 'AR',
    avatarColor: '#8b7cf7',
    role: 'Frontend Dev',
    schedule: {
      Mon: { start: '09:00', end: '17:00', label: 'Sprint work', status: 'Office' },
      Tue: { start: '09:00', end: '17:00', label: 'Sprint work', status: 'Office' },
      Wed: { start: '10:00', end: '18:00', label: 'Code review', status: 'Remote' },
      Thu: { start: '09:00', end: '17:00', label: 'Sprint work', status: 'Office' },
      Fri: { start: '09:00', end: '13:00', label: 'Half day', status: 'Remote' },
      Sat: null,
      Sun: null,
    },
  },
  {
    id: '2',
    name: 'Maya Chen',
    initials: 'MC',
    avatarColor: '#60a5fa',
    role: 'Backend Dev',
    schedule: {
      Mon: { start: '08:00', end: '16:00', label: 'API work', status: 'Remote' },
      Tue: null,
      Wed: { start: '08:00', end: '16:00', label: 'API work', status: 'Remote' },
      Thu: { start: '09:00', end: '17:00', label: 'Planning', status: 'Office' },
      Fri: { start: '09:00', end: '17:00', label: 'Deployment', status: 'Office' },
      Sat: null,
      Sun: null,
    },
  },
  {
    id: '3',
    name: 'Jordan Smith',
    initials: 'JS',
    avatarColor: '#22c55e',
    role: 'UX Designer',
    schedule: {
      Mon: { start: '09:00', end: '17:00', label: 'Design sprint', status: 'Office' },
      Tue: { start: '09:00', end: '17:00', label: 'Design sprint', status: 'Office' },
      Wed: { start: '10:00', end: '16:00', label: 'User testing', status: 'Office' },
      Thu: null,
      Fri: null,
      Sat: { start: '10:00', end: '14:00', label: 'Workshop', status: 'Office' },
      Sun: null,
    },
  },
  {
    id: '4',
    name: 'Priya Kapoor',
    initials: 'PK',
    avatarColor: '#f97316',
    role: 'Product Manager',
    schedule: {
      Mon: { start: '09:00', end: '17:00', label: 'Roadmap review', status: 'Office' },
      Tue: { start: '09:00', end: '17:00', label: 'Stakeholders', status: 'Office' },
      Wed: null,
      Thu: null,
      Fri: { start: '09:00', end: '17:00', label: 'Retro', status: 'Office' },
      Sat: null,
      Sun: null,
    },
  },
  {
    id: '5',
    name: "Liam O'Brien",
    initials: 'LO',
    avatarColor: '#e5395d',
    role: 'DevOps Engineer',
    schedule: {
      Mon: null,
      Tue: null,
      Wed: null,
      Thu: null,
      Fri: null,
      Sat: { start: '09:00', end: '17:00', label: 'On-call', status: 'Remote' },
      Sun: { start: '09:00', end: '17:00', label: 'On-call', status: 'Remote' },
    },
  },
  {
    id: '6',
    name: 'Sofia Torres',
    initials: 'ST',
    avatarColor: '#a78bfa',
    role: 'QA Engineer',
    schedule: {
      Mon: { start: '10:00', end: '18:00', label: 'Test cycles', status: 'Vacation' },
      Tue: { start: '10:00', end: '18:00', label: 'Vacation', status: 'Vacation' },
      Wed: { start: '10:00', end: '18:00', label: 'Vacation', status: 'Vacation' },
      Thu: { start: '10:00', end: '18:00', label: 'Vacation', status: 'Vacation' },
      Fri: { start: '10:00', end: '18:00', label: 'Vacation', status: 'Vacation' },
      Sat: null,
      Sun: null,
    },
  },
];

function getInitials(name: string) {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase();
}

function colorForString(str: string) {
  const colours = ['#8b7cf7', '#60a5fa', '#22c55e', '#f97316', '#e5395d', '#a78bfa'];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colours[Math.abs(hash) % colours.length];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Status }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  if (status === 'Off') return null;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] shrink-0"
      style={{ background: cfg.bg, color: cfg.text }}
    >
      {Icon && <Icon className="size-2.5" />}
      {cfg.label}
    </span>
  );
}

function ShiftCell({ shift }: { shift: Shift | null }) {
  if (!shift) {
    return (
      <div className="h-full min-h-[72px] flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-border" />
      </div>
    );
  }

  const cfg = STATUS_CONFIG[shift.status];

  return (
    <div
      className="rounded-lg p-2.5 flex flex-col gap-1 h-full min-h-[72px] border transition-all hover:brightness-110 cursor-default"
      style={{ background: cfg.bg, borderColor: `${cfg.text}33` }}
    >
      <div className="flex items-center justify-between gap-1">
        <span className="text-[11px] truncate" style={{ color: cfg.text }}>
          {shift.label}
        </span>
        <StatusBadge status={shift.status} />
      </div>
      <span className="text-[10px] text-muted-foreground">
        {shift.start} – {shift.end}
      </span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Schedule() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submittedUsers, setSubmittedUsers] = useState<Set<string>>(new Set());
  const [submittingUser, setSubmittingUser] = useState<string | null>(null);
  const [sprintId, setSprintId] = useState<string | null>(null);

  const makeEmptySchedule = (): Record<string, Shift | null> => {
    const obj: Record<string, Shift | null> = {};
    DAYS.forEach(d => (obj[d] = null));
    return obj;
  };

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/capacity/options');
        if (!res.ok) throw new Error(`status ${res.status}`);
        const data = (await res.json()) as CapacityOptionsResponse;

        let mems: Employee[] = [];
        data.teams.forEach(team => {
          (team.members ?? []).forEach((m: TeamMember) => {
            mems.push({
              id: m.id,
              name: m.name,
              initials: getInitials(m.name),
              avatarColor: colorForString(m.id),
              role: m.role ?? '',
              schedule: makeEmptySchedule(),
            });
          });
        });

        if (mems.length === 0) {
          console.warn(
            'no members returned from /api/capacity/options – falling back to mock data'
          );
          mems = MOCK_EMPLOYEES;
        }

        const sId = data.sprints?.[0]?.id;
        setSprintId(sId ?? null);

        if (sId) {
          try {
            const avRes = await fetch(
              `/api/capacity/availability?sprintId=${encodeURIComponent(sId)}`
            );
            if (avRes.ok) {
              const avData = (await avRes.json()) as AvailabilityResponse;
              const map: Record<string, Record<string, AvailabilityEntry>> = {};
              const submitted = new Set<string>();

              (avData.availabilities ?? []).forEach((a: AvailabilityRow) => {
                map[a.user_id] = a.pattern;
                submitted.add(a.user_id);
              });

              setSubmittedUsers(submitted);

              mems = mems.map(emp => {
                const pattern = map[emp.id];
                if (pattern) {
                  const schedule: Record<string, Shift | null> = {};
                  DAYS.forEach(day => {
                    const entry = pattern[day];
                    if (!entry) {
                      schedule[day] = null;
                    } else {
                      let status: Status = 'Off';
                      if (entry.availability === 'full') status = 'Office';
                      else if (entry.availability === 'half') status = 'Remote';
                      schedule[day] = {
                        start: '09:00',
                        end: '17:00',
                        label: entry.comment || '',
                        status,
                      };
                    }
                  });
                  return { ...emp, schedule };
                }
                return emp;
              });
            }
          } catch (e: unknown) {
            console.warn('failed to load availability data', e);
          }
        }

        setEmployees(mems);
      } catch (err: unknown) {
        console.error('failed to load team members', err);
        setEmployees(MOCK_EMPLOYEES);
      } finally {
        setIsLoading(false);
      }
    }

    void load();
  }, []);

  const submitAvailability = async (userId: string, emp: Employee) => {
    if (!sprintId || submittedUsers.has(userId)) return;
    setSubmittingUser(userId);

    const pattern: Record<string, { availability: string; percentage: number; comment: string }> =
      {};
    DAYS.forEach(day => {
      const shift = emp.schedule[day];
      if (!shift) {
        pattern[day] = { availability: 'off', percentage: 0, comment: '' };
      } else {
        let avail = 'off';
        if (shift.status === 'Office') avail = 'full';
        else if (shift.status === 'Remote') avail = 'half';
        pattern[day] = { availability: avail, percentage: 100, comment: shift.label };
      }
    });

    try {
      const res = await fetch('/api/capacity/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sprintId, userId, percentage: 100, pattern }),
      });
      if (res.ok) {
        setSubmittedUsers(prev => new Set(prev).add(userId));
      } else {
        const err = (await res.json()) as { error: string };
        console.error('failed to submit availability:', err);
      }
    } catch (e: unknown) {
      console.error('error submitting availability', e);
    } finally {
      setSubmittingUser(null);
    }
  };

  const weekLabel =
    weekOffset === 0
      ? 'Week of Feb 16, 2026'
      : weekOffset === 1
        ? 'Week of Feb 23, 2026'
        : weekOffset === -1
          ? 'Week of Feb 9, 2026'
          : `Week offset ${weekOffset > 0 ? '+' : ''}${weekOffset}`;

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        Loading team members...
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        No team members found. Make sure there are users assigned to a team in the database.
      </div>
    );
  }

  const totalOffice = employees.filter(e =>
    Object.values(e.schedule).some(s => s?.status === 'Office')
  ).length;
  const totalRemote = employees.filter(e =>
    Object.values(e.schedule).some(s => s?.status === 'Remote')
  ).length;
  const totalVacation = employees.filter(e =>
    Object.values(e.schedule).some(s => s?.status === 'Vacation')
  ).length;

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      {/* Header */}
      <div className="border-b border-border px-8 py-5 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-foreground">Team Schedule</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Weekly time planning across all employees.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#8b7cf7] hover:bg-[#7c6ef0] text-white text-sm transition-colors">
          <Plus className="size-4" />
          Add shift
        </button>
      </div>

      <div className="px-8 py-6 space-y-6">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'In Office', value: totalOffice, accent: '#60a5fa', icon: MapPin },
            { label: 'Remote', value: totalRemote, accent: '#22c55e', icon: Home },
            { label: 'On Vacation', value: totalVacation, accent: '#f59e0b', icon: Palmtree },
          ].map(({ label, value, accent, icon: Icon }) => (
            <div
              key={label}
              className="rounded-xl border border-border bg-card p-4 flex items-center gap-3"
            >
              <div
                className="size-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${accent}1a` }}
              >
                <Icon className="size-4" style={{ color: accent }} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-foreground" style={{ fontSize: '1.3rem', lineHeight: 1.2 }}>
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Week navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setWeekOffset(w => w - 1)}
              className="size-8 flex items-center justify-center rounded-lg border border-border hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="text-sm text-foreground px-2">{weekLabel}</span>
            <button
              onClick={() => setWeekOffset(w => w + 1)}
              className="size-8 flex items-center justify-center rounded-lg border border-border hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
          {weekOffset !== 0 && (
            <button
              onClick={() => setWeekOffset(0)}
              className="text-xs text-[#a78bfa] hover:underline"
            >
              Back to current week
            </button>
          )}

          {/* Legend */}
          <div className="flex items-center gap-3">
            {(['Office', 'Remote', 'Vacation'] as Status[]).map(s => {
              const cfg = STATUS_CONFIG[s];
              const Icon = cfg.icon!;
              return (
                <div key={s} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Icon className="size-3" style={{ color: cfg.text }} />
                  {cfg.label}
                </div>
              );
            })}
          </div>
        </div>

        {/* Calendar grid */}
        <div className="rounded-xl border border-border overflow-hidden">
          {/* Column headers */}
          <div
            className="grid border-b border-border bg-sidebar"
            style={{ gridTemplateColumns: '200px repeat(7, 1fr) 120px' }}
          >
            <div className="px-4 py-3 text-xs text-muted-foreground uppercase tracking-wide border-r border-border">
              Employee
            </div>
            {DAYS.map(day => {
              const isToday = day === 'Fri' && weekOffset === 0;
              return (
                <div
                  key={day}
                  className={cn(
                    'px-3 py-3 text-center border-r border-border last:border-r-0',
                    isToday && 'bg-[#8b7cf7]/5'
                  )}
                >
                  <p
                    className={cn(
                      'text-xs uppercase tracking-wide',
                      isToday ? 'text-[#a78bfa]' : 'text-muted-foreground'
                    )}
                  >
                    {day}
                  </p>
                  <p
                    className={cn('text-sm mt-0.5', isToday ? 'text-[#8b7cf7]' : 'text-foreground')}
                  >
                    {WEEK_DATES[day]}
                  </p>
                  {isToday && <div className="size-1 rounded-full bg-[#8b7cf7] mx-auto mt-1" />}
                </div>
              );
            })}
            <div className="px-3 py-3 text-xs text-muted-foreground uppercase tracking-wide">
              Action
            </div>
          </div>

          {/* Employee rows */}
          {employees.map((emp, idx) => (
            <div
              key={emp.id}
              className={cn(
                'grid hover:bg-accent/20 transition-colors',
                idx !== employees.length - 1 && 'border-b border-border'
              )}
              style={{ gridTemplateColumns: '200px repeat(7, 1fr) 120px' }}
            >
              {/* Employee info */}
              <div className="px-4 py-3 flex items-center gap-2.5 border-r border-border">
                <div
                  className="size-8 rounded-full flex items-center justify-center text-xs text-white shrink-0"
                  style={{ background: emp.avatarColor }}
                >
                  {emp.initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-foreground truncate">{emp.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{emp.role}</p>
                </div>
              </div>

              {/* Day cells */}
              {DAYS.map(day => {
                const isToday = day === 'Fri' && weekOffset === 0;
                return (
                  <div
                    key={day}
                    className={cn(
                      'p-2 border-r border-border last:border-r-0',
                      isToday && 'bg-[#8b7cf7]/[0.03]'
                    )}
                  >
                    <ShiftCell shift={emp.schedule[day] ?? null} />
                  </div>
                );
              })}

              {/* Action cell */}
              <div className="p-2 flex items-center justify-center">
                {submittedUsers.has(emp.id) ? (
                  <span className="text-xs font-medium text-gray-400 cursor-not-allowed">
                    Approved
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      void submitAvailability(emp.id, emp);
                    }}
                    disabled={submittingUser === emp.id}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      submittingUser === emp.id
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {submittingUser === emp.id ? 'Submitting...' : 'Submit'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-xs text-muted-foreground text-right">
          All times in local timezone · Today is highlighted in purple
        </p>
      </div>
    </div>
  );
}
