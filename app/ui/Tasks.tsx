import { createTask, updateTask } from "../lib/actions";
import type { Task } from "../lib/definition";
import { DeleteTask } from "./Buttons";
import { useState } from "react";
import { CiFloppyDisk, CiCircleRemove, CiEdit } from "react-icons/ci";

type DisplayTask = Pick<Task, "id" | "name" | "count" | "goal" | "is_deleted">;

const fallbackTasks: DisplayTask[] = [
  { id: "sample-1", name: "Read 20 pages", count: 3, goal: 20, is_deleted: false },
  { id: "sample-2", name: "Drink water", count: 5, goal: 8, is_deleted: false },
  { id: "sample-3", name: "Walk 10k steps", count: 0, goal: 10, is_deleted: false },
];

export default function TaskForm({ tasks, selectedId, setSelectedId } : {
  tasks: Task[];
  selectedId: string;
  setSelectedId: (id: string) => void;
}){
    const usingFallback = tasks === null || tasks.length === 0;
    const tasksToDisplay: DisplayTask[] = tasks ?? fallbackTasks;

    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editedTask, setEditedTask] = useState({
      name: "",
      goal: "",
    })

    const handleEditClick = (task) => {
      setEditingTaskId(task.id);
      setEditedTask({
        name: task.name,
        goal: task.goal,
      })
    }

    const handleSave = async (id: string) => {
      await updateTask(id, editedTask.name, Number(editedTask.goal));
      setEditingTaskId(null);
    };

  return (
    <div className="mt-6 flex w-full max-w-xl flex-col">
      <h2 className="text-warm-brown text-xl font-bold tracking-widest text-center font-heading">TASKS</h2>

      {usingFallback && (
        <p className="mt-2 text-sm text-warm-brown">Showing sample tasks (fallback data).</p>
      )}

      <div className="mt-3 flex grow flex-col rounded-2xl bg-dark-forest shadow-lg border border-olive-green/20 p-4">
          <ul className="space-y-3">
            {tasksToDisplay
                .filter((task) => !task.is_deleted)
                .map((task) => (
                    <li key={task.id} className={`px-6 py-4 rounded-xl shadow-md cursor-pointer transition-colors
                      ${selectedId === task.id 
                        ? "bg-olive-green border border-warm-brown text-foreground" 
                        : "bg-dark-espresso hover:bg-olive-green/40 text-foreground"
                      }`} onClick={()=>setSelectedId(task.id)}
                    >
                      <div className="grid grid-cols-2">
                        <div className="flex flex-col gap-2">
                          {editingTaskId === task.id ? (
                            <>
                              <input
                                type="text"
                                value={editedTask.name}
                                onChange={(e)=>
                                  setEditedTask({
                                    ...editedTask,
                                    name: e.target.value,
                                  })
                                }
                                className="border border-olive-green bg-dark-forest text-foreground rounded px-2 py-1 outline-none focus:border-warm-brown"
                              />

                              <input 
                                type="number"
                                value={editedTask.goal}
                                onChange={(e) => 
                                  setEditedTask({
                                    ...editedTask,
                                    goal: e.target.value,
                                  })
                                }
                                className="border border-olive-green bg-dark-forest text-foreground rounded px-2 py-1 outline-none focus:border-warm-brown"
                              />
                            </>
                          ) : (
                            <>
                              <div className="font-semibold text-foreground tracking-wide font-heading">
                                {task.name}
                              </div>
                              <div className="text-sm text-foreground/70">
                                Progress: {task.count} / {task.goal}
                              </div>
                            </>
                          )}
                        </div>

                        <div className="flex flex-row justify-end gap-3">
                          {editingTaskId === task.id ? (
                            <>
                              <button
                                onClick={() => handleSave(task.id)}
                                className="rounded-md border border-olive-green p-2 hover:bg-olive-green text-foreground transition-colors"
                              >
                                <span className="sr-only">Save</span>
                                <CiFloppyDisk className="w-5" />
                              </button>
                              <button
                                onClick={() => setEditingTaskId(null)}
                                className="rounded-md border border-olive-green p-2 hover:bg-olive-green text-foreground transition-colors"
                              >
                                <span className="sr-only">Cancel</span>
                                <CiCircleRemove className="w-5" />
                              </button>
                            </>
                          ):(
                            <>
                              <button
                                onClick={() => handleEditClick(task)}
                                className="rounded-md border border-olive-green p-2 hover:bg-olive-green text-foreground transition-colors"
                              >
                                <span className="sr-only">Edit</span>
                                <CiEdit className="w-5 h-5" />
                              </button>
                              <DeleteTask id={task.id} />
                            </>
                          )}
                        </div>
                      </div>
                    </li>
            ))}
          </ul>
          <form action={createTask}>
            <div className="bg-dark-espresso mt-4 px-6 py-4 rounded-xl shadow-md border border-olive-green/20">
              <div className="flex flex-row items-center justify-between">
                  <h2 className="font-bold text-foreground font-heading">ADD TASK :</h2>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <input
                  type="text"
                  name="name"
                  placeholder="Task name"
                  className="rounded-md bg-dark-forest text-foreground border border-olive-green px-3 py-2 text-sm outline-none focus:border-warm-brown placeholder-foreground/50"
                  required
                />
                <input
                  type="number"
                  name="goal"
                  placeholder="Goal"
                  min="1"
                  className="rounded-md bg-dark-forest text-foreground border border-olive-green px-3 py-2 text-sm outline-none focus:border-warm-brown placeholder-foreground/50"
                  required
                />
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  type="submit"
                  className="rounded-md bg-warm-brown px-4 py-2 text-sm font-semibold text-foreground hover:bg-opacity-80 transition-colors uppercase tracking-wider"
                >
                  Add Task
                </button>
              </div>
            </div>
          </form>
      </div>
    </div>
  );
}   