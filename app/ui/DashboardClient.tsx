'use client';
import { useState, useEffect } from "react";
import { Task } from "../lib/definition";
import CountDownTimer from "./CountDown";
import TaskForm from "./Tasks";
import { createTask, updateTask, deleteTask, incrementTask } from "../lib/actions/tasks";
import SettingsForm from "./Settings";
import Report from "./Report";

const fallbackTasks: Task[] = [
  { id: "sample-1", name: "Create TASK", count: 3, goal: 20, is_deleted: false, created_at: new Date().toISOString() },
  { id: "sample-2", name: "Update TASK", count: 5, goal: 8, is_deleted: false, created_at: new Date().toISOString() },
  { id: "sample-3", name: "Walk 10k steps", count: 0, goal: 10, is_deleted: false, created_at: new Date().toISOString() },
];

export default function DashboardClient({ tasks, user, tab = 'focus' }: { tasks : Task[]; user: any; tab?:string }){
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [localTasks, setLocalTasks] = useState<Task[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    const [focusMinutes, setFocusMinutes] = useState(25);
    const [breakMinutes, setBreakMinutes] = useState(5);

    useEffect(() => {
        setIsMounted(true);
        const storedFocus = localStorage.getItem('grindo_focus_time');
        const storedBreak = localStorage.getItem('grindo_break_time');
        if (storedFocus) setFocusMinutes(Number(storedFocus))
        if (storedBreak) setBreakMinutes(Number(storedBreak))
        
        const storedTasks = localStorage.getItem('grindo_tasks');
        if (storedTasks) {
            try {
                setLocalTasks(JSON.parse(storedTasks));
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

    const handleSaveSettings = (newFocus: number, newBreak: number) => {
        setFocusMinutes(newFocus);
        setBreakMinutes(newBreak);
        localStorage.setItem('grindo_focus_time', String(newFocus));
        localStorage.setItem('grindo_break_time', String(newBreak));
    }

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
    
    if (tab === 'settings') {
        return (
            <SettingsForm
                focusTime={focusMinutes}
                breakTime={breakMinutes}
                onSave={handleSaveSettings}
            />
        );
    }

    if (tab === 'report') {
        return <Report isLoggedIn={false} />;
    }

    return (
        <>
            <CountDownTimer 
                taskId={selectedId} 
                onIncrement={handleIncrement}
                focusTime={focusMinutes*60}
                breakTime={breakMinutes*60}
                isLoggedIn={isLoggedIn}
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
