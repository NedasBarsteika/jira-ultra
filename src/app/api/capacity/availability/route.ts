import { and, eq, sql } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { sprintAvailability, user } from '@/types/schema';

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
      .select({
        userId: sprintAvailability.userId,
        pattern: sprintAvailability.availabilityPattern,
      })
      .from(sprintAvailability)
      .innerJoin(user, eq(user.id, sprintAvailability.userId))
      .where(eq(sprintAvailability.sprintId, sprintId));

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

    const [existing] = await db
      .select({ availabilityId: sprintAvailability.availabilityId })
      .from(sprintAvailability)
      .where(and(eq(sprintAvailability.sprintId, sprintId), eq(sprintAvailability.userId, userId)))
      .limit(1);

    let result: { availabilityId: string } | undefined;

    if (existing) {
      const [updated] = await db
        .update(sprintAvailability)
        .set({
          availabilityPattern: sql`${JSON.stringify(pattern)}::jsonb`,
          totalHours: String(totalHours),
          workingDays,
          halfDays,
          offDays,
          notes: notes ?? null,
        })
        .where(eq(sprintAvailability.availabilityId, existing.availabilityId))
        .returning({ availabilityId: sprintAvailability.availabilityId });

      result = updated;
    } else {
      const [inserted] = await db
        .insert(sprintAvailability)
        .values({
          sprintId,
          userId,
          submittedBy: userId,
          approvedBy: approverId ?? userId,
          status: 'approved',
          availabilityPattern: sql`${JSON.stringify(pattern)}::jsonb`,
          totalHours: String(totalHours),
          workingDays,
          halfDays,
          offDays,
          notes: notes ?? null,
        })
        .returning({ availabilityId: sprintAvailability.availabilityId });

      result = inserted;
    }

    return NextResponse.json({ id: result?.availabilityId }, { status: 201 });
  } catch (error: unknown) {
    console.error('Failed to create sprint_availability', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
