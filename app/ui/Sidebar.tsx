import { BiLeaf, BiStopwatch, BiEnvelope } from 'react-icons/bi';

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen flex flex-col pt-8 border-r border-white/5 relative z-10 pl-6">
      <div className="flex items-center gap-2 mb-16 pl-2">
        <h1 className="text-3xl font-bold font-heading text-foreground">Grindo</h1>
        <BiLeaf className="w-6 h-6 text-olive-green" />
      </div>

      <nav className="flex flex-col gap-4 pr-6">
        <div className="flex items-center gap-4 px-4 py-3 rounded-r-full rounded-l-md bg-[#141e0f]/40 border-l-4 border-olive-green text-foreground cursor-pointer transition-colors shadow-sm">
          <BiStopwatch className="w-6 h-6 text-olive-green" />
          <span className="font-semibold tracking-wide">Focus</span>
        </div>
        
        <a 
          href="https://adxtinsight.site" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-4 px-4 py-3 text-foreground/60 hover:text-foreground transition-colors pl-[1.25rem] no-underline"
        >
          <BiEnvelope className="w-6 h-6" />
          <span className="font-medium tracking-wide">Contact</span>
        </a>
      </nav>
    </aside>
  );
}



