
import React, { useMemo } from 'react';
import { MenuItem, OrderType, Table } from '../types';

interface OrderSummaryProps {
    cart: { [id: string]: number };
    menu: MenuItem[];
    orderType: OrderType;
    onOrderTypeChange: (type: OrderType) => void;
    tableNo: string;
    onTableNoChange: (table: string) => void;
    tables: Table[];
    onPlaceOrder: () => void;
    addToCart: (id: string) => void;
    removeFromCart: (id: string) => void;
    viewClass: string; // To handle mobile view visibility
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
    cart,
    menu,
    orderType,
    onOrderTypeChange,
    tableNo,
    onTableNoChange,
    tables,
    onPlaceOrder,
    addToCart,
    removeFromCart,
    viewClass,
}) => {
    const subtotal = useMemo(() => Object.entries(cart).reduce((acc: number, [id, qty]) => {
        const item = menu.find(m => m.id === id);
        return acc + (item ? item.price * (qty as number) : 0);
    }, 0), [cart, menu]);
    
    const total = subtotal; // Assuming no taxes for now

    const tableStatus = useMemo(() => {
        if (orderType !== OrderType.DINE_IN) return null;
        const table = tables.find(t => t.number === tableNo);
        if (!table) return 'INVALID';
        return table.status;
    }, [tableNo, tables, orderType]);

    const getStatusColor = (status: string | null) => {
        switch (status) {
            case 'AVAILABLE': return 'text-green-400';
            case 'OCCUPIED': return 'text-orange-400';
            case 'RESERVED': return 'text-blue-400';
            default: return 'text-red-400';
        }
    };

    const orderTypeIcons = {
        [OrderType.DINE_IN]: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>,
        [OrderType.TAKEAWAY]: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>,
        [OrderType.ONLINE]: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
    };

    return (
        <div className={`w-full max-w-4xl mx-auto bg-slate-900/80 backdrop-blur-3xl text-white rounded-[2.5rem] flex-col shadow-2xl overflow-hidden border-2 border-slate-700/50 ${viewClass} relative`}>
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            <div className="p-8 border-b border-slate-700/50">
                <h2 className="brand-font text-3xl text-white uppercase tracking-tighter mb-6">Order Summary</h2>
                <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-800/50 rounded-2xl">
                    {[OrderType.DINE_IN, OrderType.TAKEAWAY, OrderType.ONLINE].map(type => (
                        <button
                            key={type}
                            onClick={() => onOrderTypeChange(type)}
                            className={`flex items-center justify-center space-x-2 py-3 text-[9px] font-black rounded-xl transition-all uppercase tracking-widest ${orderType === type ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                        >
                            {orderTypeIcons[type]}
                            <span>{type.replace('_', ' ')}</span>
                        </button>
                    ))}
                </div>
                {orderType === OrderType.DINE_IN && (
                    <div className="mt-6">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Table Location</span>
                            <input
                                type="text"
                                className="w-20 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-center text-orange-500 font-black text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                                value={tableNo}
                                onChange={e => onTableNoChange(e.target.value)}
                            />
                        </div>
                        {tableStatus && (
                            <p className={`text-right text-[10px] font-black uppercase tracking-widest mt-2 ${getStatusColor(tableStatus)}`}>
                                Status: {tableStatus}
                            </p>
                        )}
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-4 max-h-[400px] lg:max-h-none scrollbar-hide">
                {Object.entries(cart).length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-600 text-center py-10">
                        <svg className="w-24 h-24 mb-6 opacity-40" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M5.5 5.5A.5.5 0 0 1 6 5h12a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-.5.5H6a.5.5 0 0 1-.5-.5v-12Zm5 2a.5.5 0 0 0-1 0v2.5H7a.5.5 0 0 0 0 1h2.5V13a.5.5 0 0 0 1 0v-2.5H13a.5.5 0 0 0 0-1h-2.5V7.5Z"/></svg>
                        <p className="font-black uppercase tracking-widest text-xs text-slate-500">Your Cart is Empty</p>
                        <p className="text-[10px] text-slate-600 mt-1">Select items from the menu to get started.</p>
                    </div>
                ) : (
                    Object.entries(cart).map(([id, qty]) => {
                        const item = menu.find(m => m.id === id)!;
                        return (
                            <div key={id} className="flex items-center gap-4 bg-slate-800/40 p-3 rounded-2xl border border-slate-700/30 hover:bg-slate-800/80 hover:shadow-[0_0_20px_rgba(234,88,12,0.3)] transition-all duration-300 animate-in slide-in-from-right-4">
                                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover border-2 border-slate-800" />
                                <div className="flex-1">
                                    <p className="font-black text-sm uppercase tracking-tight leading-tight">{item.name}</p>
                                    <p className="text-[10px] text-slate-400 font-bold">₹{item.price} × {qty} = <span className="text-orange-500">₹{item.price * (qty as number)}</span></p>
                                </div>
                                <div className="flex items-center bg-slate-900/50 rounded-xl p-1 border border-slate-700/50">
                                    <button onClick={() => removeFromCart(id)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-orange-500 transition-colors rounded-lg">－</button>
                                    <span className="w-8 text-center text-sm font-black text-white">{qty}</span>
                                    <button onClick={() => addToCart(id)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-orange-500 transition-colors rounded-lg">＋</button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <div className="p-8 bg-slate-900/50 space-y-6 border-t-2 border-dashed border-slate-700/50">
                <div className="space-y-3">
                    <div className="flex justify-between items-center text-slate-400">
                        <span className="text-[10px] font-black uppercase tracking-widest">Subtotal</span>
                        <span className="font-mono text-sm">₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600">
                        <span className="text-[10px] font-black uppercase tracking-widest">Taxes & Fees</span>
                        <span className="font-mono text-sm">₹0.00</span>
                    </div>
                </div>
                <div className="flex justify-between items-center border-t border-slate-700/50 pt-4">
                    <span className="text-md font-black uppercase tracking-widest">Grand Total</span>
                    <span className="brand-font text-3xl text-orange-500 tracking-tighter">₹{total.toFixed(2)}</span>
                </div>
                <button
                    onClick={onPlaceOrder}
                    disabled={Object.keys(cart).length === 0}
                    className="w-full py-6 bg-orange-600 hover:bg-orange-500 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed rounded-2xl font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-orange-900/40 transition-all active:translate-y-1 flex items-center justify-center space-x-3 relative overflow-hidden group"
                >
                    <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white/20 rounded-full group-hover:w-56 group-hover:h-56"></span>
                    <svg className="w-5 h-5 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    <span className="relative">Execute Transaction</span>
                </button>
            </div>
        </div>
    );
};

export default OrderSummary;
