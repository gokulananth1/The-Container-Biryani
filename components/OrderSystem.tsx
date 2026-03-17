
import React, { useState, useMemo } from 'react';
import { MenuItem, Order, OrderStatus, OrderType, Table } from '../types';
import OrderSummary from './OrderSummary';

interface OrderUnitProps {
  menu: MenuItem[];
  onPlaceOrder: (order: Order) => void;
  tables: Table[];
}

const OrderUnit: React.FC<OrderUnitProps> = ({ menu, onPlaceOrder, tables }) => {
  const [cart, setCart] = useState<{ [id: string]: number }>({});
  const [orderType, setOrderType] = useState<OrderType>(OrderType.DINE_IN);
  const [tableNo, setTableNo] = useState('1');
  const [view, setView] = useState<'MENU' | 'CART'>('MENU');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [dietFilter, setDietFilter] = useState<'All' | 'Veg' | 'Non-Veg'>('All');

  const categories = useMemo(() => {
    const cats = ['All', ...new Set(menu.map(item => item.category))];
    return cats;
  }, [menu]);

  const filteredItems = useMemo(() => {
    return menu.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesDiet = dietFilter === 'All' || 
                          (dietFilter === 'Veg' && item.isVeg) || 
                          (dietFilter === 'Non-Veg' && !item.isVeg);
      
      return item.isAvailable && matchesSearch && matchesCategory && matchesDiet;
    });
  }, [menu, searchTerm, activeCategory, dietFilter]);

  const groupedMenu = useMemo(() => {
    const groups: { [key: string]: MenuItem[] } = {};
    filteredItems.forEach(item => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    });
    return groups;
  }, [filteredItems]);
  
  const tableStatus = useMemo(() => {
    if (orderType !== OrderType.DINE_IN) return null;
    const table = tables.find(t => t.number === tableNo);
    if (!table) return 'INVALID';
    return table.status;
  }, [tableNo, tables, orderType]);

  const addToCart = (id: string) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[id] > 1) newCart[id]--;
      else delete newCart[id];
      return newCart;
    });
  };

  const cartItemCount = Object.values(cart).reduce((a: number, b) => a + (b as number), 0);

  const handlePlaceOrder = () => {
    if (Object.keys(cart).length === 0) return;
    
    if (orderType === OrderType.DINE_IN && tableStatus !== 'AVAILABLE') {
        alert(`Cannot place order. Table ${tableNo} is ${tableStatus?.toLowerCase() || 'invalid'}.`);
        return;
    }

    const items = Object.entries(cart).map(([id, qty]) => ({
      item: menu.find(m => m.id === id)!,
      quantity: qty as number
    }));

    const subtotal = items.reduce((acc, item) => acc + (item.item.price * item.quantity), 0);

    const newOrder: Order = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      items,
      status: OrderStatus.PENDING,
      type: orderType,
      tableNumber: orderType === OrderType.DINE_IN ? tableNo : undefined,
      total: subtotal,
      timestamp: Date.now()
    };

    onPlaceOrder(newOrder);
    setCart({});
    setView('MENU');
    alert('Order placed successfully!');
  };

  return (
    <div className="flex flex-col gap-6 relative">
      {/* Universal Tab Switcher */}
      <div className="flex w-full max-w-md mx-auto bg-white/80 p-2 rounded-2xl border border-slate-100 shadow-sm mb-2 sticky top-[10rem] z-10 backdrop-blur-md">
        <button 
          onClick={() => setView('MENU')}
          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'MENU' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-400'}`}
        >
          Menu Selection
        </button>
        <button 
          onClick={() => setView('CART')}
          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'CART' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-400'}`}
        >
          Order Summary ({cartItemCount})
        </button>
      </div>

      {/* Menu View */}
      <div className={`flex-1 flex-col bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm ${view === 'CART' ? 'hidden' : 'flex'}`}>
        {/* Advanced Filters Bar */}
        <div className="shrink-0 p-4 lg:p-6 bg-slate-50/50 border-b border-slate-100 space-y-4">
           {/* Search & Diet Toggle */}
           <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input 
                  type="text"
                  placeholder="SEARCH DISHES..."
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex bg-white p-1 rounded-2xl border border-slate-200">
                {['All', 'Veg', 'Non-Veg'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setDietFilter(type as any)}
                    className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                      dietFilter === type 
                      ? 'bg-slate-900 text-white' 
                      : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
           </div>

           {/* Category Navigation Bar */}
           <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2">
             {categories.map(cat => (
               <button
                 key={cat}
                 onClick={() => setActiveCategory(cat)}
                 className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                   activeCategory === cat 
                   ? 'bg-orange-600 text-white border-orange-600 shadow-md' 
                   : 'bg-white text-slate-400 border-slate-200 hover:border-slate-400'
                 }`}
               >
                 {cat}
               </button>
             ))}
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-10 scroll-smooth">
          {filteredItems.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-300">
               <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               <p className="font-black uppercase tracking-widest text-xs">No matches found</p>
               <button onClick={() => {setSearchTerm(''); setDietFilter('All'); setActiveCategory('All');}} className="mt-4 text-orange-600 font-black text-[10px] uppercase underline">Clear Filters</button>
            </div>
          ) : (
            (Object.entries(groupedMenu) as [string, MenuItem[]][]).map(([category, items]) => (
              <section key={category} id={category.toLowerCase()} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <h3 className="brand-font text-2xl text-slate-900 mb-6 flex items-center uppercase tracking-widest">
                  <span className="w-8 h-[2px] bg-orange-500 mr-3"></span>
                  {category}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {items.map(item => (
                    <button 
                      key={item.id} 
                      onClick={() => addToCart(item.id)}
                      className="p-5 rounded-3xl border border-slate-50 bg-slate-50/30 hover:border-orange-500 hover:bg-orange-50/30 text-left transition-all active:scale-95 group shadow-sm relative overflow-hidden"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 border-2 flex items-center justify-center p-[2px] ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                            <div className={`w-full h-full rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
                          </div>
                          <span className="font-black text-slate-800 group-hover:text-orange-600 transition-colors uppercase text-sm tracking-tighter">{item.name}</span>
                        </div>
                        <span className="text-xs font-black text-orange-600 bg-white px-2 py-1 rounded-lg">₹{item.price}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 line-clamp-2 font-medium leading-relaxed">{item.description}</p>
                      {cart[item.id] > 0 && (
                        <div className="absolute bottom-2 right-2 bg-orange-600 text-white text-[10px] font-black px-2 py-1 rounded-lg">
                          {cart[item.id]} in cart
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </div>

      {/* Cart/Summary View */}
      <OrderSummary 
        cart={cart}
        menu={menu}
        orderType={orderType}
        onOrderTypeChange={setOrderType}
        tableNo={tableNo}
        onTableNoChange={setTableNo}
        tables={tables}
        onPlaceOrder={handlePlaceOrder}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        viewClass={view === 'MENU' ? 'hidden' : 'flex'}
      />
    </div>
  );
};

export default OrderUnit;
