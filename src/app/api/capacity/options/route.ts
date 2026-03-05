import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { team, teamMembership, user, sprint, project } from '@/types/schema';

export async function GET() {
  try {
    const teamRows = await db.select({ teamId: team.teamId, name: team.name }).from(team);

    const membershipRows = await db
      .select({
        teamId: teamMembership.teamId,
        userId: user.id,
        userName: user.name,
        userRole: user.role,
      })
      .from(teamMembership)
      .innerJoin(user, eq(user.id, teamMembership.userId));

    const membershipByTeam: Record<string, { id: string; name: string; role: string | null }[]> =
      {};

    for (const row of membershipRows) {
      if (!membershipByTeam[row.teamId]) {
        membershipByTeam[row.teamId] = [];
      }
      membershipByTeam[row.teamId].push({
        id: row.userId,
        name: row.userName ?? '',
        role: row.userRole ?? null,
      });
    }

    const sprintRows = await db
      .select({
        id: sprint.sprintId,
        name: sprint.name,
        startDate: sprint.startDate,
        endDate: sprint.endDate,
        teamId: project.teamId,
      })
      .from(sprint)
      .innerJoin(project, eq(project.projectId, sprint.projectId));

    const teams = teamRows.map(row => ({
      id: row.teamId,
      name: row.name,
      members: membershipByTeam[row.teamId] ?? [],
    }));

    const sprints = sprintRows.map(row => ({
      id: row.id,
      name: row.name,
      startDate: row.startDate,
      endDate: row.endDate,
      teamId: row.teamId,
    }));

    return NextResponse.json({ teams, sprints });
  } catch (error) {
    console.error('Failed to load capacity options', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
