
import React, { useState } from 'react';
import { Table, UserRole } from '../types';

interface TableManagerProps {
  tables: Table[];
  userRole: UserRole;
  onAdd: (table: Table) => void;
  onUpdate: (table: Table) => void;
  onDelete: (id: string) => void;
}

const TableManager: React.FC<TableManagerProps> = ({ tables, userRole, onAdd, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Table>>({});
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const isAdmin = userRole === UserRole.ADMIN;

  const handleAdd = () => {
    if (!isAdmin) return;
    const nextNumber = tables.length > 0 
      ? (Math.max(...tables.map(t => parseInt(t.number) || 0)) + 1).toString() 
      : "1";
    
    const newTable: Table = {
      id: `t-${Date.now()}`,
      number: nextNumber,
      capacity: 4,
      status: 'AVAILABLE'
    };
    onAdd(newTable);
  };

  const startEdit = (table: Table) => {
    if (!isAdmin) return;
    setIsEditing(table.id);
    setEditForm(table);
  };

  const saveEdit = () => {
    if (editForm.id && isAdmin) {
      onUpdate(editForm as Table);
      setIsEditing(null);
      setEditForm({});
    }
  };

  const executeDelete = () => {
    if (confirmDeleteId && isAdmin) {
      onDelete(confirmDeleteId);
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="brand-font text-3xl lg:text-4xl text-slate-900 uppercase">Layout</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Floor plan and seating management</p>
        </div>
        {isAdmin && (
          <button 
            onClick={handleAdd}
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-black text-xs shadow-xl shadow-slate-900/10 transition-all flex items-center justify-center transform active:scale-95 uppercase tracking-widest"
          >
            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            Deploy Table
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
        {tables.map(table => (
          <div key={table.id} className={`bg-white rounded-[2rem] p-6 border border-slate-100 transition-all relative ${isAdmin ? 'hover:border-orange-500 hover:shadow-2xl hover:shadow-slate-200/50 group' : 'shadow-sm'}`}>
            {isEditing === table.id && isAdmin ? (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="text-left">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 block">Reference</label>
                  <input 
                    type="text" 
                    className="w-full border-b-2 border-orange-500 outline-none text-center font-black text-xl py-2 text-slate-800 bg-orange-50/20 rounded-t-xl"
                    value={editForm.number}
                    autoFocus
                    onChange={e => setEditForm({...editForm, number: e.target.value})}
                  />
                </div>
                <div className="text-left">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 block">Capacity</label>
                  <input 
                    type="number" 
                    className="w-full border-b-2 border-orange-500 outline-none text-center py-2 text-slate-800 bg-orange-50/20 rounded-t-xl font-black"
                    value={editForm.capacity}
                    onChange={e => setEditForm({...editForm, capacity: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="flex space-x-2 pt-2">
                  <button onClick={saveEdit} className="flex-1 bg-slate-900 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">OK</button>
                  <button onClick={() => setIsEditing(null)} className="flex-1 bg-slate-100 text-slate-400 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                {isAdmin && (
                  <div className="absolute top-4 right-4 flex space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button 
                      onClick={(e) => { e.stopPropagation(); startEdit(table); }}
                      className="p-2 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-slate-100 shadow-sm"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(table.id); }}
                      className="p-2 bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-slate-100 shadow-sm"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                )}

                <div className={`w-14 h-14 mx-auto mb-6 rounded-2xl flex items-center justify-center font-black text-xl transition-all duration-500 transform group-hover:rotate-12 ${
                  table.status === 'AVAILABLE' ? 'bg-green-50 text-green-600 border border-green-100' :
                  table.status === 'OCCUPIED' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                  'bg-slate-50 text-slate-300 border border-slate-100'
                }`}>
                  {table.number}
                </div>
                <div className="text-center">
                  <h4 className="font-black text-slate-800 text-sm mb-1 uppercase tracking-tighter">Table {table.number}</h4>
                  <p className="text-[9px] font-black text-slate-400 mb-5 uppercase tracking-widest">{table.capacity} PAX</p>
                  <span className={`text-[8px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] border ${
                    table.status === 'AVAILABLE' 
                    ? 'bg-green-50 text-green-700 border-green-200' 
                    : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}>
                    {table.status}
                  </span>
                </div>
              </>
            )}
          </div>
        ))}

        {tables.length === 0 && (
          <div className="col-span-full h-64 border-2 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-300 bg-slate-50/30">
             <p className="font-black uppercase tracking-widest text-xs">Floor is clear</p>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-slate-900/70 backdrop-blur-md">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-xs w-full p-8 text-center animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-widest">Delete Table?</h3>
            <p className="text-xs text-slate-500 mb-8 leading-relaxed font-medium">This unit will be decommissioned permanently from the floor plan.</p>
            <div className="flex flex-col space-y-3">
              <button 
                onClick={executeDelete}
                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-900/20"
              >
                Confirm Delete
              </button>
              <button 
                onClick={() => setConfirmDeleteId(null)}
                className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableManager;
