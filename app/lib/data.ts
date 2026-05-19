import postgres from 'postgres';
import { Task } from './definition';

const sql = postgres(process.env.POSTGRES_URL!, {
    ssl: process.env.NODE_ENV === 'production' ? 'require' : false,
    prepare: false,
});

export async function fetchActiveTasks() {
    try {
        const data = await sql<Task[]>`SELECT * FROM tasks WHERE is_deleted = FALSE`;
        return data;
    } catch (error) {
        console.error('Database Error', error);
        throw new Error('Failed to fetch task data');
    }
}