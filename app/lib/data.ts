import { Task } from './definition';
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