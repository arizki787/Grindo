'use client';
import type { Task } from "../lib/definition";
import { useState } from "react";
import { CiFloppyDisk, CiCircleRemove, CiEdit, CiTrash } from "react-icons/ci";
import { IoAdd, IoCheckmarkCircle, IoEllipseOutline } from "react-icons/io5";
import AuthButton from "./AuthButton";

export const MAX_TASK_NAME_LENGTH = 80;

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
    const [newTaskName, setNewTaskName] = useState("");
    const [newTaskGoal, setNewTaskGoal] = useState("");
    const [editedTask, setEditedTask] = useState({
      name: "",
      goal: "",
    });

    const handleEditClick = (task: DisplayTask) => {
      setEditingTaskId(task.id);
      setEditedTask({
        name: task.name,
        goal: String(task.goal),
      });
    };

    const handleSave = async (id: string) => {
      const trimmedName = editedTask.name.trim();
      const goalNum = Number(editedTask.goal);
      if (!trimmedName || isNaN(goalNum) || goalNum <= 0) return;

      if (onUpdate) {
        await onUpdate(id, trimmedName.slice(0, MAX_TASK_NAME_LENGTH), goalNum);
      }
      setEditingTaskId(null);
    };

    const handleKeyDownEdit = (e: React.KeyboardEvent, id: string) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSave(id);
      } else if (e.key === "Escape") {
        e.preventDefault();
        setEditingTaskId(null);
      }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const trimmedName = newTaskName.trim();
      const goalNum = Number(newTaskGoal);
      if (!trimmedName || isNaN(goalNum) || goalNum <= 0) return;

      if (onCreate) {
        await onCreate(trimmedName.slice(0, MAX_TASK_NAME_LENGTH), goalNum);
      }
      setNewTaskName("");
      setNewTaskGoal("");
      setIsAdding(false);
    };

  return (
    <div className="flex w-full max-w-3xl flex-col bg-[#141e0f]/40 backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6 sm:p-8 rounded-[2rem] relative z-10">
      
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
          onClick={() => {
            setIsAdding(!isAdding);
            if (!isAdding) {
              setNewTaskName("");
              setNewTaskGoal("");
            }
          }} 
          className="px-4 py-2 bg-olive-green/30 hover:bg-olive-green/50 border border-olive-green/50 rounded-full flex items-center gap-2 text-sm text-[#a3e635] transition-colors cursor-pointer"
        >
          <IoAdd className="w-4 h-4" /> Add Task
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-6 bg-white/5 p-4 rounded-2xl border border-white/10 flex flex-col gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  maxLength={MAX_TASK_NAME_LENGTH}
                  placeholder="Task name"
                  className="w-full rounded-xl bg-black/20 text-foreground border border-white/10 px-4 py-2 text-sm outline-none focus:border-[#a3e635] placeholder-foreground/40 transition-colors pr-14"
                  required
                  autoFocus
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-foreground/40 pointer-events-none">
                  {newTaskName.length}/{MAX_TASK_NAME_LENGTH}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <input
                type="number"
                name="goal"
                value={newTaskGoal}
                onChange={(e) => setNewTaskGoal(e.target.value)}
                placeholder="Goal (e.g. 5)"
                min="1"
                className="w-full rounded-xl bg-black/20 text-foreground border border-white/10 px-4 py-2 text-sm outline-none focus:border-[#a3e635] placeholder-foreground/40 transition-colors"
                required
              />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-foreground/40">Press Enter to save task</span>
            <div className="flex gap-2">
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
                    className={`px-5 sm:px-6 py-4 rounded-2xl cursor-pointer transition-all border
                      ${selectedId === task.id 
                        ? "bg-white/10 border-[#a3e635]/50 shadow-lg" 
                        : "bg-white/5 border-white/5 hover:bg-white/10"
                      }`} 
                    onClick={() => setSelectedId(selectedId === task.id ? null : task.id)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
                      
                      {/* Left: Checkbox & Info */}
                      <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                        <div className="text-[#a3e635] shrink-0 mt-0.5 sm:mt-0">
                          {isComplete ? <IoCheckmarkCircle className="w-7 h-7" /> : <IoEllipseOutline className="w-7 h-7" />}
                        </div>
                        
                        {editingTaskId === task.id ? (
                          <div 
                            className="flex flex-col gap-2 w-full min-w-0" 
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="relative w-full">
                              <input
                                type="text"
                                value={editedTask.name}
                                onChange={(e) => setEditedTask({...editedTask, name: e.target.value})}
                                onKeyDown={(e) => handleKeyDownEdit(e, task.id)}
                                maxLength={MAX_TASK_NAME_LENGTH}
                                placeholder="Task name"
                                className="w-full bg-black/20 border border-white/10 text-foreground rounded-xl px-3 py-1.5 outline-none focus:border-[#a3e635] text-sm pr-14"
                                autoFocus
                              />
                              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-foreground/40 pointer-events-none">
                                {editedTask.name.length}/{MAX_TASK_NAME_LENGTH}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <input 
                                type="number"
                                value={editedTask.goal}
                                min="1"
                                onChange={(e) => setEditedTask({...editedTask, goal: e.target.value})}
                                onKeyDown={(e) => handleKeyDownEdit(e, task.id)}
                                placeholder="Goal"
                                className="w-28 bg-black/20 border border-white/10 text-foreground rounded-xl px-3 py-1.5 outline-none focus:border-[#a3e635] text-sm"
                              />
                              <span className="text-[11px] text-foreground/40">Enter ↵ to save</span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col min-w-0  flex-1">
                            <span className="font-bold text-foreground tracking-wide break-words [overflow-wrap:anywhere] whitespace-normal leading-snug">
                              {task.name}
                            </span>
                            <span className="text-xs text-foreground/50 tracking-wider font-medium mt-1">
                              Progress: {task.count} / {task.goal}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Middle: Progress Bar */}
                      <div className="flex items-center gap-3 flex-1 min-w-0 py-1 sm:py-0 sm:px-4">
                        <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden shadow-inner">
                          <div className="h-full bg-[#a3e635] rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
                        </div>
                        <span className="text-xs text-[#a3e635] font-bold shrink-0 w-8 text-right">{Math.round(percent)}%</span>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex flex-row justify-end gap-2 shrink-0">
                        {editingTaskId === task.id ? (
                          <>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleSave(task.id); }} 
                              title="Save (Enter)"
                              className="rounded-xl border border-white/10 p-2 hover:bg-white/10 text-foreground transition-colors bg-black/20 cursor-pointer"
                            >
                              <span className="sr-only">Save</span>
                              <CiFloppyDisk className="w-5 h-5 text-[#a3e635]" />
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); setEditingTaskId(null); }} 
                              title="Cancel (Esc)"
                              className="rounded-xl border border-white/10 p-2 hover:bg-white/10 text-foreground transition-colors bg-black/20 cursor-pointer"
                            >
                              <span className="sr-only">Cancel</span>
                              <CiCircleRemove className="w-5 h-5 text-foreground/70" />
                            </button>
                          </>
                        ):(
                          <>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleEditClick(task); }} 
                              title="Edit task"
                              className="rounded-xl border border-white/5 p-2 hover:bg-white/10 text-foreground transition-colors bg-white/5 cursor-pointer"
                            >
                              <span className="sr-only">Edit</span>
                              <CiEdit className="w-5 h-5 text-foreground/70" />
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); if (onDelete) onDelete(task.id); }} 
                              title="Delete task"
                              className="rounded-xl border border-white/5 p-2 hover:bg-white/10 text-foreground transition-colors bg-white/5 cursor-pointer"
                            >
                              <span className="sr-only">Delete</span>
                              <CiTrash className="w-5 h-5 text-foreground/70 hover:text-red-400" />
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