
import React from 'react';
import { UserRole } from '../types';

interface NavbarProps {
  onOpenPortal: () => void;
  onTabChange: (tab: string) => void;
  currentTab: string;
  userRole: UserRole | null;
  onLogout: () => void;
  onToggleSidebar?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenPortal, onTabChange, currentTab, userRole, onLogout, onToggleSidebar }) => {
  const isCustomer = !userRole || userRole === UserRole.CUSTOMER;
  const isManagement = userRole && userRole !== UserRole.CUSTOMER;

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-3xl border-b border-slate-100 z-[50] transition-all duration-300">
      <div className={`h-24 px-6 lg:px-12 flex items-center justify-between mx-auto ${isCustomer ? 'max-w-[1440px]' : 'w-full'}`}>
        <div className="flex items-center space-x-6 lg:space-x-14">
          {isManagement && (
            <button 
              onClick={onToggleSidebar}
              className="p-3 text-slate-900 hover:bg-slate-100 rounded-2xl transition-all active:scale-90"
              aria-label="Toggle Side Navigation"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          )}
          
          <div className="cursor-pointer group flex items-center" onClick={() => onTabChange('home')}>
            <h1 className="brand-font text-2xl lg:text-4xl text-slate-900 leading-none uppercase tracking-tighter">
              The Container <span className="text-orange-600 transition-colors group-hover:text-orange-700">Biryani</span>
            </h1>
          </div>
          
          {isCustomer && (
            <div className="hidden xl:flex items-center space-x-12">
              {['home', 'menu', 'orders'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => onTabChange(tab)}
                  className={`text-[11px] font-black uppercase tracking-[0.4em] transition-all relative py-3 group ${
                    currentTab === tab ? 'text-orange-600' : 'text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {tab === 'orders' ? 'Order Unit' : tab}
                  <span className={`absolute bottom-0 left-0 h-[2px] bg-orange-600 rounded-full transition-all duration-500 ${currentTab === tab ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-1/2 group-hover:opacity-50'}`}></span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4 lg:space-x-8">
          {isManagement ? (
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{userRole}</span>
                <span className="text-[8px] font-black text-green-500 uppercase tracking-widest flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                  Authorized
                </span>
              </div>
              <button 
                onClick={onLogout}
                className="text-slate-900 hover:text-red-600 text-[10px] font-black uppercase tracking-widest px-4 py-2 border border-slate-100 hover:border-red-100 rounded-xl transition-all active:scale-95"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3 lg:space-x-5">
              <button 
                onClick={() => onTabChange('orders')}
                className="xl:hidden bg-orange-600 text-white px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-orange-900/30 active:scale-95 transition-all"
              >
                Order
              </button>
              <button 
                onClick={onOpenPortal}
                className="flex items-center space-x-4 bg-slate-950 text-white px-8 py-4 rounded-2xl text-[10px] lg:text-[11px] font-black hover:bg-slate-900 transition-all uppercase tracking-[0.3em] shadow-2xl shadow-slate-950/20 active:scale-95 border border-slate-800"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                <span className="hidden sm:block">Portal Access</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
