import { Suspense } from "react";
import type { Task } from "./lib/definition";
import { fetchActiveTasks } from './lib/data';
import DashboardClient from "./ui/DashboardClient";
import Sidebar from "./ui/Sidebar";

async function DashboardContent() {
  let activeTasks: Task[] = [];

  try {
    activeTasks = await fetchActiveTasks();
  } catch(error) {
    console.error(error);
    throw new Error('Database Error: Failed to fetch data tasks');
  }

  return <DashboardClient tasks={activeTasks}/>;
} 

export default function Home(){
  return(
    <main className="flex min-h-screen bg-dark-espresso relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-amber-600/10 rounded-full blur-[150px] transform translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-dark-forest/40 rounded-full blur-[120px] transform -translate-x-1/4 translate-y-1/4 pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-olive-green/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-start p-8 md:p-12 relative z-10 overflow-y-auto">
        <Suspense fallback={<div className="text-foreground mt-20">loading...</div>}>
          <DashboardContent/>
        </Suspense>
      </div>
    </main>
  )
};