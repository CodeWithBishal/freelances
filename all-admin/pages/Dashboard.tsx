import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, ShoppingBag, TrendingUp, Clock, ArrowUpRight, ArrowDownRight, Search, Bell, IndianRupee } from 'lucide-react';
import { fetchClients, fetchOrders } from '../services/database';
import { Client, Order } from '../types';
import { format } from 'date-fns';
import { Card } from '../components/Card';
import { PageTransition } from '../components/PageTransition';
import { motion } from 'framer-motion';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const StatCard = ({ title, value, icon: Icon, trend, trendValue, index }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
  >
    <Card className="flex items-start justify-between group hover:border-violet-500/20 transition-all cursor-default">
      <div>
        <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-2">{title}</p>
        <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
        <div className="flex items-center mt-3 gap-2">
          <div className={`flex items-center text-[10px] font-bold px-2 py-1 rounded-full ${trend === 'up' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
            {trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
            <span>{trendValue}</span>
          </div>
          <span className="text-zinc-600 text-xs font-medium">vs last month</span>
        </div>
      </div>
      <div className={`p-3 rounded-2xl bg-zinc-900 border border-white/5 group-hover:bg-violet-500/10 group-hover:border-violet-500/20 group-hover:scale-110 transition-all duration-300`}>
        <Icon className="w-5 h-5 text-zinc-400 group-hover:text-violet-400 transition-colors" />
      </div>
    </Card>
  </motion.div>
);

export const Dashboard = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchClients(), fetchOrders()])
      .then(([clientsData, ordersData]) => {
        setClients(clientsData);
        setOrders(ordersData);
      })
      .catch(err => console.error('Failed to fetch dashboard data:', err))
      .finally(() => setLoading(false));
  }, []);

  const totalClients = clients.length;
  const activeOrders = orders.filter(o => o.status === 'active').length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);
  const dueSoon = orders.filter(o => {
    const dueDate = new Date(o.dueDate);
    const today = new Date();
    const diffTime = Math.abs(dueDate.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && o.status === 'active';
  }).length;

  const data = [
    { name: 'Jan', revenue: 40000 },
    { name: 'Feb', revenue: 150000 },
    { name: 'Mar', revenue: 120000 },
    { name: 'Apr', revenue: 278000 },
    { name: 'May', revenue: 189000 },
    { name: 'Jun', revenue: 239000 },
    { name: 'Jul', revenue: 349000 },
  ];

  return (
    <PageTransition className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Overview</h1>
          <p className="text-zinc-400 mt-2 font-light">Welcome back, Alex. Your business at a glance.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-3 rounded-full text-zinc-400 hover:text-white hover:bg-white/5 transition-colors relative border border-transparent hover:border-white/5">
            <Bell className="w-5 h-5" />
            <span className="absolute top-3 right-3 w-2 h-2 bg-violet-500 rounded-full shadow-[0_0_8px_rgba(139,92,246,0.6)]"></span>
          </button>
          <div className="relative group">
            <div className="absolute inset-0 bg-violet-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-500 group-focus-within:text-violet-400 w-4 h-4 transition-colors z-10" />
            <input
              type="text"
              placeholder="Search anything..."
              className="relative z-10 pl-11 pr-4 py-3 bg-zinc-900/80 border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all w-72 placeholder-zinc-600 shadow-xl"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Clients" value={totalClients} icon={Users} trend="up" trendValue="+12%" index={0} />
        <StatCard title="Active Orders" value={activeOrders} icon={ShoppingBag} trend="up" trendValue="+5%" index={1} />
        <StatCard title="Total Revenue" value={formatCurrency(totalRevenue)} icon={IndianRupee} trend="up" trendValue="+8.2%" index={2} />
        <StatCard title="Renewals Due" value={dueSoon} icon={Clock} trend="down" trendValue="-2" index={3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 min-h-[400px] border-white/5 bg-zinc-900/20">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-violet-500" />
              Revenue Performance
            </h2>
            <select className="bg-zinc-900 border border-white/10 text-zinc-400 text-xs rounded-lg px-3 py-1.5 focus:outline-none hover:border-white/20 transition-colors">
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" opacity={0.5} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#71717a', fontSize: 12, fontFamily: 'JetBrains Mono' }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#71717a', fontSize: 12, fontFamily: 'JetBrains Mono' }}
                  tickFormatter={(value) => `₹${(value / 1000)}k`}
                />
                <Tooltip
                  cursor={{ fill: '#27272a', opacity: 0.2 }}
                  contentStyle={{
                    backgroundColor: '#09090b',
                    borderRadius: '12px',
                    border: '1px solid #27272a',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                    color: '#f4f4f5'
                  }}
                  itemStyle={{ color: '#e4e4e7', fontFamily: 'JetBrains Mono' }}
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                />
                <Bar
                  dataKey="revenue"
                  fill="#8b5cf6"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                  activeBar={{ fill: '#7c3aed' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="border-white/5 bg-zinc-900/20">
          <h2 className="text-lg font-bold text-white mb-6">Live Activity</h2>
          <div className="space-y-0">
            {[1, 2, 3].map((i) => (
              <div key={i} className="relative pl-8 py-4 border-l border-white/5 group hover:bg-white/[0.02] -ml-6 pl-12 pr-6 transition-colors">
                <div className="absolute left-[-5px] top-6 w-2.5 h-2.5 rounded-full bg-zinc-900 border border-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]"></div>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  <span className="font-semibold text-white hover:text-violet-400 transition-colors cursor-pointer">Alice Freeman</span> updated order <span className="font-mono text-xs text-violet-300 bg-violet-500/10 px-1.5 py-0.5 rounded border border-violet-500/20">ORD-1001</span>
                </p>
                <p className="text-[10px] text-zinc-500 mt-2 font-mono uppercase tracking-widest">2h ago</p>
              </div>
            ))}
            <div className="relative pl-8 py-4 border-l border-white/5 group hover:bg-white/[0.02] -ml-6 pl-12 pr-6 transition-colors">
              <div className="absolute left-[-5px] top-6 w-2.5 h-2.5 rounded-full bg-zinc-900 border border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
              <p className="text-sm text-zinc-300 leading-relaxed">
                New Quote <span className="font-mono text-xs text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">Q-202</span> created
              </p>
              <p className="text-[10px] text-zinc-500 mt-2 font-mono uppercase tracking-widest">5h ago</p>
            </div>
          </div>
        </Card>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card noPadding className="overflow-hidden border-white/5 bg-zinc-900/20">
          <div className="p-6 flex justify-between items-center border-b border-white/5">
            <h2 className="text-lg font-bold text-white">Upcoming Renewals</h2>
            <button className="text-xs text-violet-400 font-medium hover:text-violet-300 transition-colors uppercase tracking-widest border border-violet-500/30 px-3 py-1 rounded-lg hover:bg-violet-500/10">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/5 text-zinc-500 text-[10px] uppercase tracking-widest font-mono">
                  <th className="px-6 py-4 font-semibold">Order ID</th>
                  <th className="px-6 py-4 font-semibold">Client</th>
                  <th className="px-6 py-4 font-semibold">Service</th>
                  <th className="px-6 py-4 font-semibold">Due Date</th>
                  <th className="px-6 py-4 font-semibold">Amount</th>
                  <th className="px-6 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.slice(0, 3).map(order => {
                  const client = clients.find(c => c.id === order.clientId);
                  return (
                    <tr key={order.id} className="hover:bg-white/[0.02] group transition-colors">
                      <td className="px-6 py-5 text-sm font-medium text-white font-mono">{order.id}</td>
                      <td className="px-6 py-5 text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors">{client?.name || 'Unknown'}</td>
                      <td className="px-6 py-5 text-sm text-zinc-400">{order.serviceName}</td>
                      <td className="px-6 py-5 text-sm text-orange-400 font-medium font-mono">{format(new Date(order.dueDate), 'MMM dd')}</td>
                      <td className="px-6 py-5 text-sm text-white font-medium font-mono tracking-tight">{formatCurrency(order.amount)}</td>
                      <td className="px-6 py-5 text-right">
                        <button className="text-xs bg-zinc-900 border border-zinc-700 hover:border-violet-500 text-zinc-400 hover:text-violet-400 px-3 py-1.5 rounded-lg transition-all opacity-50 group-hover:opacity-100">
                          Invoice
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </PageTransition>
  );
};