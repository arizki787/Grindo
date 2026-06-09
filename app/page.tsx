import { Suspense } from "react";
import type { Task } from "./lib/definition";
import { fetchActiveTasks } from './lib/data';
import DashboardClient from "./ui/DashboardClient";
import Sidebar from "./ui/Sidebar";
import { createClient } from "@/utils/supabase/server";
import AuthButton from "./ui/AuthButton";

async function DashboardContent({ user }: { user: any }) {
  let activeTasks: Task[] = [];

  try {
    activeTasks = await fetchActiveTasks();
  } catch(error) {
    console.error(error);
    throw new Error('Database Error: Failed to fetch data tasks');
  }

  return <DashboardClient tasks={activeTasks} user={user}/>;
} 

export default async function Home(){
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return(
    <main className="flex min-h-screen bg-dark-espresso relative overflow-hidden">
      {/* Advanced Ambient Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(217,119,6,0.18),transparent_65%)] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(35,57,21,0.45),transparent_60%)] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(63,84,38,0.12),transparent_50%)] pointer-events-none z-0" />

      {/* Layered Wavy Vector Segments & Decorative Curves */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none select-none z-0" 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 1920 1080" 
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="wave-grad-1" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d97706" stopOpacity="0.07" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.02" />
            <stop offset="100%" stopColor="#2A1608" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="wave-grad-2" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d97706" stopOpacity="0.04" />
            <stop offset="60%" stopColor="#b45309" stopOpacity="0.01" />
            <stop offset="100%" stopColor="#2A1608" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Wave Layer 1 */}
        <path 
          d="M 1200,0 C 1450,220 1350,580 1200,820 C 1050,1060 1150,1020 1250,1080 L 1920,1080 L 1920,0 Z" 
          fill="url(#wave-grad-1)" 
          stroke="rgba(253, 251, 247, 0.04)" 
          strokeWidth="1"
        />

        {/* Wave Layer 2 */}
        <path 
          d="M 1500,0 C 1650,180 1550,520 1450,770 C 1350,1020 1450,1020 1530,1080 L 1920,1080 L 1920,0 Z" 
          fill="url(#wave-grad-2)" 
          stroke="rgba(253, 251, 247, 0.03)" 
          strokeWidth="1"
        />

        {/* Wavy stroke details for depth */}
        <path 
          d="M 0,380 C 400,280 600,480 900,430 C 1200,380 1300,580 1600,500 C 1900,420 2000,630 2200,530" 
          fill="none" 
          stroke="rgba(63, 84, 38, 0.07)" 
          strokeWidth="1.5" 
        />
        <path 
          d="M 0,410 C 420,310 620,510 920,460 C 1220,410 1320,610 1620,530 C 1920,450 2020,660 2220,560" 
          fill="none" 
          stroke="rgba(163, 230, 53, 0.02)" 
          strokeWidth="1" 
        />
      </svg>

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-start p-8 md:p-12 relative z-10 overflow-y-auto">
        {/* Top Header Section */}
        <div className="w-full max-w-3xl flex justify-end mb-6">
          <AuthButton user={user} />
        </div>

        <Suspense fallback={<div className="text-foreground mt-20">loading...</div>}>
          <DashboardContent user={user}/>
        </Suspense>
      </div>
    </main>
  )
};