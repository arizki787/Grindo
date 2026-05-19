'use client';
import { useState } from "react";
import { Task } from "../lib/definition";
import CountDownTimer from "./CountDown";
import TaskForm from "./Tasks";

export default function DashboardClient({ tasks }: { tasks : Task[]}){
    const [selectedId, setSelectedId] = useState<string | null>(null);
    return(
        <>
            <CountDownTimer taskId={selectedId}/>
            <TaskForm 
                tasks={tasks}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
            />
        </>
    )
}