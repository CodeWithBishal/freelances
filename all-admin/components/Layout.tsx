import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Menu, Hexagon } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#030304] text-zinc-100 selection:bg-violet-500/30 font-sans">
      {/* Dynamic Background */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-[#030304]">
        <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none mix-blend-overlay"></div>
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-violet-900/10 to-transparent pointer-events-none blur-3xl"></div>
      </div>
      
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 md:ml-64 relative z-10">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-30">
           <div className="flex items-center gap-2">
              <Hexagon className="w-6 h-6 text-violet-500" />
              <span className="font-bold text-white tracking-widest text-sm">THE TECH ARCH</span>
           </div>
           <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-zinc-400 hover:text-white">
             <Menu className="w-6 h-6" />
           </button>
        </div>

        <main className="p-4 md:p-10 max-w-[1600px] mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};