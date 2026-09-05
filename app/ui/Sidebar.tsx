import { BiLeaf, BiStopwatch, BiEnvelope, BiCog, BiBarChartAlt2 } from 'react-icons/bi';
import Link from 'next/link';

export default function Sidebar({ activeTab = 'focus'}: { activeTab?:string}) {
  return (
    <aside className="w-full md:w-64 h-auto flex flex-col md:min-h-screen pt-6 md:pt-8 md:pb-0 border-b md:border-b-0 md:border-r border-white/5 relative z-10 px-6">
      <div className="flex items-center gap-2 md:mb-16 mb-16 pl-2 justify-between md:justify-start">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold font-heading text-foreground">Grindo</h1>
          <BiLeaf className="w-6 h-6 text-olive-green" />
        </div>
      </div>

      <nav className="flex flex-row justify-center md:flex-col md:justify-start gap-4 pr-0 md:pr-6">
        <Link
          href="/?tab=focus"
          className={`flex items-center gap-4 px-4 py-3 rounded-r-full rounded-l-md border-l-4 transition-all shadow-sm no-underline ${
            activeTab === 'focus'
              ? 'bg-[#141e0f]/40 border-l-4 border-olive-green text-foreground'
              : 'border-transparent text-foreground/60 hover:text-foreground'
          }`}
        >
          <BiStopwatch className={`w-6 h-6 ${activeTab === 'focus' ? 'text-olive-green' : ''}`} />
          <span className="hidden md:inline font-semibold tracking-wide">Focus</span>
        </Link>

        <Link
          href="/?tab=report"
          className={`flex items-center gap-4 px-4 py-3 rounded-r-full rounded-l-md border-l-4 transition-all shadow-sm no-underline ${
            activeTab === 'report'
              ? 'bg-[#141e0f]/40 border-l-4 border-olive-green text-foreground'
              : 'border-transparent text-foreground/60 hover:text-foreground'
          }`}
        >
          <BiBarChartAlt2 className={`w-6 h-6 ${activeTab === 'report' ? 'text-olive-green' : ''}`} />
          <span className="hidden md:inline font-semibold tracking-wide">Report</span>
        </Link>

        <Link
          href='/?tab=settings'
          className={`flex items-center gap-4 px-4 py-3 rounded-r-full rounded-l-md border-l-4 transition-all shadow-sm no-underline ${
            activeTab === 'settings'
              ? 'bg-[#141e0f]/40 border-l-4 border-olive-green text-foreground'
              : 'border-transparent text-foreground/60 hover:text-foreground'
          }`}
        >
          <BiCog className={`w-6 h-6 ${activeTab === 'settings' ? 'text-olive-green' : ''}`}/>
          <span className='hidden md:inline font-semibold tracking-wide'>Settings</span>
        </Link>

        <a 
          href="https://adxtinsight.site" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-4 px-4 py-3 text-foreground/60 hover:text-foreground transition-colors pl-[1.25rem] no-underline"
        >
          <BiEnvelope className="w-6 h-6" />
          <span className="hidden md:inline font-medium tracking-wide">Contact</span>
        </a>
      </nav>
    </aside>
  );
}
