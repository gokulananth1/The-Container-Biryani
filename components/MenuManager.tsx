
import React, { useState, useMemo, useEffect } from 'react';
import { MenuItem, UserRole } from '../types';

interface MenuManagerProps {
  menu: MenuItem[];
  userRole?: UserRole | null;
  onAdd: (item: MenuItem) => void;
  onUpdate: (item: MenuItem) => void;
  onDelete: (id: string) => void;
}

const MenuManager: React.FC<MenuManagerProps> = ({ menu, userRole, onAdd, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dietFilter, setDietFilter] = useState<'All' | 'Veg' | 'Non-Veg'>('All');
  
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    category: 'Main Course',
    isAvailable: true,
    isVeg: true
  });
  const [imageFileName, setImageFileName] = useState('');

  const isAdmin = userRole === UserRole.ADMIN;
  const isCustomer = !userRole || userRole === UserRole.CUSTOMER;
  
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const filteredMenu = useMemo(() => {
    return menu.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDiet = dietFilter === 'All' || 
                          (dietFilter === 'Veg' && item.isVeg) || 
                          (dietFilter === 'Non-Veg' && !item.isVeg);
      return matchesSearch && matchesDiet;
    });
  }, [menu, searchTerm, dietFilter]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      price: 0,
      description: '',
      category: 'Main Course',
      image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=800',
      isAvailable: true,
      isVeg: true
    });
    setImageFileName('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData(item);
    setImageFileName('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      onUpdate({ ...editingItem, ...formData } as MenuItem);
    } else {
      const newItem: MenuItem = {
        ...formData,
        id: `m-${Date.now()}`
      } as MenuItem;
      onAdd(newItem);
    }
    setIsModalOpen(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header section remains largely the same for UI consistency */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6 border-b border-slate-100 pb-8">
        <div>
          <h2 className="brand-font text-4xl text-slate-900 uppercase">The Manifest</h2>
          <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-[0.3em] font-black">
            {isCustomer ? "Premium Culinary Inventory" : "Global Master Control"}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-64">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text"
              placeholder="LOCATE DISH..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-orange-500 transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {!isCustomer && isAdmin && (
            <button 
              onClick={handleOpenAdd}
              className="w-full sm:w-auto bg-slate-950 hover:bg-orange-600 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all transform active:scale-95 shadow-xl"
            >
              Add New Unit
            </button>
          )}
        </div>
      </div>

      {/* Grid view of items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {filteredMenu.map(item => (
          <div key={item.id} className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] transition-all duration-700 group flex flex-col">
            <div className="h-64 w-full overflow-hidden relative">
              <img src={item.image} alt={item.name} className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent"></div>
              
              <div className="absolute top-6 left-6 flex flex-col space-y-2">
                <span className="text-[8px] font-black text-white bg-orange-600 px-3 py-1.5 rounded-full uppercase tracking-widest">
                  {item.category}
                </span>
                <span className={`text-[8px] font-black text-white px-3 py-1.5 rounded-full uppercase tracking-widest ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`}>
                  {item.isVeg ? 'VEG' : 'NON-VEG'}
                </span>
              </div>
              
              {isAdmin && (
                <div className="absolute top-6 right-6 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                  <button onClick={() => handleOpenEdit(item)} className="p-3 bg-white text-slate-950 rounded-2xl shadow-xl hover:bg-orange-600 hover:text-white transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                  <button onClick={() => onDelete(item.id)} className="p-3 bg-white text-slate-950 rounded-2xl shadow-xl hover:bg-red-600 hover:text-white transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              )}
            </div>
            
            <div className="p-10 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <h4 className="brand-font text-3xl text-slate-900 uppercase tracking-tight group-hover:text-orange-600 transition-colors">{item.name}</h4>
                <span className="brand-font text-2xl text-slate-950">₹{item.price}</span>
              </div>
              <p className="text-sm text-slate-500 mb-10 line-clamp-2 leading-relaxed font-medium italic opacity-80">{item.description}</p>
              
              <div className="mt-auto pt-8 border-t border-slate-100 flex justify-between items-center">
                <span className={`text-[9px] font-black px-4 py-2 rounded-xl uppercase tracking-widest ${item.isAvailable ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {item.isAvailable ? 'STOCKED' : 'DEPLETED'}
                </span>
                <span className="text-[9px] text-slate-300 font-black uppercase tracking-widest">UNIT_REF: {item.id.slice(-4)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && isAdmin && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl animate-in fade-in duration-500 overflow-y-auto">
          <div className="max-w-2xl w-full bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col relative">
            
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-8 right-8 z-50 p-3 bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-950 rounded-full transition-all active:scale-90"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div className="p-10">
              <h3 className="brand-font text-3xl text-slate-900 uppercase tracking-tighter">
                {editingItem ? 'Edit Menu Item' : 'Add New Item'}
              </h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Update Culinary Manifest</p>
            </div>
            
            <div className="flex-1 px-10 pb-10 overflow-y-auto scrollbar-hide">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="aspect-[16/9] rounded-3xl overflow-hidden border border-slate-100 bg-slate-50 mb-4">
                  {formData.image && <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />}
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Item Image</label>
                  <label htmlFor="image-upload" className="w-full block cursor-pointer truncate px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-orange-500 transition-all font-medium text-sm text-slate-500">
                    {imageFileName || 'Click to upload a new image...'}
                  </label>
                  <input 
                    id="image-upload"
                    type="file" 
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Item Name</label>
                  <input 
                    required type="text" 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 outline-none transition-all font-black text-slate-950 placeholder:text-slate-300"
                    placeholder="e.g. Container Biryani"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Category</label>
                    <select 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 outline-none transition-all font-black text-xs uppercase appearance-none"
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value as any})}
                    >
                      {['Starters', 'Main Course', 'Desserts', 'Beverages'].map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Price (₹)</label>
                    <input 
                      required type="number" 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 outline-none transition-all font-black"
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Dietary Type</label>
                      <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200">
                        <button type="button" onClick={() => setFormData({...formData, isVeg: true})}
                          className={`py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${formData.isVeg ? 'bg-white text-green-600 shadow-sm' : 'text-slate-400'}`}>
                          VEG
                        </button>
                        <button type="button" onClick={() => setFormData({...formData, isVeg: false})}
                          className={`py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${!formData.isVeg ? 'bg-white text-red-600 shadow-sm' : 'text-slate-400'}`}>
                          NON-VEG
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Availability</label>
                      <button type="button" onClick={() => setFormData({...formData, isAvailable: !formData.isAvailable})}
                        className={`w-full py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${formData.isAvailable ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                        {formData.isAvailable ? 'Available' : 'Unavailable'}
                      </button>
                    </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Description</label>
                  <textarea 
                    required rows={3}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 outline-none transition-all font-medium text-sm leading-relaxed"
                    placeholder="A brief, tasty description..."
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div className="pt-4 flex space-x-4">
                  <button type="button" onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-5 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">
                    Discard Changes
                  </button>
                  <button type="submit"
                    className="flex-1 py-5 bg-slate-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-slate-950/20 active:scale-95">
                    {editingItem ? 'Update Item' : 'Add Item'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManager;
