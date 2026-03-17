
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MenuManager from './components/MenuManager';
import OrderUnit from './components/OrderSystem';
import KitchenDisplay from './components/KitchenDisplay';
import OrderManagement from './components/OrderManagement';
import TableManager from './components/TableManager';
import InventoryManager from './components/InventoryManager';
import ContentManager from './components/ContentManager';
import Dashboard from './components/Dashboard';
import { UserRole, MenuItem, Order, OrderStatus, Table, InventoryItem, HomePageContent } from './types';
import { INITIAL_MENU, INITIAL_TABLES, INITIAL_INVENTORY, INITIAL_HOME_CONTENT } from './constants';

const AUTH_CREDENTIALS = {
  [UserRole.ADMIN]: 'TheContainerAdmin@123',
  [UserRole.STAFF]: 'TheContainerStaff@123',
  [UserRole.CHEF]: 'TheContainerChef@123'
};

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [menu, setMenu] = useState<MenuItem[]>(INITIAL_MENU);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tables, setTables] = useState<Table[]>(INITIAL_TABLES);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [homePageContent, setHomePageContent] = useState<HomePageContent>(INITIAL_HOME_CONTENT);
  
  // Connectivity State
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Portal Login State
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [loginMode, setLoginMode] = useState<'CHOICE' | 'PASSWORD'>('CHOICE');
  const [pendingRole, setPendingRole] = useState<UserRole | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const isManagementView = userRole === UserRole.ADMIN || userRole === UserRole.STAFF || userRole === UserRole.CHEF;

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleResize = () => {
      if (window.innerWidth >= 1024 && isManagementView) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    // Auto-reset table status every 30 minutes
    const tableResetInterval = setInterval(() => {
        setTables(prevTables => 
            prevTables.map(table => 
                table.status === 'OCCUPIED' ? { ...table, status: 'AVAILABLE' } : table
            )
        );
    }, 30 * 60 * 1000); // 30 minutes in milliseconds

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('resize', handleResize);
      clearInterval(tableResetInterval); // Clear interval on component unmount
    };
  }, [isManagementView]);

  const handlePortalLogin = (role: UserRole) => {
    setPendingRole(role);
    setLoginMode('PASSWORD');
    setError('');
  };

  const verifyPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (pendingRole && password === AUTH_CREDENTIALS[pendingRole as keyof typeof AUTH_CREDENTIALS]) {
      setUserRole(pendingRole);
      setIsPortalOpen(false);
      setLoginMode('CHOICE');
      if (pendingRole === UserRole.CHEF) setActiveTab('kitchen');
      else if (pendingRole === UserRole.STAFF) setActiveTab('menu');
      else setActiveTab('dashboard');
      setPendingRole(null);
      setPassword('');
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    setActiveTab('home');
    setIsSidebarOpen(false);
  };

  const handlePlaceOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
    // If it's a dine-in order, update the table status
    if (order.type === 'DINE_IN' && order.tableNumber) {
        setTables(prevTables => prevTables.map(table => 
            table.number === order.tableNumber ? { ...table, status: 'OCCUPIED' } : table
        ));
    }
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    const orderToUpdate = orders.find(o => o.id === id);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));

    // If order is delivered or cancelled, make the table available again
    if (orderToUpdate && (status === OrderStatus.DELIVERED || status === OrderStatus.CANCELLED) && orderToUpdate.tableNumber) {
        setTables(prevTables => prevTables.map(table => 
            table.number === orderToUpdate.tableNumber ? { ...table, status: 'AVAILABLE' } : table
        ));
    }
  };

  const renderHome = () => (
    <div className="flex flex-col items-center w-full bg-white overflow-hidden animate-in fade-in duration-700">
      
      {/* 01. TECHNICAL DATA MARQUEE */}
      <div className="fixed top-24 left-0 right-0 bg-slate-950 py-3 border-b border-orange-500/30 z-[55] overflow-hidden backdrop-blur-md">
        <div className="flex whitespace-nowrap animate-marquee">
          {Array(10).fill(null).map((_, i) => (
            <div key={i} className="flex items-center space-x-12 px-12">
              <span className="text-orange-500 font-mono text-[9px] uppercase tracking-[0.4em] flex items-center">
                <span className="w-1.5 h-1.5 bg-orange-600 rounded-full mr-3 animate-pulse"></span> SYSTEM_READY: KADATHUR_NODE
              </span>
              <span className="text-slate-700 font-bold">/</span>
              <span className="text-white font-mono text-[9px] uppercase tracking-[0.4em]">LOC: KADATHUR, TAMIL NADU</span>
              <span className="text-slate-700 font-bold">/</span>
              <span className="text-slate-400 font-mono text-[9px] uppercase tracking-[0.4em]">SERVICES: DINE-IN_TAKEAWAY_DRIVE-THRU</span>
              <span className="text-slate-700 font-bold">/</span>
            </div>
          ))}
        </div>
      </div>

      {/* 02. CORE PROTOCOL (HERO) */}
      <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center bg-slate-950 overflow-hidden px-6 pt-24">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=2000" 
            className="w-full h-full object-cover grayscale opacity-30 scale-110" 
            alt="The Container Biryani Industrial Exterior"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/70 to-slate-950"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>

        <div className="relative z-10 max-w-7xl w-full text-center">
          <div className="inline-flex items-center space-x-6 border border-white/10 px-8 py-3 rounded-full bg-white/5 backdrop-blur-3xl mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></span>
            <span className="text-white font-mono text-[10px] uppercase tracking-[0.6em]">KADATHUR_LANDMARK_PROTOCOL</span>
          </div>

          <h2 className="brand-font text-6xl md:text-[10rem] lg:text-[14rem] text-white leading-[0.8] uppercase tracking-tighter mb-12" dangerouslySetInnerHTML={{ __html: homePageContent.hero.title }}></h2>

          <div className="max-w-4xl mx-auto space-y-12">
            <p className="font-inter text-slate-400 text-lg md:text-3xl leading-relaxed font-medium opacity-90 tracking-tight" dangerouslySetInnerHTML={{ __html: homePageContent.hero.subtitle }}></p>
            
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center pt-8">
              <button 
                onClick={() => setActiveTab('orders')} 
                className="w-full sm:w-auto bg-orange-600 hover:bg-orange-500 text-white px-16 py-8 rounded-[2rem] font-black text-xs uppercase tracking-[0.5em] transition-all transform hover:-translate-y-2 active:scale-95 shadow-[0_40px_80px_rgba(234,88,12,0.4)]"
              >
                Access Menu
              </button>
              <button 
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} 
                className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white px-16 py-8 rounded-[2rem] font-black text-xs uppercase tracking-[0.5em] border border-white/20 backdrop-blur-xl transition-all hover:-translate-y-2"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 03. ABOUT THE CONTAINER BIRYANI */}
      <section id="about" className="w-full bg-white py-32 lg:py-48 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="relative group">
            <div className="absolute -inset-10 bg-slate-50 rounded-[5rem] rotate-3 transition-transform group-hover:rotate-0"></div>
            <img 
              src="https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=1200" 
              className="relative rounded-[4rem] shadow-2xl transition-all duration-1000 group-hover:scale-[1.02]" 
              alt="Multi-level container architecture"
            />
            <div className="absolute bottom-12 right-12 bg-orange-600 text-white p-8 rounded-[2rem] shadow-2xl">
               <p className="font-mono text-[10px] uppercase tracking-widest font-black">ESTD_PROTOCOL</p>
               <p className="brand-font text-3xl uppercase">KADATHUR NODE</p>
            </div>
          </div>
          
          <div className="space-y-12">
            <div>
              <span className="text-orange-600 font-black text-[10px] uppercase tracking-[0.7em] block mb-6">Innovative Architecture</span>
              <h3 className="brand-font text-5xl lg:text-8xl text-slate-950 uppercase leading-[0.8] tracking-tighter" dangerouslySetInnerHTML={{ __html: homePageContent.about.title }}></h3>
            </div>
            
            <div className="space-y-8">
              <p className="text-slate-500 text-xl leading-relaxed font-medium">{homePageContent.about.description}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8">
                {homePageContent.about.features.map((feat, i) => (
                  <div key={i} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:border-orange-200 transition-colors">
                    <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-4">{feat.title}</p>
                    <p className="text-slate-600 text-sm font-semibold leading-relaxed">{feat.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 04. CULINARY HIGHLIGHTS */}
      <section className="w-full bg-slate-950 py-32 lg:py-56 px-6 relative">
        <div className="max-w-7xl mx-auto text-center mb-32">
          <span className="text-orange-500 font-mono text-[10px] uppercase tracking-[1em] mb-6 block">Culinary_Protocol</span>
          <h3 className="brand-font text-6xl lg:text-[10rem] text-white uppercase tracking-tighter leading-none" dangerouslySetInnerHTML={{ __html: homePageContent.culinary.title }}></h3>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Biryani Specialist */}
          <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-[4rem] p-12 lg:p-20 backdrop-blur-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 rounded-full blur-[100px]"></div>
            <div className="relative z-10 flex flex-col md:flex-row gap-16 items-center">
              <div className="flex-1 space-y-8">
                <span className="text-orange-500 font-mono text-[10px] uppercase tracking-widest font-black">BIRYANI_SPECIALTIES</span>
                <h4 className="brand-font text-5xl lg:text-7xl text-white uppercase tracking-tighter" dangerouslySetInnerHTML={{ __html: homePageContent.culinary.specialtyTitle }}></h4>
                <p className="text-slate-400 text-lg leading-relaxed font-medium">{homePageContent.culinary.specialtyDescription}</p>
                <div className="flex space-x-4">
                   <span className="bg-white/10 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest">TRADITIONAL</span>
                   <span className="bg-white/10 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest">AROMATIC</span>
                </div>
              </div>
              <div className="w-full md:w-64 aspect-square rounded-[3rem] overflow-hidden border border-white/20">
                 <img src="https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=600" className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="Pot Biryani" />
              </div>
            </div>
          </div>

          {/* Must Try List */}
          <div className="bg-orange-600 rounded-[4rem] p-12 lg:p-16 flex flex-col justify-between">
            <div className="space-y-8">
              <h4 className="brand-font text-5xl text-white uppercase tracking-tighter">MUST_TRY <br/>UNITS</h4>
              <ul className="space-y-6">
                {homePageContent.culinary.mustTry.map((item, i) => (
                  <li key={i} className="flex items-center text-white space-x-4 group">
                    <span className="text-[10px] font-mono opacity-40">0{i+1}</span>
                    <span className="text-lg font-black uppercase tracking-tight group-hover:translate-x-2 transition-transform">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-white/60 text-[10px] font-mono uppercase tracking-widest mt-12">South Indian & Tandoori Specialties</p>
          </div>
        </div>
      </section>

      {/* 05. VISITOR INSIGHTS */}
      <section className="w-full bg-white py-32 lg:py-56 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-24">
             <span className="text-slate-400 font-mono text-[10px] uppercase tracking-[0.5em] mb-4 block">FIELD_INTELLIGENCE</span>
             <h3 className="brand-font text-5xl lg:text-8xl text-slate-950 uppercase tracking-tighter">VISITOR <span className="text-orange-600">INSIGHTS</span></h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="p-12 bg-slate-50 rounded-[3.5rem] border border-slate-100 space-y-8">
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h4 className="font-black text-slate-900 uppercase tracking-widest text-sm">SERVICE TIP</h4>
              <p className="text-slate-500 text-lg leading-relaxed italic font-medium">{homePageContent.insights.serviceTip}</p>
            </div>
            
            <div className="p-12 bg-slate-950 rounded-[3.5rem] border border-slate-900 space-y-8">
              <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h4 className="font-black text-white uppercase tracking-widest text-sm">ATMOSPHERE</h4>
              <p className="text-slate-400 text-lg leading-relaxed italic font-medium">{homePageContent.insights.atmosphere}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 06. GLOBAL FOOTER (BUSINESS INFO) */}
      <footer className="w-full bg-slate-950 text-white py-24 lg:py-48 px-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[150px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-32">
            <div className="space-y-12">
              <h1 className="brand-font text-7xl lg:text-[10rem] uppercase leading-none tracking-tighter">THE <br/><span className="text-orange-600">CONTAINER</span></h1>
              <div className="space-y-6 max-w-lg">
                <p className="text-[10px] font-mono text-orange-500 uppercase tracking-[0.5em]">Primary_Terminal_Address</p>
                <p className="text-2xl lg:text-4xl text-white font-medium tracking-tight leading-tight">
                  Opposite Arun Mahalakshmi Hospital, Dharmapuri Main Road, Kadathur, Tamil Nadu 635303.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-16 lg:pt-16">
              <div className="space-y-6">
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.5em]">Operational_Hours</p>
                <p className="text-xl font-black uppercase tracking-tighter">11:30 AM — 10:00 PM</p>
                <p className="text-slate-500 text-xs font-bold tracking-widest uppercase">Open Daily</p>
              </div>
              <div className="space-y-6">
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.5em]">Command_Contact</p>
                <p className="text-xl font-black uppercase tracking-tighter">+91 96773 73327</p>
                <p className="text-slate-500 text-xs font-bold tracking-widest uppercase">Direct Terminal Line</p>
              </div>
              <div className="space-y-6">
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.5em]">Settlement_Methods</p>
                <p className="text-xs font-black uppercase tracking-widest opacity-80">UPI / CREDIT CARDS / DEBIT CARDS</p>
              </div>
              <div className="space-y-6">
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.5em]">Services_Provided</p>
                <p className="text-xs font-black uppercase tracking-widest opacity-80">Dine-in / Takeaway / Drive-through</p>
              </div>
            </div>
          </div>
          
          <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-slate-700 font-mono text-[9px] uppercase tracking-widest italic">© 2025 CONTAINER_BIRYANI // ALL_RIGHTS_RESERVED</p>
            <div className="flex space-x-12">
               <a 
                 href="https://wa.me/919677373327" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 className="text-[10px] font-mono text-slate-500 hover:text-orange-500 transition-colors tracking-widest font-black flex items-center gap-3 group"
               >
                 <svg className="w-5 h-5 fill-current text-[#25D366] group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                   <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.767 5.77 0 1.268.412 2.454 1.163 3.307l-.447 1.701 1.742-.442c.795.53 1.741.838 2.76.838 3.182 0 5.77-2.587 5.77-5.77s-2.587-5.704-5.77-5.704zm2.96 8.35c-.12.33-.708.641-1.02.7-.32.06-.708.106-1.12.06-.412-.046-.944-.197-1.464-.412-.52-.215-1.11-.53-1.636-.917-.52-.387-.962-.84-1.353-1.32-.39-.48-.686-1.01-.866-1.5-.18-.49-.24-.955-.17-1.336.07-.38.307-.723.636-1.002.33-.28.741-.444 1.1-.444.15 0 .28.01.4.03.12.02.24.04.34.12.1.08.2.22.28.37.08.15.2.45.28.74.08.29.17.61.17.65 0 .04-.01.12-.07.2-.06.08-.13.15-.2.23l-.15.15c-.07.07-.15.15-.07.26.08.11.33.54.71.88.38.34.7.53.86.61.16.08.25.06.31 0 .06-.06.26-.3.33-.4.07-.1.14-.15.22-.15.08 0 .52.25.86.42.34.17.57.29.65.34.08.05.15.11.17.18s.02.43-.1.76z"/>
                   <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.981-3.593c-.61-1.062-.936-2.281-.936-3.522 0-3.74 3.041-6.781 6.782-6.781 1.812 0 3.515.705 4.79 1.983 1.275 1.277 1.977 2.983 1.977 4.797 0 3.741-3.041 6.782-6.782 6.782h-.117z"/>
                 </svg>
                 WHATSAPP
               </a>
               <a 
                 href="https://www.instagram.com/thecontainerbiryani/" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 className="text-[10px] font-mono text-slate-500 hover:text-orange-500 transition-colors tracking-widest font-black flex items-center gap-3 group"
               >
                 <svg className="w-5 h-5 fill-current text-[#E4405F] group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                   <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                 </svg>
                 INSTAGRAM
               </a>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 30s linear infinite; }
      `}</style>
    </div>
  );

  const renderContent = () => {
    if (activeTab === 'home') return renderHome();
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="p-4 lg:p-12">
            <Dashboard orders={orders} menu={menu} inventory={inventory} tables={tables} />
          </div>
        );
      case 'menu': return <div className="p-4 lg:p-12"><MenuManager menu={menu} userRole={userRole} onAdd={(item) => setMenu(prev => [item, ...prev])} onUpdate={(item) => setMenu(prev => prev.map(m => m.id === item.id ? item : m))} onDelete={(id) => setMenu(prev => prev.filter(m => m.id !== id))} /></div>;
      case 'orders': return <div className="p-4 lg:p-12">{userRole === UserRole.ADMIN || userRole === UserRole.STAFF ? <OrderManagement orders={orders} onUpdateStatus={updateOrderStatus} userRole={userRole} /> : <OrderUnit menu={menu} onPlaceOrder={handlePlaceOrder} tables={tables} />}</div>;
      case 'kitchen': return <div className="p-4 lg:p-12"><KitchenDisplay orders={orders} onUpdateStatus={updateOrderStatus} /></div>;
      case 'tables': return <div className="p-4 lg:p-12"><TableManager tables={tables} userRole={userRole || UserRole.CUSTOMER} onAdd={(table) => setTables(prev => [...prev, table])} onUpdate={(table) => setTables(prev => prev.map(t => t.id === table.id ? table : t))} onDelete={(id) => setTables(prev => prev.filter(t => t.id !== id))} /></div>;
      case 'inventory': return <div className="p-4 lg:p-12"><InventoryManager inventory={inventory} userRole={userRole!} onAdd={(item) => setInventory(prev => [item, ...prev])} onUpdate={(item) => setInventory(prev => prev.map(i => i.id === item.id ? item : i))} onDelete={(id) => setInventory(prev => prev.filter(i => i.id !== id))} /></div>;
      case 'content': return <div className="p-4 lg:p-12"><ContentManager content={homePageContent} onUpdate={setHomePageContent} /></div>;
      default: return <div>Select a tab</div>;
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-950 font-inter selection:bg-orange-100 selection:text-orange-950 overflow-x-hidden">
      {/* Offline Overlay */}
      {!isOnline && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950 overflow-hidden animate-in fade-in duration-500">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.05]"></div>
          
          <div className="relative z-10 max-w-md w-full px-12 text-center flex flex-col items-center">
            <div className="relative mb-16">
               <div className="w-32 h-32 border-4 border-slate-900 rounded-full flex items-center justify-center">
                 <svg className="w-16 h-16 text-orange-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3" /></svg>
               </div>
               <div className="absolute -bottom-2 -right-2 bg-red-600 w-8 h-8 rounded-full border-4 border-slate-950 flex items-center justify-center">
                 <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
               </div>
            </div>
            
            <h1 className="brand-font text-4xl text-white uppercase tracking-tighter mb-4">Network Link <span className="text-orange-600 italic">Severed</span></h1>
            <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-slate-500 mb-12">System Offline // Check your internet connection</p>
            
            <div className="w-full h-[1px] bg-slate-900 mb-12 relative overflow-hidden">
               <div className="absolute inset-y-0 left-0 bg-orange-600 w-1/3 animate-loading-bar shadow-[0_0_15px_rgba(234,88,12,0.8)]"></div>
            </div>
            
            <p className="text-slate-700 font-mono text-[9px] uppercase tracking-widest leading-loose">
              Re-establishing telemetry with Kadathur Node... <br/>
              Automatic recovery engaged.
            </p>
          </div>
          
          <style>{`
            @keyframes loading-bar {
              0% { left: -30%; }
              100% { left: 100%; }
            }
            .animate-loading-bar {
              animation: loading-bar 2s linear infinite;
            }
          `}</style>
        </div>
      )}

      {isManagementView && (
        <Sidebar 
          currentTab={activeTab} onTabChange={setActiveTab} userRole={userRole!} onLogout={handleLogout} 
          isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} 
        />
      )}
      <Navbar 
        onOpenPortal={() => setIsPortalOpen(true)} onTabChange={setActiveTab} currentTab={activeTab} 
        userRole={userRole} onLogout={handleLogout} onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
      />
      
      <main className={`transition-all duration-700 ease-in-out ${
        isManagementView && isSidebarOpen ? 'lg:ml-64' : 'ml-0'
      } pt-36 lg:pt-44 pb-12`}>
        <div className="w-full flex justify-center">
          <div className="w-full">
            {renderContent()}
          </div>
        </div>
      </main>

      {/* Portal Login Modal */}
      {isPortalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-500 px-6">
          <div className="relative max-w-lg w-full bg-white rounded-[4rem] shadow-2xl flex flex-col animate-in zoom-in-95 duration-300 overflow-hidden">
            <button onClick={() => setIsPortalOpen(false)} className="absolute top-10 right-10 p-4 text-slate-300 hover:text-slate-950 transition-colors z-20">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="p-12 lg:p-16 text-center bg-slate-50 border-b border-slate-100">
              <h1 className="brand-font text-4xl text-slate-950 mb-2 uppercase tracking-tight">TERMINAL_LINK</h1>
              <p className="font-inter text-orange-600 font-bold tracking-[0.4em] text-[10px] uppercase">Secure Management Access</p>
            </div>
            <div className="p-12 lg:p-16">
              {loginMode === 'CHOICE' ? (
                <div className="space-y-4">
                  {[
                    { role: UserRole.ADMIN, label: 'Administrator', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
                    { role: UserRole.STAFF, label: 'Ops Staff', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                    { role: UserRole.CHEF, label: 'Kitchen Master', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' }
                  ].map(btn => (
                    <button 
                      key={btn.role} onClick={() => handlePortalLogin(btn.role)} 
                      className="w-full p-6 border border-slate-100 hover:border-orange-500 hover:bg-orange-50 rounded-3xl font-bold text-slate-800 flex justify-between items-center transition-all group uppercase text-xs tracking-widest shadow-sm"
                    >
                      <div className="flex items-center">
                        <span className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mr-6 group-hover:bg-orange-100 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={btn.icon} /></svg>
                        </span>
                        {btn.label}
                      </div>
                      <span className="text-slate-300 group-hover:text-orange-500 transition-transform group-hover:translate-x-2">→</span>
                    </button>
                  ))}
                </div>
              ) : (
                <form onSubmit={verifyPassword} className="space-y-8">
                  <div className="flex items-center justify-between">
                    <button type="button" onClick={() => setLoginMode('CHOICE')} className="text-slate-400 hover:text-slate-950 text-[10px] font-bold uppercase tracking-widest flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
                      Back
                    </button>
                    <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">{pendingRole} Access</span>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Protocol Key</label>
                    <input 
                      type="password" autoFocus required
                      className="w-full p-6 bg-slate-50 border border-slate-100 rounded-3xl focus:border-orange-500 outline-none transition-all font-black text-2xl tracking-[0.5em] text-center"
                      value={password} onChange={(e) => setPassword(e.target.value)} 
                    />
                    {error && <p className="text-[10px] text-red-600 font-bold uppercase tracking-tight text-center mt-4">{error}</p>}
                  </div>
                  <button type="submit" className="w-full py-6 bg-slate-950 text-white rounded-3xl font-bold hover:bg-slate-900 transition-all uppercase tracking-widest text-[11px] shadow-2xl">Authorize Identity</button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
