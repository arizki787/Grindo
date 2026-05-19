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
    <Suspense fallback={<div>loading...</div>}>
      <DashboardContent/>
    </Suspense>  
  )
};