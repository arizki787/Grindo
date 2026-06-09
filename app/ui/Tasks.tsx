'use client';
import type { Task } from "../lib/definition";
import { useState } from "react";
import { CiFloppyDisk, CiCircleRemove, CiEdit, CiTrash } from "react-icons/ci";
import { IoAdd, IoCheckmarkCircle, IoEllipseOutline } from "react-icons/io5";
import AuthButton from "./AuthButton";

type DisplayTask = Pick<Task, "id" | "name" | "count" | "goal" | "is_deleted">;

interface TaskFormProps {
  tasks: Task[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  isLoggedIn: boolean;
  onCreate: (name: string, goal: number) => Promise<void> | void;
  onUpdate: (id: string, name: string, goal: number) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
}

export default function TaskForm({
  tasks,
  selectedId,
  setSelectedId,
  isLoggedIn,
  onCreate,
  onUpdate,
  onDelete
}: TaskFormProps) {
    const tasksToDisplay: DisplayTask[] = tasks || [];

    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [editedTask, setEditedTask] = useState({
      name: "",
      goal: "",
    })

    const handleEditClick = (task: DisplayTask) => {
      setEditingTaskId(task.id);
      setEditedTask({
        name: task.name,
        goal: String(task.goal),
      })
    }

    const handleSave = async (id: string) => {
      if (onUpdate) {
        await onUpdate(id, editedTask.name, Number(editedTask.goal));
      }
      setEditingTaskId(null);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const name = formData.get("name") as string;
      const goal = Number(formData.get("goal"));
      if (onCreate) {
        await onCreate(name, goal);
      }
      setIsAdding(false);
    };

  return (
    <div className="flex w-full max-w-3xl flex-col bg-[#141e0f]/40 backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-8 rounded-[2rem] relative z-10">
      
      {/* Alert Banner if Guest Mode */}
      {!isLoggedIn && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-600/10 border border-amber-600/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-amber-200">Using Local Storage</span>
            <span className="text-xs text-amber-200/70 mt-0.5">Your tasks are saved locally. Sign in with Google to sync tasks across all your devices.</span>
          </div>
          <div className="w-full sm:w-auto shrink-0">
            <AuthButton user={null} />
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6 px-2">
        <h2 className="text-stone-50 text-lg font-bold tracking-[0.3em] font-heading uppercase">Tasks</h2>
        <button 
          onClick={() => setIsAdding(!isAdding)} 
          className="px-4 py-2 bg-olive-green/30 hover:bg-olive-green/50 border border-olive-green/50 rounded-full flex items-center gap-2 text-sm text-[#a3e635] transition-colors cursor-pointer"
        >
          <IoAdd className="w-4 h-4" /> Add Task
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-6 bg-white/5 p-4 rounded-2xl border border-white/10 flex flex-col gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="text"
              name="name"
              placeholder="Task name"
              className="rounded-xl bg-black/20 text-foreground border border-white/10 px-4 py-2 text-sm outline-none focus:border-[#a3e635] placeholder-foreground/40 transition-colors"
              required
            />
            <input
              type="number"
              name="goal"
              placeholder="Goal"
              min="1"
              className="rounded-xl bg-black/20 text-foreground border border-white/10 px-4 py-2 text-sm outline-none focus:border-[#a3e635] placeholder-foreground/40 transition-colors"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-sm font-semibold text-foreground/60 hover:text-foreground transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#a3e635] px-6 py-2 text-sm font-bold text-dark-espresso hover:bg-opacity-90 transition-colors cursor-pointer"
            >
              Save Task
            </button>
          </div>
        </form>
      )}

      {tasksToDisplay.filter((task) => !task.is_deleted).length === 0 ? (
        <div className="text-center py-8 text-foreground/45 text-sm font-medium">
          No tasks yet. Click &quot;Add Task&quot; above to create one.
        </div>
      ) : (
        <ul className="space-y-4">
          {tasksToDisplay
              .filter((task) => !task.is_deleted)
              .map((task) => {
                  const percent = Math.min(100, (task.count / task.goal) * 100);
                  const isComplete = task.count >= task.goal;

                  return (
                  <li 
                    key={task.id} 
                    className={`px-6 py-4 rounded-2xl cursor-pointer transition-all border
                      ${selectedId === task.id 
                        ? "bg-white/10 border-[#a3e635]/50 shadow-lg" 
                        : "bg-white/5 border-white/5 hover:bg-white/10"
                      }`} 
                    onClick={() => setSelectedId(selectedId === task.id ? null : task.id)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full">
                      
                      {/* Left: Checkbox & Info */}
                      <div className="flex items-center gap-4 min-w-[200px]">
                        <div className="text-[#a3e635] shrink-0">
                          {isComplete ? <IoCheckmarkCircle className="w-7 h-7" /> : <IoEllipseOutline className="w-7 h-7" />}
                        </div>
                        
                        {editingTaskId === task.id ? (
                          <div className="flex flex-col gap-2 w-full" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="text"
                              value={editedTask.name}
                              onChange={(e)=> setEditedTask({...editedTask, name: e.target.value})}
                              className="bg-black/20 border border-white/10 text-foreground rounded px-2 py-1 outline-none focus:border-[#a3e635] text-sm"
                            />
                            <input 
                              type="number"
                              value={editedTask.goal}
                              onChange={(e) => setEditedTask({...editedTask, goal: e.target.value})}
                              className="bg-black/20 border border-white/10 text-foreground rounded px-2 py-1 outline-none focus:border-[#a3e635] text-sm"
                            />
                          </div>
                        ) : (
                          <div className="flex flex-col">
                            <span className="font-bold text-foreground tracking-wide">{task.name}</span>
                            <span className="text-xs text-foreground/50 tracking-wider font-medium">Progress: {task.count} / {task.goal}</span>
                          </div>
                        )}
                      </div>

                      {/* Middle: Progress Bar */}
                      <div className="flex-1 flex items-center gap-4 sm:px-8 py-2 sm:py-0">
                        <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden shadow-inner">
                          <div className="h-full bg-[#a3e635] rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
                        </div>
                        <span className="text-xs text-[#a3e635] font-bold shrink-0 w-8">{Math.round(percent)}%</span>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex flex-row justify-end gap-2 shrink-0">
                        {editingTaskId === task.id ? (
                          <>
                            <button onClick={(e) => { e.stopPropagation(); handleSave(task.id); }} className="rounded-xl border border-white/10 p-2 hover:bg-white/10 text-foreground transition-colors bg-black/20 cursor-pointer">
                              <span className="sr-only">Save</span>
                              <CiFloppyDisk className="w-5 h-5" />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); setEditingTaskId(null); }} className="rounded-xl border border-white/10 p-2 hover:bg-white/10 text-foreground transition-colors bg-black/20 cursor-pointer">
                              <span className="sr-only">Cancel</span>
                              <CiCircleRemove className="w-5 h-5" />
                            </button>
                          </>
                        ):(
                          <>
                            <button onClick={(e) => { e.stopPropagation(); handleEditClick(task); }} className="rounded-xl border border-white/5 p-2 hover:bg-white/10 text-foreground transition-colors bg-white/5 cursor-pointer">
                              <span className="sr-only">Edit</span>
                              <CiEdit className="w-5 h-5 text-foreground/70" />
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); if (onDelete) onDelete(task.id); }} 
                              className="rounded-xl border border-white/5 p-2 hover:bg-white/10 text-foreground transition-colors bg-white/5 cursor-pointer"
                            >
                              <span className="sr-only">Delete</span>
                              <CiTrash className="w-5 h-5 text-foreground/70" />
                            </button>
                          </>
                        )}
                      </div>

                    </div>
                  </li>
          )})}
        </ul>
      )}
    </div>
  );
}