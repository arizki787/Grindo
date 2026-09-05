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

export type FocusSession = {
    id: string;
    task_id: string | null;
    user_id: string;
    started_at: string;
    ended_at: string | null;
    duration_seconds: number | null;
    created_at: string;
};

export type DailyReport = {
    day: string; // ISO date string e.g. "2026-09-05"
    total_seconds: number;
    sessions: number;
};
