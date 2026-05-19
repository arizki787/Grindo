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
      <h2 className="text-sky-500 text-xl font-bold tracking-widest text-center">TASK</h2>

      {usingFallback && (
        <p className="mt-2 text-sm text-amber-700">Showing sample tasks (fallback data).</p>
      )}

      <div className="mt-3 flex grow flex-col rounded-xl bg-gray-50 p-4">
          <ul className="space-y-3">
            {tasksToDisplay
                .filter((task) => !task.is_deleted)
                .map((task) => (
                    <li key={task.id} className={`bg-white px-6 py-4 rounded-lg shadow-sm cursor-pointer transition-colors
                      ${selectedId === task.id 
                        ? "bg-sky-100 border border-sky-400 text-sky-700" 
                        : "hover:bg-gray-100"
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
                                className="border rounded px-2 py-1"
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
                                className="border rounded px-2 py-1"
                              />
                            </>
                          ) : (
                            <>
                              <div className="font-semibold  text-gray-800">
                                {task.name}
                              </div>
                              <div className="text-sm text-gray-500">
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
                                className="rounded-md border p-2 hover:bg-gray-100"
                              >
                                <span className="sr-only">Save</span>
                                <CiFloppyDisk className="w-5" />
                              </button>
                              <button
                                onClick={() => setEditingTaskId(null)}
                                className="rounded-md border p-2 hover:bg-gray-100"
                              >
                                <span className="sr-only">Cancel</span>
                                <CiCircleRemove className="w-5" />
                              </button>
                            </>
                          ):(
                            <>
                              <button
                                onClick={() => handleEditClick(task)}
                                className="rounded-md border p-2 hover:bg-gray-100"
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
            <div className="bg-white mt-3 px-6 py-4 rounded-lg shadow-sm">
              <div className="flex flex-row items-center justify-between">
                  <h2 className="font-bold">ADD TASK :</h2>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <input
                  type="text"
                  name="name"
                  placeholder="Task name"
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-sky-400"
                  required
                />
                <input
                  type="number"
                  name="goal"
                  placeholder="Goal"
                  min="1"
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-sky-400"
                  required
                />
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  type="submit"
                  className="rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600"
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