
import React, { useMemo } from 'react';
import { Order, MenuItem, InventoryItem, Table, OrderStatus } from '../types';

interface DashboardProps {
  orders: Order[];
  menu: MenuItem[];
  inventory: InventoryItem[];
  tables: Table[];
}

const Dashboard: React.FC<DashboardProps> = ({ orders, menu, inventory, tables }) => {
  const stats = useMemo(() => {
    const totalRevenue = orders
      .filter(o => o.status === OrderStatus.DELIVERED)
      .reduce((sum, o) => sum + o.total, 0);
    const activeOrders = orders.filter(o => o.status !== OrderStatus.DELIVERED && o.status !== OrderStatus.CANCELLED).length;
    const tableUtilization = tables.length > 0 ? Math.round((tables.filter(t => t.status === 'OCCUPIED').length / tables.length) * 100) : 0;
    const criticalStock = inventory.filter(i => i.quantity <= i.lowStockThreshold).length;
    return { totalRevenue, activeOrders, tableUtilization, criticalStock };
  }, [orders, tables, inventory]);

  const recentOrders = useMemo(() => {
    return [...orders].sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);
  }, [orders]);

  const menuPerformance = useMemo(() => {
    const salesCount = new Map<string, number>();
    orders.forEach(order => {
      order.items.forEach(item => {
        salesCount.set(item.item.id, (salesCount.get(item.item.id) || 0) + item.quantity);
      });
    });

    return Array.from(salesCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([id, count]) => ({
        item: menu.find(m => m.id === id),
        count,
      }));
  }, [orders, menu]);

  const inventoryAlerts = useMemo(() => {
    return inventory.filter(item => item.quantity <= item.lowStockThreshold);
  }, [inventory]);

  const StatCard = ({ icon, label, value, subtext }: { icon: React.ReactNode, label: string, value: string | number, subtext?: string }) => (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center space-x-5 transition-all hover:shadow-lg hover:border-slate-200">
      <div className="w-14 h-14 bg-slate-50 text-orange-600 rounded-2xl flex items-center justify-center border border-slate-100">
        {icon}
      </div>
      <div>
        <p className="font-inter text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest">{label}</p>
        <p className="brand-font text-3xl text-slate-950 tracking-tighter">{value}</p>
        {subtext && <p className="text-xs text-slate-400">{subtext}</p>}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Revenue" 
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard 
          label="Active Orders" 
          value={stats.activeOrders}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
        />
        <StatCard 
          label="Table Utilization" 
          value={`${stats.tableUtilization}%`}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
        />
        <StatCard 
          label="Critical Stock" 
          value={stats.criticalStock}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <h3 className="brand-font text-lg text-slate-900 uppercase tracking-wider mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {recentOrders.length > 0 ? recentOrders.map(order => (
              <div key={order.id} className="flex justify-between items-center p-4 rounded-2xl bg-slate-50/50 border border-slate-100 hover:bg-slate-50 transition-colors">
                <div>
                  <p className="font-black text-xs text-slate-800 tracking-tighter uppercase">{order.id}</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase">{order.tableNumber ? `Table ${order.tableNumber}` : order.type.replace('_', ' ')}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-sm text-slate-800 tracking-tighter">₹{order.total.toFixed(2)}</p>
                  <span className={`text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-widest ${
                    order.status === OrderStatus.PENDING ? 'bg-orange-100 text-orange-700' :
                    order.status === OrderStatus.PREPARING ? 'bg-blue-100 text-blue-700' :
                    order.status === OrderStatus.READY ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            )) : <p className="text-center text-slate-400 text-sm font-medium py-10">No recent orders.</p>}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="brand-font text-lg text-slate-900 uppercase tracking-wider mb-4">Menu Performance</h3>
            <div className="space-y-4">
              {menuPerformance.map(({ item, count }) => item && (
                <div key={item.id}>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-600 uppercase">{item.name}</span>
                    <span className="text-slate-400">{count} sold</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${(count / (menuPerformance[0]?.count || 1)) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="brand-font text-lg text-slate-900 uppercase tracking-wider mb-4">Inventory Alerts</h3>
            <div className="space-y-3">
              {inventoryAlerts.length > 0 ? inventoryAlerts.map(item => (
                <div key={item.id} className="flex justify-between items-center p-3 rounded-xl bg-red-50/50 border border-red-100">
                  <p className="text-xs font-bold text-red-800">{item.name}</p>
                  <p className="text-xs font-black text-red-600">{item.quantity} {item.unit}</p>
                </div>
              )) : <p className="text-center text-slate-400 text-sm font-medium py-4">All stock levels are healthy.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
