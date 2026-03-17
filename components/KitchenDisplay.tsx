
import React from 'react';
import { Order, OrderStatus } from '../types';

interface KitchenDisplayProps {
  orders: Order[];
  onUpdateStatus: (id: string, status: OrderStatus) => void;
}

const KitchenDisplay: React.FC<KitchenDisplayProps> = ({ orders, onUpdateStatus }) => {
  const activeOrders = orders.filter(o => [OrderStatus.PENDING, OrderStatus.PREPARING].includes(o.status));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center">
          <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></span>
          Live Kitchen Queue
          <span className="ml-3 text-sm bg-slate-200 px-2 py-1 rounded text-slate-600">{activeOrders.length} Pending</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {activeOrders.map(order => (
          <div key={order.id} className={`bg-white rounded-xl border-l-4 overflow-hidden shadow-sm ${order.status === OrderStatus.PENDING ? 'border-orange-500' : 'border-blue-500'}`}>
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Order ID</span>
                <p className="font-bold text-slate-800">{order.id}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Table</span>
                <p className="font-bold text-orange-600">{order.tableNumber || 'Takeaway'}</p>
              </div>
            </div>
            
            <div className="p-4 space-y-2 max-h-60 overflow-y-auto">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-slate-700"><span className="font-bold text-slate-900">{item.quantity}x</span> {item.item.name}</span>
                </div>
              ))}
            </div>

            <div className="p-4 mt-2 border-t border-slate-50 flex gap-2">
              {order.status === OrderStatus.PENDING ? (
                <button 
                  onClick={() => onUpdateStatus(order.id, OrderStatus.PREPARING)}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg font-bold text-sm transition-colors"
                >
                  START COOKING
                </button>
              ) : (
                <button 
                  onClick={() => onUpdateStatus(order.id, OrderStatus.READY)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-bold text-sm transition-colors"
                >
                  MARK AS READY
                </button>
              )}
            </div>
          </div>
        ))}

        {activeOrders.length === 0 && (
          <div className="col-span-full h-96 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400">
             <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             <p className="text-xl font-medium">No orders in the queue</p>
             <p className="text-sm">Enjoy the peace while it lasts!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KitchenDisplay;
