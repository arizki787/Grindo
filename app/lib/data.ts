import { Task, DailyReport } from './definition';
import { createClient } from '@/utils/supabase/server';
import { sql } from './db';

export async function fetchActiveTasks() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return [];
        }

        const data = await sql<Task[]>`
            SELECT * FROM tasks 
            WHERE is_deleted = FALSE AND user_id = ${user.id}
            ORDER BY created_at DESC
        `;
        return data;
    } catch (error) {
        console.error('Database Error', error);
        throw new Error('Failed to fetch task data');
    }
}

function formatJakartaDate(date: Date): string {
    // en-CA yields YYYY-MM-DD
    return date.toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });
}

function addDays(isoDate: string, days: number): string {
    const [y, m, d] = isoDate.split('-').map(Number);
    const date = new Date(Date.UTC(y, m - 1, d + days));
    return date.toISOString().slice(0, 10);
}

export async function fetchWeeklyReport(): Promise<DailyReport[]> {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return [];
        }

        const todayJakarta = formatJakartaDate(new Date());
        const startDay = addDays(todayJakarta, -6);

        const rows = await sql<{ day: string; total_seconds: number; sessions: number }[]>`
            SELECT
                to_char(
                    date_trunc('day', started_at AT TIME ZONE 'Asia/Jakarta'),
                    'YYYY-MM-DD'
                ) AS day,
                COALESCE(SUM(duration_seconds), 0)::int AS total_seconds,
                COUNT(*)::int AS sessions
            FROM focus_sessions
            WHERE user_id = ${user.id}
              AND ended_at IS NOT NULL
              AND duration_seconds IS NOT NULL
              AND (started_at AT TIME ZONE 'Asia/Jakarta')::date
                  >= ${startDay}::date
              AND (started_at AT TIME ZONE 'Asia/Jakarta')::date
                  <= ${todayJakarta}::date
            GROUP BY 1
            ORDER BY 1
        `;

        const byDay = new Map(rows.map((r) => [r.day, r]));
        const result: DailyReport[] = [];

        for (let i = 0; i < 7; i++) {
            const day = addDays(startDay, i);
            const row = byDay.get(day);
            result.push({
                day,
                total_seconds: row?.total_seconds ?? 0,
                sessions: row?.sessions ?? 0,
            });
        }

        return result;
    } catch (error) {
        console.error('Database Error', error);
        throw new Error('Failed to fetch weekly report');
    }
}
