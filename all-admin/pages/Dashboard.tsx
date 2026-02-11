import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, ShoppingBag, TrendingUp, Clock, ArrowUpRight, ArrowDownRight, Search, Bell, IndianRupee, CheckCircle2, FileText, ListTodo, ChevronRight, Loader2 } from 'lucide-react';
import { fetchClients, fetchOrders, fetchQuotes, fetchTodos } from '../services/database';
import { useAuth } from '../services/AuthContext';
import { Client, Order, Quote, Todo } from '../types';
import { format, formatDistanceToNow, subMonths, isAfter, isBefore, startOfMonth, endOfMonth, parseISO } from 'date-fns';
import { Card } from '../components/Card';
import { PageTransition } from '../components/PageTransition';
import { motion, AnimatePresence } from 'framer-motion';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const StatCard = ({ title, value, icon: Icon, trend, trendValue, index, loading }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
  >
    <Card className="flex items-start justify-between group hover:border-violet-500/20 transition-all cursor-default">
      <div>
        <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-2">{title}</p>
        {loading ? (
          <div className="h-9 w-20 bg-zinc-800 rounded animate-pulse" />
        ) : (
          <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
        )}
        <div className="flex items-center mt-3 gap-2">
          {loading ? (
            <div className="h-5 w-16 bg-zinc-800 rounded-full animate-pulse" />
          ) : (
            <>
              <div className={`flex items-center text-[10px] font-bold px-2 py-1 rounded-full ${trend === 'up' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : trend === 'down' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'}`}>
                {trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : trend === 'down' ? <ArrowDownRight className="w-3 h-3 mr-1" /> : null}
                <span>{trendValue}</span>
              </div>
              <span className="text-zinc-600 text-xs font-medium">vs last month</span>
            </>
          )}
        </div>
      </div>
      <div className="p-3 rounded-2xl bg-zinc-900 border border-white/5 group-hover:bg-violet-500/10 group-hover:border-violet-500/20 group-hover:scale-110 transition-all duration-300">
        <Icon className="w-5 h-5 text-zinc-400 group-hover:text-violet-400 transition-colors" />
      </div>
    </Card>
  </motion.div>
);

export const Dashboard = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchClients(), fetchOrders(), fetchQuotes(), fetchTodos()])
      .then(([clientsData, ordersData, quotesData, todosData]) => {
        setClients(clientsData);
        setOrders(ordersData);
        setQuotes(quotesData);
        setTodos(todosData);
      })
      .catch(err => console.error('Failed to fetch dashboard data:', err))
      .finally(() => setLoading(false));
  }, []);

  // --- Derived Stats ---
  const totalClients = clients.length;
  const activeOrders = orders.filter(o => o.status === 'active').length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);
  const dueSoon = orders.filter(o => {
    try {
      const dueDate = new Date(o.dueDate);
      const today = new Date();
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 30 && o.status === 'active';
    } catch { return false; }
  }).length;

  // Compute monthly revenue chart data from real orders (last 7 months)
  const chartData = useMemo(() => {
    const months: { name: string; revenue: number }[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const monthDate = subMonths(now, i);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);
      const monthRevenue = orders
        .filter(o => {
          try {
            const d = new Date(o.createdAt);
            return isAfter(d, monthStart) && isBefore(d, monthEnd);
          } catch { return false; }
        })
        .reduce((sum, o) => sum + o.amount, 0);
      months.push({ name: format(monthDate, 'MMM'), revenue: monthRevenue });
    }
    return months;
  }, [orders]);

  // Build recent activity feed from real DB data
  const recentActivity = useMemo(() => {
    type ActivityItem = { id: string; type: 'order' | 'quote' | 'client' | 'todo'; label: string; badge: string; time: Date; color: string };
    const items: ActivityItem[] = [];

    orders.slice(0, 5).forEach(o => {
      const clientName = clients.find(c => c.id === o.clientId)?.name || 'A client';
      items.push({
        id: `o-${o.id}`,
        type: 'order',
        label: `${clientName} — order created`,
        badge: o.id,
        time: new Date(o.createdAt),
        color: 'violet',
      });
    });

    quotes.slice(0, 3).forEach(q => {
      items.push({
        id: `q-${q.id}`,
        type: 'quote',
        label: `New Quote created`,
        badge: q.id,
        time: new Date(), // quotes don't have createdAt in the type, fallback
        color: 'emerald',
      });
    });

    clients.slice(0, 3).forEach(c => {
      items.push({
        id: `c-${c.id}`,
        type: 'client',
        label: `${c.name} joined`,
        badge: c.company,
        time: new Date(c.joinedAt),
        color: 'blue',
      });
    });

    todos.filter(t => t.status === 'done').slice(0, 3).forEach(t => {
      items.push({
        id: `t-${t.id}`,
        type: 'todo',
        label: `Task completed`,
        badge: t.title.length > 25 ? t.title.slice(0, 25) + '…' : t.title,
        time: new Date(t.createdAt),
        color: 'amber',
      });
    });

    return items.sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 6);
  }, [orders, quotes, clients, todos]);

  // Upcoming renewals — active orders with due dates soonest first
  const upcomingRenewals = useMemo(() => {
    return orders
      .filter(o => o.status === 'active' && o.billingFreq !== 'one-time')
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5);
  }, [orders]);

  // Quick summary cards for bottom
  const pendingTodos = todos.filter(t => t.status === 'todo').length;
  const inProgressTodos = todos.filter(t => t.status === 'in-progress').length;
  const draftQuotes = quotes.filter(q => q.status === 'draft').length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;

  const getActivityColor = (color: string) => {
    switch (color) {
      case 'violet': return { dot: 'border-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]', badgeBg: 'text-violet-300 bg-violet-500/10 border-violet-500/20' };
      case 'emerald': return { dot: 'border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]', badgeBg: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20' };
      case 'blue': return { dot: 'border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]', badgeBg: 'text-blue-300 bg-blue-500/10 border-blue-500/20' };
      case 'amber': return { dot: 'border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]', badgeBg: 'text-amber-300 bg-amber-500/10 border-amber-500/20' };
      default: return { dot: 'border-zinc-500', badgeBg: 'text-zinc-300 bg-zinc-500/10 border-zinc-500/20' };
    }
  };

  const userName = user?.email?.split('@')[0] || 'there';
  const displayName = userName.charAt(0).toUpperCase() + userName.slice(1);

  return (
    <PageTransition className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Overview</h1>
          <p className="text-zinc-400 mt-2 font-light">Welcome back, {displayName}. Your business at a glance.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-3 rounded-full text-zinc-400 hover:text-white hover:bg-white/5 transition-colors relative border border-transparent hover:border-white/5">
            <Bell className="w-5 h-5" />
            {(dueSoon > 0 || pendingTodos > 0) && (
              <span className="absolute top-3 right-3 w-2 h-2 bg-violet-500 rounded-full shadow-[0_0_8px_rgba(139,92,246,0.6)]"></span>
            )}
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
        <StatCard title="Total Clients" value={totalClients} icon={Users} trend={totalClients > 0 ? 'up' : 'neutral'} trendValue={`${totalClients}`} index={0} loading={loading} />
        <StatCard title="Active Orders" value={activeOrders} icon={ShoppingBag} trend={activeOrders > 0 ? 'up' : 'neutral'} trendValue={`${activeOrders} active`} index={1} loading={loading} />
        <StatCard title="Total Revenue" value={formatCurrency(totalRevenue)} icon={IndianRupee} trend={totalRevenue > 0 ? 'up' : 'neutral'} trendValue={totalRevenue > 0 ? formatCurrency(totalRevenue) : '₹0'} index={2} loading={loading} />
        <StatCard title="Renewals Due" value={dueSoon} icon={Clock} trend={dueSoon > 0 ? 'down' : 'up'} trendValue={dueSoon > 0 ? `${dueSoon} pending` : 'All clear'} index={3} loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Performance Chart */}
        <Card className="lg:col-span-2 min-h-[400px] border-white/5 bg-zinc-900/20">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-violet-500" />
              Revenue Performance
            </h2>
            <span className="text-xs text-zinc-500 font-mono">Last 7 months</span>
          </div>
          <div className="h-80 w-full">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
              </div>
            ) : chartData.every(d => d.revenue === 0) ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-500">
                <TrendingUp className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm">No revenue data yet</p>
                <p className="text-xs mt-1 text-zinc-600">Create orders to see revenue trends</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
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
            )}
          </div>
        </Card>

        {/* Live Activity Feed */}
        <Card className="border-white/5 bg-zinc-900/20">
          <h2 className="text-lg font-bold text-white mb-6">Live Activity</h2>
          <div className="space-y-0">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="relative pl-8 py-4 border-l border-white/5 -ml-6 pl-12 pr-6">
                  <div className="absolute left-[-5px] top-6 w-2.5 h-2.5 rounded-full bg-zinc-800 animate-pulse" />
                  <div className="h-4 w-3/4 bg-zinc-800 rounded animate-pulse" />
                  <div className="h-3 w-1/4 bg-zinc-800 rounded animate-pulse mt-2" />
                </div>
              ))
            ) : recentActivity.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
                <Clock className="w-10 h-10 mb-3 opacity-30" />
                <p className="text-sm">No recent activity</p>
                <p className="text-xs mt-1 text-zinc-600">Actions will appear here</p>
              </div>
            ) : (
              recentActivity.map((item) => {
                const colors = getActivityColor(item.color);
                return (
                  <div key={item.id} className="relative pl-8 py-4 border-l border-white/5 group hover:bg-white/[0.02] -ml-6 pl-12 pr-6 transition-colors">
                    <div className={`absolute left-[-5px] top-6 w-2.5 h-2.5 rounded-full bg-zinc-900 border ${colors.dot}`}></div>
                    <p className="text-sm text-zinc-300 leading-relaxed">
                      {item.label}{' '}
                      <span className={`font-mono text-xs ${colors.badgeBg} px-1.5 py-0.5 rounded border`}>{item.badge}</span>
                    </p>
                    <p className="text-[10px] text-zinc-500 mt-2 font-mono uppercase tracking-widest">
                      {formatDistanceToNow(item.time, { addSuffix: true })}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Link to="/todos">
            <Card className="group hover:border-blue-500/20 transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <ListTodo className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Pending Tasks</p>
                    <p className="text-xl font-bold text-white">{loading ? '—' : pendingTodos}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-blue-400 transition-colors" />
              </div>
            </Card>
          </Link>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Link to="/todos">
            <Card className="group hover:border-amber-500/20 transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <Clock className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">In Progress</p>
                    <p className="text-xl font-bold text-white">{loading ? '—' : inProgressTodos}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-amber-400 transition-colors" />
              </div>
            </Card>
          </Link>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Link to="/quotes">
            <Card className="group hover:border-violet-500/20 transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20">
                    <FileText className="w-4 h-4 text-violet-400" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Draft Quotes</p>
                    <p className="text-xl font-bold text-white">{loading ? '—' : draftQuotes}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-violet-400 transition-colors" />
              </div>
            </Card>
          </Link>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <Link to="/orders">
            <Card className="group hover:border-emerald-500/20 transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Completed</p>
                    <p className="text-xl font-bold text-white">{loading ? '—' : completedOrders}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
              </div>
            </Card>
          </Link>
        </motion.div>
      </div>

      {/* Upcoming Renewals Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card noPadding className="overflow-hidden border-white/5 bg-zinc-900/20">
          <div className="p-6 flex justify-between items-center border-b border-white/5">
            <h2 className="text-lg font-bold text-white">Upcoming Renewals</h2>
            <Link to="/orders" className="text-xs text-violet-400 font-medium hover:text-violet-300 transition-colors uppercase tracking-widest border border-violet-500/30 px-3 py-1 rounded-lg hover:bg-violet-500/10">View All</Link>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 flex justify-center">
                <Loader2 className="w-6 h-6 text-violet-500 animate-spin" />
              </div>
            ) : upcomingRenewals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
                <CheckCircle2 className="w-10 h-10 mb-3 opacity-30" />
                <p className="text-sm">No upcoming renewals</p>
                <p className="text-xs mt-1 text-zinc-600">Recurring orders will appear here</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/5 text-zinc-500 text-[10px] uppercase tracking-widest font-mono">
                    <th className="px-6 py-4 font-semibold">Order ID</th>
                    <th className="px-6 py-4 font-semibold">Client</th>
                    <th className="px-6 py-4 font-semibold">Service</th>
                    <th className="px-6 py-4 font-semibold">Frequency</th>
                    <th className="px-6 py-4 font-semibold">Due Date</th>
                    <th className="px-6 py-4 font-semibold">Amount</th>
                    <th className="px-6 py-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {upcomingRenewals.map(order => {
                    const client = clients.find(c => c.id === order.clientId);
                    const daysUntilDue = Math.ceil((new Date(order.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                    const isUrgent = daysUntilDue <= 7;
                    return (
                      <tr key={order.id} className="hover:bg-white/[0.02] group transition-colors">
                        <td className="px-6 py-5 text-sm font-medium text-white font-mono text-xs">{order.id}</td>
                        <td className="px-6 py-5 text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors">
                          {client ? (
                            <Link to={`/clients/${client.id}`} className="hover:text-violet-400 transition-colors">{client.name}</Link>
                          ) : 'Unknown'}
                        </td>
                        <td className="px-6 py-5 text-sm text-zinc-400">{order.serviceName}</td>
                        <td className="px-6 py-5">
                          <span className="text-[10px] font-mono uppercase px-2 py-1 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">{order.billingFreq}</span>
                        </td>
                        <td className={`px-6 py-5 text-sm font-medium font-mono ${isUrgent ? 'text-rose-400' : 'text-orange-400'}`}>
                          {format(new Date(order.dueDate), 'MMM dd')}
                          {isUrgent && <span className="ml-2 text-[10px] bg-rose-500/10 text-rose-400 px-1.5 py-0.5 rounded border border-rose-500/20">{daysUntilDue}d</span>}
                        </td>
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
            )}
          </div>
        </Card>
      </motion.div>
    </PageTransition>
  );
};