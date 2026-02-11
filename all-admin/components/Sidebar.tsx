import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, ShoppingCart, Settings, LogOut, Hexagon, FileText, X, CheckSquare } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/clients', icon: Users, label: 'Clients' },
    { to: '/orders', icon: ShoppingCart, label: 'Orders' },
    { to: '/quotes', icon: FileText, label: 'Quotes' },
    { to: '/todos', icon: CheckSquare, label: 'Tasks' },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <div className={clsx(
        "flex flex-col w-64 h-screen bg-black/95 md:bg-black/80 backdrop-blur-2xl border-r border-white/5 fixed left-0 top-0 z-50 transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="flex items-center justify-between px-6 h-24 border-b border-white/5">
          <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative">
                  <div className="absolute inset-0 bg-violet-600 blur-lg opacity-40 group-hover:opacity-60 transition-opacity rounded-full"></div>
                  <div className="relative bg-zinc-900 p-2 rounded-xl border border-white/10 group-hover:border-violet-500/50 transition-colors">
                      <Hexagon className="w-5 h-5 text-white" />
                  </div>
              </div>
              <div>
                  <h1 className="text-sm font-bold tracking-widest text-white uppercase">TheTechArch</h1>
                  <p className="text-[10px] text-zinc-500 tracking-wide">V 2.0.26</p>
              </div>
          </div>
          {/* Close button for mobile */}
          <button onClick={onClose} className="md:hidden text-zinc-500 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => onClose()} // Close sidebar on navigate (mobile)
              className={({ isActive }) =>
                clsx(
                  'flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 text-sm font-medium group relative overflow-hidden',
                  isActive
                    ? 'text-white'
                    : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'
                )
              }
            >
              {({ isActive }) => (
                  <>
                      {isActive && (
                          <motion.div 
                              layoutId="activeNav"
                              className="absolute inset-0 bg-violet-500/10 border border-violet-500/20 rounded-xl"
                              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                      )}
                      <item.icon className={clsx("w-5 h-5 mr-3 relative z-10 transition-colors duration-300", isActive ? "text-violet-400" : "text-zinc-600 group-hover:text-zinc-300")} />
                      <span className="relative z-10">{item.label}</span>
                  </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button className="flex items-center px-4 py-3 w-full text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl transition-all text-sm font-medium group">
            <Settings className="w-5 h-5 mr-3 text-zinc-600 group-hover:text-zinc-300 transition-colors" />
            <span>Settings</span>
          </button>
          <div className="mt-6 flex items-center gap-3 px-3 py-3 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-white/10 transition-colors cursor-pointer group">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 p-[1px]">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                      <span className="text-xs font-bold text-white">AD</span>
                  </div>
              </div>
              <div className="flex-1">
                  <p className="text-xs font-semibold text-white group-hover:text-violet-200 transition-colors">Alex Designer</p>
                  <p className="text-[10px] text-zinc-600">Admin</p>
              </div>
              <LogOut className="w-4 h-4 text-zinc-600 hover:text-rose-400 transition-colors" />
          </div>
        </div>
      </div>
    </>
  );
};