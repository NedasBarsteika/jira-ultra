import { sql } from 'kysely';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/db';

type AvailabilityType = 'full' | 'half' | 'off';

const HOURS_PER_DAY = 8;

interface AvailabilityPatternEntry {
  availability: AvailabilityType;
  percentage: number;
  comment: string;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sprintId = searchParams.get('sprintId');

    if (!sprintId) {
      return NextResponse.json({ error: 'sprintId query parameter is required' }, { status: 400 });
    }

    const rows = await db
      .selectFrom('sprint_availability')
      .innerJoin('user', 'user.id', 'sprint_availability.user_id')
      .select([
        'sprint_availability.user_id as user_id',
        'sprint_availability.availability_pattern as pattern',
      ])
      .where('sprint_availability.sprint_id', '=', sprintId)
      .execute();

    return NextResponse.json({ availabilities: rows });
  } catch (error: unknown) {
    console.error('Failed to fetch sprint_availability', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json();
    const {
      sprintId,
      userId,
      percentage,
      pattern,
      approverId,
      notes,
    }: {
      sprintId: string;
      userId: string;
      percentage: number;
      pattern: Record<string, AvailabilityPatternEntry>;
      approverId?: string;
      notes?: string | null;
    } = body as {
      sprintId: string;
      userId: string;
      percentage: number;
      pattern: Record<string, AvailabilityPatternEntry>;
      approverId?: string;
      notes?: string | null;
    };

    if (!sprintId || !userId || !pattern || typeof percentage !== 'number') {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const scalar = percentage / 100;
    let workingDays = 0;
    let halfDays = 0;
    let offDays = 0;
    let totalHours = 0;

    Object.values(pattern).forEach(entry => {
      const avail = entry.availability;
      if (avail === 'full') {
        workingDays += 1;
        totalHours += HOURS_PER_DAY * scalar;
      } else if (avail === 'half') {
        halfDays += 1;
        totalHours += (HOURS_PER_DAY / 2) * scalar;
      } else {
        offDays += 1;
      }
    });

    const existing = await db
      .selectFrom('sprint_availability')
      .select('availability_id')
      .where('sprint_id', '=', sprintId)
      .where('user_id', '=', userId)
      .executeTakeFirst();

    let result: { availability_id: string } | undefined;

    if (existing) {
      result = await db
        .updateTable('sprint_availability')
        .set({
          availability_pattern: sql`${JSON.stringify(pattern)}::jsonb`,
          total_hours: totalHours,
          working_days: workingDays,
          half_days: halfDays,
          off_days: offDays,
          notes: notes ?? null,
        })
        .where('availability_id', '=', existing.availability_id)
        .returning('availability_id')
        .executeTakeFirst();
    } else {
      result = await db
        .insertInto('sprint_availability')
        .values({
          sprint_id: sprintId,
          user_id: userId,
          submitted_by: userId,
          approved_by: approverId ?? userId,
          status: 'approved',
          availability_pattern: sql`${JSON.stringify(pattern)}::jsonb`,
          total_hours: totalHours,
          working_days: workingDays,
          half_days: halfDays,
          off_days: offDays,
          notes: notes ?? null,
        })
        .returning('availability_id')
        .executeTakeFirst();
    }

    return NextResponse.json({ id: result?.availability_id }, { status: 201 });
  } catch (error: unknown) {
    console.error('Failed to create sprint_availability', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
