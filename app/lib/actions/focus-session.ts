'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { sql } from '../db';

async function getRequiredUserId() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        throw new Error('Unauthorized: You must be logged in to track focus sessions.');
    }
    return user.id;
}

export async function startFocusSession(taskId: string | null): Promise<string> {
    const userId = await getRequiredUserId();
    try {
        const rows = await sql<{ id: string }[]>`
            INSERT INTO focus_sessions (task_id, user_id, started_at)
            VALUES (${taskId}, ${userId}, NOW())
            RETURNING id
        `;
        return rows[0].id;
    } catch (error) {
        console.error(error);
        throw new Error('Database error: Failed to start focus session.');
    }
}

export async function endFocusSession(sessionId: string): Promise<void> {
    const userId = await getRequiredUserId();
    try {
        await sql`
            UPDATE focus_sessions
            SET
                ended_at = NOW(),
                duration_seconds = GREATEST(
                    0,
                    EXTRACT(EPOCH FROM (NOW() - started_at))::integer
                )
            WHERE id = ${sessionId}
              AND user_id = ${userId}
              AND ended_at IS NULL
        `;
        revalidatePath('/?tab=report');
        revalidatePath('/');
    } catch (error) {
        console.error(error);
        throw new Error('Database error: Failed to end focus session.');
    }
}
