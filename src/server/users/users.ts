'use server';

import { and, eq, isNull } from 'drizzle-orm';

import { db } from '@/lib/db';
import { project, user } from '@/types/schema';

export type AssigneeOption = { id: string; name: string };

export async function getAssigneesForProject(projectId: string): Promise<AssigneeOption[]> {
  if (!db) throw new Error('Database connection not initialized');

  const [p] = await db
    .select({ organizationId: project.organizationId })
    .from(project)
    .where(and(eq(project.projectId, projectId), isNull(project.deletedAt)))
    .limit(1);

  if (!p?.organizationId) return [];

  const users = await db
    .select({
      id: user.id,
      name: user.name,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    })
    .from(user)
    .where(and(eq(user.organizationId, p.organizationId), isNull(user.deletedAt)));

  return users
    .map(u => {
      const fullName =
        u.firstName || u.lastName
          ? `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim()
          : (u.name ?? '');

      const label = fullName || u.email || u.id;
      return { id: u.id, name: label };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}
