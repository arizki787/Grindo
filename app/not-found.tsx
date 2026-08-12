import Link from "next/link";
import { BiErrorCircle, BiHomeAlt } from "react-icons/bi";
import { BackgroundDecor } from "./page";
import Sidebar from "./ui/Sidebar";

export default function NotFound(){
    return(
        <main className="flex min-h-screen flex-col md:flex-row bg-dark-espresso relative overflow-hidden">
            <BackgroundDecor/>
            <Sidebar activeTab={""}/>
            <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 md:p-12 relative z-10 overflow-y-auto w-full min-h-[calc(100vh-80px)] md:min-h-screen">
                <div className="flex w-full max-w-md flex-col items-center text-center bg-[#141e0f]/40 backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-8 sm:p-12 rounded-4xl relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-[#a3e635]/10 border border-[#a3e635]/20 flex items-center justify-center mb-6 shadow-inner">
                        <BiErrorCircle className="w-10 h-10 text-[#a3e635]" />
                    </div>

                    <span className="text-6xl sm:text-7xl font-extrabold font-mono text-stone-50 tracking-wider mb-2">
                        404
                    </span>

                    <h2 className="text-stone-50 text-xl font-bold tracking-[0.2em] font-heading uppercase mb-3">
                        Tab Not Found
                    </h2>

                    <p className="text-stone-300 text-sm leading-relaxed mb-8 max-w-xs font-sans">
                        The tab or page you are looking for does not exist or has been moved.
                    </p>

                    <Link
                        href="/?tab=focus"
                        className="flex items-center gap-2 rounded-xl bg-[#a3e635] px-6 py-3 text-sm font-bold text-dark-espresso hover:bg-opacity-90 transition-all shadow-md active:scale-95 no-underline cursor-pointer"
                    >
                        <BiHomeAlt className="w-5 h-5" />
                        Back to Focus
                    </Link>
                </div>
            </div>
        </main>
    )
}