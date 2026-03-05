import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

export async function GET() {
  try {
    const teamRows = await db.selectFrom('team').select(['team_id', 'name']).execute();

    const membershipRows = await db
      .selectFrom('team_membership')
      .innerJoin('user', 'user.id', 'team_membership.user_id')
      .select([
        'team_membership.team_id as team_id',
        'user.id as user_id',
        'user.name as user_name',
        'user.role as user_role',
      ])
      .execute();

    const membershipByTeam: Record<string, { id: string; name: string; role: string | null }[]> =
      {};

    for (const row of membershipRows) {
      if (!membershipByTeam[row.team_id]) {
        membershipByTeam[row.team_id] = [];
      }
      membershipByTeam[row.team_id].push({
        id: row.user_id,
        name: row.user_name,
        role: row.user_role ?? null,
      });
    }

    const sprintRows = await db
      .selectFrom('sprint')
      .innerJoin('project', 'project.project_id', 'sprint.project_id')
      .select([
        'sprint.sprint_id as id',
        'sprint.name as name',
        'sprint.start_date as start_date',
        'sprint.end_date as end_date',
        'project.team_id as team_id',
      ])
      .execute();

    const teams = teamRows.map(row => ({
      id: row.team_id,
      name: row.name,
      members: membershipByTeam[row.team_id] ?? [],
    }));

    const sprints = sprintRows.map(row => ({
      id: row.id,
      name: row.name,
      startDate:
        row.start_date instanceof Date
          ? row.start_date.toISOString().slice(0, 10)
          : String(row.start_date),
      endDate:
        row.end_date instanceof Date
          ? row.end_date.toISOString().slice(0, 10)
          : String(row.end_date),
      teamId: row.team_id,
    }));

    return NextResponse.json({ teams, sprints });
  } catch (error) {
    console.error('Failed to load capacity options', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
