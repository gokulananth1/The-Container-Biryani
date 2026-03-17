
import React from 'react';
import { Order, OrderStatus, UserRole } from '../types';

interface OrderManagementProps {
  orders: Order[];
  onUpdateStatus: (id: string, status: OrderStatus) => void;
  userRole?: UserRole | null;
}

const OrderManagement: React.FC<OrderManagementProps> = ({ orders, onUpdateStatus, userRole }) => {
  const isAdmin = userRole === UserRole.ADMIN;
  const isStaff = userRole === UserRole.STAFF;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="brand-font text-3xl lg:text-4xl text-slate-900 uppercase">Orders</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Real-time lifecycle monitoring</p>
        </div>
        <div className="bg-white px-5 py-2 rounded-2xl border border-slate-200 text-[10px] font-black text-slate-500 shadow-sm uppercase tracking-widest">
          Active Sessions: {orders.length}
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">
                <th className="px-8 py-6">Reference</th>
                <th className="px-8 py-6">Type</th>
                <th className="px-8 py-6">Selection</th>
                <th className="px-8 py-6">Settlement</th>
                <th className="px-8 py-6">Current Status</th>
                <th className="px-8 py-6 text-right">Operation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div>
                      <p className="font-black text-xs text-slate-800 tracking-tighter uppercase">{order.id}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">{new Date(order.timestamp).toLocaleTimeString()}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{order.type.replace('_', ' ')}</span>
                      <span className="text-xs font-black text-orange-600 uppercase tracking-tighter">{order.tableNumber ? `Table ${order.tableNumber}` : 'Online'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {order.items.map((item, i) => (
                        <span key={i} className="text-[8px] bg-slate-100 text-slate-500 px-2 py-1 rounded-lg font-black uppercase border border-slate-200">
                          {item.quantity}× {item.item.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="font-black text-slate-800 text-sm tracking-tighter">₹{order.total.toFixed(2)}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest border transition-all ${
                      order.status === OrderStatus.PENDING ? 'bg-orange-50 text-orange-600 border-orange-200' :
                      order.status === OrderStatus.PREPARING ? 'bg-blue-50 text-blue-600 border-blue-200' :
                      order.status === OrderStatus.READY ? 'bg-green-50 text-green-600 border-green-200' :
                      order.status === OrderStatus.DELIVERED ? 'bg-slate-50 text-slate-400 border-slate-200' :
                      'bg-red-50 text-red-600 border-red-200'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    {isAdmin ? (
                      <select 
                        className="bg-slate-50 border border-slate-100 text-[9px] font-black rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer uppercase tracking-widest"
                        value={order.status}
                        onChange={(e) => onUpdateStatus(order.id, e.target.value as OrderStatus)}
                      >
                        {Object.values(OrderStatus).map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    ) : isStaff ? (
                      order.status !== OrderStatus.DELIVERED && order.status !== OrderStatus.CANCELLED ? (
                        <button 
                          onClick={() => onUpdateStatus(order.id, OrderStatus.DELIVERED)}
                          className="bg-orange-600 hover:bg-orange-700 text-white text-[9px] font-black px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-orange-900/10 active:scale-95 flex items-center justify-center space-x-2 ml-auto uppercase tracking-widest"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                          <span>Deliver</span>
                        </button>
                      ) : (
                        <span className="text-[9px] text-slate-300 font-bold uppercase tracking-widest">Finalized</span>
                      )
                    ) : (
                      <span className="text-[9px] text-slate-300 font-bold uppercase tracking-widest">Locked</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <div className="p-20 text-center flex flex-col items-center">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-100 border border-slate-50">
               <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             </div>
             <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No transaction logs</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
