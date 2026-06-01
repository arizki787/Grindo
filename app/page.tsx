import { Suspense } from "react";
import type { Task } from "./lib/definition";
import { fetchActiveTasks } from './lib/data';
import DashboardClient from "./ui/DashboardClient";
async function DashboardContent() {
  let activeTasks: Task[] = [];

  try {
    activeTasks = await fetchActiveTasks();
  } catch(error) {
    console.error();
    throw new Error('Database Error: Failed to fetch data tasks');
  }

  return <DashboardClient tasks={activeTasks}/>;

} 

export default function Home(){
  return(
    <main className="flex min-h-screen flex-col items-center p-8 md:p-24 gap-8">
      <Suspense fallback={<div className="text-foreground">loading...</div>}>
        <DashboardContent/>
      </Suspense>
    </main>
  )
};