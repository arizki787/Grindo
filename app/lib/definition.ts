export type Task = {
    id: string;
    name: string;
    count: number;
    goal: number;
    is_deleted: boolean;
    created_at: string;
}

export type User = {
    id: string;
    name: string;
    email: string;
    password: string;
}