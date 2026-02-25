'use server';

import type { Insertable, Selectable, Updateable } from 'kysely';

import { db } from '@/lib/db';
import type { Task as TaskType, TaskStatus } from '@/types/db';
import { Tables, Task, Project } from '@/types/db-meta';

export type TaskRow = Selectable<TaskType>;
export type NewTask = Insertable<TaskType>;
export type TaskUpdate = Updateable<TaskType>;

export async function getTask(id: string): Promise<TaskRow | undefined> {
  if (!db) throw new Error('Database connection not initialized');
  return db
    .selectFrom(Tables.task)
    .selectAll()
    .where(Task.task_id, '=', id)
    .where(Task.deleted_at, 'is', null)
    .executeTakeFirst();
}

export async function getTasks(filters?: {
  projectId?: string;
  sprintId?: string;
  backlogId?: string;
  assigneeId?: string;
  status?: TaskStatus;
}): Promise<TaskRow[]> {
  if (!db) throw new Error('Database connection not initialized');
  let query = db.selectFrom(Tables.task).selectAll().where(Task.deleted_at, 'is', null);

  if (filters?.projectId != null && filters.projectId !== '') query = query.where(Task.project_id, '=', filters.projectId);
  if (filters?.sprintId != null && filters.sprintId !== '') query = query.where(Task.sprint_id, '=', filters.sprintId);
  if (filters?.backlogId != null && filters.backlogId !== '') query = query.where(Task.backlog_id, '=', filters.backlogId);
  if (filters?.assigneeId != null && filters.assigneeId !== '') query = query.where(Task.assignee_id, '=', filters.assigneeId);
  if (filters?.status != null) query = query.where(Task.status, '=', filters.status);

  return query.execute();
}

export async function createTask(input: Omit<NewTask, typeof Task.task_key>): Promise<TaskRow> {
  if (!db) throw new Error('Database connection not initialized');

  return db.transaction().execute(async trx => {
    const project = await trx
      .updateTable(Tables.project)
      .set(eb => ({ [Project.task_counter]: eb(Project.task_counter, '+', 1) }))
      .where(Project.project_id, '=', input.project_id)
      .returning([Project.key, Project.task_counter])
      .executeTakeFirstOrThrow();

    return trx
      .insertInto(Tables.task)
      .values({ ...input, [Task.task_key]: `${project.key}-${project.task_counter}` })
      .returningAll()
      .executeTakeFirstOrThrow();
  });
}

type SafeTaskUpdate = Omit<TaskUpdate, 'task_id' | 'task_key' | 'created_at' | 'deleted_at'>;

export async function updateTask(id: string, input: SafeTaskUpdate): Promise<TaskRow | undefined> {
  if (!db) throw new Error('Database connection not initialized');
  return db
    .updateTable(Tables.task)
    .set(input)
    .where(Task.task_id, '=', id)
    .where(Task.deleted_at, 'is', null)
    .returningAll()
    .executeTakeFirst();
}

export async function deleteTask(id: string): Promise<TaskRow | undefined> {
  if (!db) throw new Error('Database connection not initialized');
  return db
    .updateTable(Tables.task)
    .set({ deleted_at: new Date() })
    .where(Task.task_id, '=', id)
    .where(Task.deleted_at, 'is', null)
    .returningAll()
    .executeTakeFirst();
}