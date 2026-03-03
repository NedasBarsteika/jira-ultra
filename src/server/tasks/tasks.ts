'use server';

import { and, eq, isNull, sql } from 'drizzle-orm';

import { db } from '@/lib/db';

import { project, task } from '../../../database/schema';

export type TaskRow = typeof task.$inferSelect;
export type NewTask = typeof task.$inferInsert;
export type TaskUpdate = Partial<NewTask>;
export type TaskStatus = TaskRow['status'];
export type TaskPriority = TaskRow['priority'];

export async function getTask(id: string): Promise<TaskRow | undefined> {
  if (!db) throw new Error('Database connection not initialized');
  const result = await db
    .select()
    .from(task)
    .where(and(eq(task.taskId, id), isNull(task.deletedAt)))
    .limit(1);

  return result[0];
}

export async function getTasks(filters?: {
  projectId?: string;
  sprintId?: string;
  backlogId?: string;
  assigneeId?: string;
  status?: TaskStatus;
}): Promise<TaskRow[]> {
  if (!db) throw new Error('Database connection not initialized');
  const conditions = [isNull(task.deletedAt)];

  if (filters?.projectId) conditions.push(eq(task.projectId, filters.projectId));
  if (filters?.sprintId) conditions.push(eq(task.sprintId, filters.sprintId));
  if (filters?.backlogId) conditions.push(eq(task.backlogId, filters.backlogId));
  if (filters?.assigneeId) conditions.push(eq(task.assigneeId, filters.assigneeId));
  if (filters?.status) conditions.push(eq(task.status, filters.status));

  return db
    .select()
    .from(task)
    .where(and(...conditions));
}

export async function createTask(input: Omit<NewTask, 'taskKey'>): Promise<TaskRow> {
  if (!db) throw new Error('Database connection not initialized');
  return db.transaction(async trx => {
    const [updatedProject] = await trx
      .update(project)
      .set({ taskCounter: sql`${project.taskCounter} + 1` })
      .where(eq(project.projectId, input.projectId))
      .returning({ key: project.key, taskCounter: project.taskCounter });

    if (!updatedProject) throw new Error('Project not found');

    const [newTask] = await trx
      .insert(task)
      .values({ ...input, taskKey: `${updatedProject.key}-${updatedProject.taskCounter}` })
      .returning();

    if (!newTask) throw new Error('Failed to create task');
    return newTask;
  });
}

type SafeTaskUpdate = Omit<TaskUpdate, 'task_id' | 'task_key' | 'created_at' | 'deleted_at'>;

export async function updateTask(id: string, input: SafeTaskUpdate): Promise<TaskRow | undefined> {
  if (!db) throw new Error('Database connection not initialized');
  const [updated] = await db
    .update(task)
    .set(input)
    .where(and(eq(task.taskId, id), isNull(task.deletedAt)))
    .returning();

  return updated;
}

export async function deleteTask(id: string): Promise<TaskRow | undefined> {
  const [deleted] = await db
    .update(task)
    .set({ deletedAt: new Date().toISOString() })
    .where(and(eq(task.taskId, id), isNull(task.deletedAt)))
    .returning();

  return deleted;
}
