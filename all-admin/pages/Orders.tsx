import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, ArrowDownUp, Plus, X, Calendar, DollarSign, Briefcase, Loader2 } from 'lucide-react';
import { fetchOrders, fetchClients, createOrder } from '../services/database';
import { format } from 'date-fns';
import { clsx } from 'clsx';
import { Status, Order, Client } from '../types';
import { Card } from '../components/Card';
import { PageTransition } from '../components/PageTransition';
import { AnimatePresence, motion } from 'framer-motion';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const Orders = () => {
  const [filterStatus, setFilterStatus] = useState<Status | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // New Order Form State
  const [newOrder, setNewOrder] = useState<{
    clientId: string;
    serviceName: string;
    amount: string;
    dueDate: string;
    billingFreq: 'one-time' | 'monthly' | 'yearly';
  }>({
    clientId: '',
    serviceName: '',
    amount: '',
    dueDate: '',
    billingFreq: 'one-time'
  });

  useEffect(() => {
    Promise.all([fetchOrders(), fetchClients()])
      .then(([ordersData, clientsData]) => {
        setOrders(ordersData);
        setClients(clientsData);
      })
      .catch(err => console.error('Failed to fetch data:', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: Status) => {
    switch (status) {
      case 'active': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'completed': return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
      case 'expired': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default: return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    }
  };

  const handleExportCSV = () => {
    const headers = ['Order ID', 'Client Name', 'Service', 'Billing', 'Amount', 'Status', 'Due Date'];
    const rows = filteredOrders.map(order => {
      const clientName = clients.find(c => c.id === order.clientId)?.name || 'Unknown';
      return [
        order.id,
        `"${clientName}"`,
        `"${order.serviceName}"`,
        order.billingFreq,
        order.amount,
        order.status,
        order.dueDate
      ].join(',');
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `orders_export_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrder.clientId || !newOrder.serviceName || !newOrder.amount) return;
    setSaving(true);
    try {
      const created = await createOrder({
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        clientId: newOrder.clientId,
        serviceName: newOrder.serviceName,
        amount: parseFloat(newOrder.amount),
        dueDate: newOrder.dueDate || new Date().toISOString(),
        status: 'active',
        billingFreq: newOrder.billingFreq,
      });
      setOrders([created, ...orders]);
      setIsModalOpen(false);
      setNewOrder({ clientId: '', serviceName: '', amount: '', dueDate: '', billingFreq: 'one-time' });
    } catch (err) {
      console.error('Failed to create order:', err);
      alert('Failed to create order. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageTransition className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Orders</h1>
          <p className="text-zinc-400 mt-2 font-light">Transactions & Service History</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 border border-white/10 bg-zinc-900 text-zinc-300 px-4 py-2.5 rounded-xl hover:bg-zinc-800 transition-colors text-sm font-medium hover:text-white"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-white text-black px-4 py-2.5 rounded-xl hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] text-sm font-bold"
          >
            <Plus className="w-4 h-4" />
            <span>Create Order</span>
          </button>
        </div>
      </div>

      <Card noPadding className="overflow-hidden min-h-[600px] border-white/5 bg-zinc-900/20">
        <div className="p-4 border-b border-white/5 flex flex-col md:flex-row gap-4 justify-between items-center bg-white/[0.02]">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all placeholder-zinc-600"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <Filter className="w-4 h-4 text-zinc-500 mr-2 flex-shrink-0" />
            {['all', 'active', 'completed', 'pending', 'expired'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status as any)}
                className={clsx(
                  'px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap border',
                  filterStatus === status
                    ? 'bg-white text-black border-white'
                    : 'bg-transparent text-zinc-500 border-transparent hover:bg-white/5 hover:text-zinc-300'
                )}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/[0.02] text-zinc-500 border-b border-white/5">
              <tr className="text-[10px] uppercase tracking-widest font-mono">
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Client</th>
                <th className="px-6 py-4 font-semibold">Service</th>
                <th className="px-6 py-4 font-semibold">Billing</th>
                <th className="px-6 py-4 font-semibold flex items-center gap-1 cursor-pointer hover:text-zinc-300">
                  Due Date <ArrowDownUp className="w-3 h-3" />
                </th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.map(order => {
                const client = clients.find(c => c.id === order.clientId);
                return (
                  <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-white font-mono text-xs opacity-70">{order.id}</td>
                    <td className="px-6 py-4 text-sm text-zinc-400">
                      <div className="flex items-center gap-3">
                        {client && <img src={client.avatar} className="w-6 h-6 rounded-full ring-1 ring-white/10" alt="" />}
                        <span className="font-medium text-zinc-300">{client?.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-300">{order.serviceName}</td>
                    <td className="px-6 py-4 text-[10px] text-zinc-500 uppercase font-bold tracking-wider">{order.billingFreq}</td>
                    <td className="px-6 py-4 text-sm text-zinc-400 font-mono">{format(new Date(order.dueDate), 'MMM dd, yyyy')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-white text-right font-mono">{formatCurrency(order.amount)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create Order Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <h2 className="text-lg font-bold text-white">Create New Order</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateOrder} className="p-6 space-y-4">

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Client</label>
                  <div className="relative">
                    <select
                      required
                      value={newOrder.clientId}
                      onChange={(e) => setNewOrder({ ...newOrder, clientId: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 outline-none transition-all appearance-none"
                    >
                      <option value="" disabled>Select a client</option>
                      {clients.map(client => (
                        <option key={client.id} value={client.id}>{client.name} - {client.company}</option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <ArrowDownUp className="w-3 h-3 text-zinc-500" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Service Name</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      required
                      placeholder="e.g. Website Maintenance"
                      value={newOrder.serviceName}
                      onChange={e => setNewOrder({ ...newOrder, serviceName: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-3 py-2 text-white focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Amount (INR)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input
                        type="number"
                        required
                        placeholder="0.00"
                        value={newOrder.amount}
                        onChange={e => setNewOrder({ ...newOrder, amount: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-3 py-2 text-white focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Billing</label>
                    <select
                      value={newOrder.billingFreq}
                      onChange={(e: any) => setNewOrder({ ...newOrder, billingFreq: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-violet-500/50 outline-none transition-all"
                    >
                      <option value="one-time">One-time</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Due Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="date"
                      required
                      value={newOrder.dueDate}
                      onChange={e => setNewOrder({ ...newOrder, dueDate: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-3 py-2 text-white focus:border-violet-500/50 outline-none transition-all [color-scheme:dark]"
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} disabled={saving} className="flex-1 py-2.5 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold shadow-lg shadow-violet-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-violet-600">
                    {saving ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</>
                    ) : (
                      'Create Order'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
};