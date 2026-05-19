'use server';
import postgres from 'postgres';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

export type State = {
    errors?: {
        name?: string[];
        count?: string[];
        goal?: string[];
    };
    message?: string | null
}
const sql = postgres(process.env.POSTGRES_URL!, {
    ssl: process.env.NODE_ENV === 'production' ? 'require' : false,
});

const FormSchema = z.object({
    id: z.string(),
    name: z.string(),
    count: z.coerce.number(),
    goal: z.coerce.number(),
})

const CreateTask = FormSchema.pick({ name: true, goal: true });

export async function createTask(formData: FormData) {
    const validateFields = CreateTask.safeParse({
        name: formData.get('name'),
        goal: formData.get('goal'),
    }) 
    if (!validateFields.success){
        throw new Error('Missing inputs. Failed to create task.');
    }
    const { name, goal } = validateFields.data;
    try {
        await sql`
            INSERT INTO tasks (name, count, goal, is_deleted)
            VALUES (${name}, 0, ${goal}, false)
        `;
        revalidatePath('/');
    } catch (error) {
        console.error(error);
        throw new Error('Database error: Failed to create task.');
    }
}

export async function deleteTask(id:string){
    try{
        await sql`
            UPDATE tasks
            SET is_deleted = true
            WHERE id = ${id}
        `
    } catch (error) {
        console.error(error);
        throw new Error('Database Error: Failed to delete task')
    }
    revalidatePath('/')
}

export async function deleteTaskAction(formData: FormData) {
    const id = formData.get('id') as string;
    await deleteTask(id);
}

export async function incrementTask(id: string) {
    try{
        await sql`
            UPDATE tasks
            SET count = count + 1
            WHERE id = ${id}
        `
    }catch (error) {
        console.error(error);
        throw new Error('Database Error: Failed to increment count')
    }
    revalidatePath('/')
}

export async function updateTask(id: string, name: string, goal: number) {
    try {
        await sql`
            UPDATE tasks
            SET name = ${name}, goal = ${goal}
            WHERE id = ${id}
        `;
    } catch (error) {
        console.error(error);
        throw new Error('Database Error: Failed to update task');
    }
    revalidatePath('/');
}