
import React, { useState } from 'react';
import { InventoryItem, UserRole } from '../types';

interface InventoryManagerProps {
  inventory: InventoryItem[];
  userRole: UserRole;
  onAdd: (item: InventoryItem) => void;
  onUpdate: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
}

const InventoryManager: React.FC<InventoryManagerProps> = ({ inventory, userRole, onAdd, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState<Partial<InventoryItem>>({
    name: '',
    quantity: 0,
    unit: 'KG',
    lowStockThreshold: 10,
    status: 'IN_STOCK'
  });

  const lowStockCount = inventory.filter(item => item.quantity <= item.lowStockThreshold || item.status === 'OUT_OF_STOCK').length;

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({ name: '', quantity: 0, unit: 'KG', lowStockThreshold: 10, status: 'IN_STOCK' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  const toggleStatus = (item: InventoryItem) => {
    onUpdate({
      ...item,
      status: item.status === 'IN_STOCK' ? 'OUT_OF_STOCK' : 'IN_STOCK'
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      onUpdate({ ...editingItem, ...formData } as InventoryItem);
    } else {
      const newItem: InventoryItem = {
        ...formData,
        id: `inv-${Date.now()}`
      } as InventoryItem;
      onAdd(newItem);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="brand-font text-3xl lg:text-4xl text-slate-900 uppercase">Inventory</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock levels and raw materials</p>
        </div>
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          {lowStockCount > 0 && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 px-4 py-2.5 rounded-2xl text-[9px] font-black border border-red-100 uppercase tracking-widest flex-1 sm:flex-none justify-center">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-ping"></span>
              <span>{lowStockCount} Critical</span>
            </div>
          )}
          <button 
            onClick={handleOpenAdd}
            className="flex-1 sm:flex-none bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-black text-xs shadow-xl shadow-slate-900/10 transition-all flex items-center justify-center transform active:scale-95 uppercase tracking-widest"
          >
            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            Restock
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">
                <th className="px-8 py-6">Material</th>
                <th className="px-8 py-6">Current Level</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inventory.map((item) => {
                const isThresholdLow = item.quantity <= item.lowStockThreshold;
                const isManualOut = item.status === 'OUT_OF_STOCK';
                return (
                  <tr key={item.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center border border-slate-100">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                        </div>
                        <div>
                          <p className="font-black text-xs text-slate-800 uppercase tracking-tight">{item.name}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Alert @ {item.lowStockThreshold} {item.unit}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-baseline space-x-1">
                        <span className={`text-lg font-black tracking-tighter ${isThresholdLow ? 'text-red-600' : 'text-slate-800'}`}>{item.quantity}</span>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.unit}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <button 
                        onClick={() => toggleStatus(item)}
                        className={`text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest border transition-all ${
                          isManualOut || isThresholdLow
                          ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' 
                          : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                        }`}
                      >
                        {isManualOut ? 'Unavailable' : (isThresholdLow ? 'Critical' : 'Healthy')}
                      </button>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => handleOpenEdit(item)}
                          className="p-2.5 bg-slate-50 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all border border-slate-100"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button 
                          onClick={() => onDelete(item.id)}
                          className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-slate-100"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {inventory.length === 0 && (
          <div className="p-20 text-center flex flex-col items-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No material records</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden">
            <div className="p-8 lg:p-10 bg-slate-50 border-b border-slate-100 relative">
              <h2 className="brand-font text-2xl lg:text-3xl text-slate-900 uppercase">{editingItem ? 'Adjust Stock' : 'New Entry'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 lg:p-10 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Item Designation</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-orange-500 outline-none transition-all font-black"
                  placeholder="e.g. Saffron Rice"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Quantity</label>
                  <input 
                    required
                    type="number" 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-orange-500 outline-none transition-all font-black"
                    value={formData.quantity}
                    onChange={e => setFormData({...formData, quantity: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">UoM</label>
                  <select 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-orange-500 outline-none transition-all font-black text-xs uppercase"
                    value={formData.unit}
                    onChange={e => setFormData({...formData, unit: e.target.value})}
                  >
                    {['KG', 'Liters', 'Grams', 'Units', 'Boxes'].map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
              >
                {editingItem ? 'Apply Changes' : 'Initialize Stock'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManager;
