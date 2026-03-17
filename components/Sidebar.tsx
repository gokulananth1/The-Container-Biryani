
import React from 'react';
import { NAV_ITEMS } from '../constants';
import { UserRole } from '../types';

interface SidebarProps {
  currentTab: string;
  onTabChange: (id: string) => void;
  userRole: UserRole;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentTab, onTabChange, userRole, onLogout, isOpen, onClose }) => {
  if (userRole === UserRole.CUSTOMER) return null;

  const visibleItems = NAV_ITEMS.filter(item => item.roles.includes(userRole));

  const sidebarClasses = `
    w-64 bg-slate-900 h-[100dvh] flex flex-col text-white fixed left-0 top-0 overflow-y-auto z-[60] transition-transform duration-300 ease-in-out
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    pb-[env(safe-area-inset-bottom)]
  `;

  return (
    <>
      {/* Mobile-only Overlay: Visible when open and screen is small */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[55] lg:hidden backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      <div className={sidebarClasses}>
        <div className="shrink-0 p-6 border-b border-slate-800 flex justify-between items-center pt-[calc(1.5rem+env(safe-area-inset-top))]">
          <div>
            <h1 className="brand-font text-2xl text-orange-500 tracking-tight leading-tight uppercase">The Container</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">Management Portal</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2 active:scale-90 transition-transform">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <nav className="flex-1 mt-6 px-4 space-y-2 overflow-y-auto scrollbar-hide">
          {visibleItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                // On small screens, auto-close the sidebar when a tab is selected
                if (window.innerWidth < 1024) onClose();
              }}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
                currentTab === item.id 
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="font-bold text-sm uppercase tracking-wider">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="shrink-0 p-4 border-t border-slate-800 bg-slate-900/50 backdrop-blur-md">
          <div className="flex items-center space-x-3 mb-4 px-2">
            <div className="shrink-0 w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-sm font-black shadow-lg shadow-orange-500/20">
              {userRole.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-black truncate uppercase tracking-tighter">{userRole}</p>
              <p className="text-[10px] text-green-500 font-bold uppercase">Online</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full py-3 text-xs font-bold text-slate-400 hover:text-white hover:bg-red-900/20 rounded-xl transition-all border border-transparent hover:border-red-900/30"
          >
            SIGN OUT
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
