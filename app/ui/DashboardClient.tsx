'use client';
import { useState, useEffect } from "react";
import { Task } from "../lib/definition";
import CountDownTimer from "./CountDown";
import TaskForm from "./Tasks";
import { createTask, updateTask, deleteTask, incrementTask } from "../lib/actions";

const fallbackTasks: Task[] = [
  { id: "sample-1", name: "Create TASK", count: 3, goal: 20, is_deleted: false, created_at: new Date().toISOString() },
  { id: "sample-2", name: "Update TASK", count: 5, goal: 8, is_deleted: false, created_at: new Date().toISOString() },
  { id: "sample-3", name: "Walk 10k steps", count: 0, goal: 10, is_deleted: false, created_at: new Date().toISOString() },
];

export default function DashboardClient({ tasks, user }: { tasks : Task[]; user: any }){
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [localTasks, setLocalTasks] = useState<Task[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const stored = localStorage.getItem('grindo_tasks');
        if (stored) {
            try {
                setLocalTasks(JSON.parse(stored));
            } catch (e) {
                setLocalTasks(fallbackTasks);
            }
        } else {
            setLocalTasks(fallbackTasks);
            localStorage.setItem('grindo_tasks', JSON.stringify(fallbackTasks));
        }
    }, []);

    const saveLocalTasks = (newTasks: Task[]) => {
        setLocalTasks(newTasks);
        localStorage.setItem('grindo_tasks', JSON.stringify(newTasks));
    };

    const isLoggedIn = !!user;
    const activeTasks = isLoggedIn 
        ? tasks 
        : (isMounted ? localTasks : []);

    const handleCreate = async (name: string, goal: number) => {
        if (isLoggedIn) {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('goal', String(goal));
            await createTask(formData);
        } else {
            const newTask: Task = {
                id: `local-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
                name,
                count: 0,
                goal,
                is_deleted: false,
                created_at: new Date().toISOString(),
            };
            saveLocalTasks([newTask, ...localTasks]);
        }
    };

    const handleUpdate = async (id: string, name: string, goal: number) => {
        if (isLoggedIn) {
            await updateTask(id, name, goal);
        } else {
            const updated = localTasks.map(t => 
                t.id === id ? { ...t, name, goal } : t
            );
            saveLocalTasks(updated);
        }
    };

    const handleDelete = async (id: string) => {
        if (isLoggedIn) {
            await deleteTask(id);
            if (selectedId === id) {
                setSelectedId(null);
            }
        } else {
            const updated = localTasks.map(t => 
                t.id === id ? { ...t, is_deleted: true } : t
            );
            saveLocalTasks(updated);
            if (selectedId === id) {
                setSelectedId(null);
            }
        }
    };

    const handleIncrement = async (id: string) => {
        if (isLoggedIn) {
            await incrementTask(id);
        } else {
            const updated = localTasks.map(t => 
                t.id === id ? { ...t, count: t.count + 1 } : t
            );
            saveLocalTasks(updated);
        }
    };

    return (
        <>
            <CountDownTimer 
                taskId={selectedId} 
                onIncrement={handleIncrement}
            />
            <TaskForm 
                tasks={activeTasks}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                isLoggedIn={isLoggedIn}
                onCreate={handleCreate}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
            />
        </>
    );
}