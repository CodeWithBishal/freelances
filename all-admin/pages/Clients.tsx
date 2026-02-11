import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Mail, Phone, MapPin, ChevronRight, UserPlus, X, Upload } from 'lucide-react';
import { fetchClients, createClient } from '../services/database';
import { Client } from '../types';
import { Card } from '../components/Card';
import { PageTransition } from '../components/PageTransition';
import { AnimatePresence, motion } from 'framer-motion';

export const Clients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Client Form State
  const [newClient, setNewClient] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    fetchClients()
      .then(setClients)
      .catch(err => console.error('Failed to fetch clients:', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await createClient({
        ...newClient,
        avatar: `https://picsum.photos/200/200?random=${Date.now()}`,
      });
      setClients([created, ...clients]);
      setIsModalOpen(false);
      setNewClient({ name: '', company: '', email: '', phone: '', address: '' });
    } catch (err) {
      console.error('Failed to create client:', err);
      alert('Failed to create client. Please try again.');
    }
  };

  return (
    <PageTransition className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Clients</h1>
          <p className="text-zinc-400 mt-2 font-light">Network & Relationships</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="group flex items-center gap-2 bg-white text-black px-5 py-3 rounded-xl hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] font-semibold text-sm"
        >
          <UserPlus className="w-4 h-4 transition-transform group-hover:scale-110" />
          <span>Add New Client</span>
        </button>
      </div>

      <Card noPadding className="overflow-hidden min-h-[600px] border-white/5 bg-zinc-900/20">
        <div className="p-4 border-b border-white/5 bg-white/[0.02]">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search directory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all placeholder-zinc-600"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/[0.02] text-zinc-500 border-b border-white/5">
              <tr className="text-[10px] uppercase tracking-widest font-mono">
                <th className="px-8 py-5 font-semibold">Client Identity</th>
                <th className="px-6 py-5 font-semibold">Contact Info</th>
                <th className="px-6 py-5 font-semibold">Location</th>
                <th className="px-6 py-5 font-semibold">Status</th>
                <th className="px-6 py-5 font-semibold text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-5">
                    <Link to={`/clients/${client.id}`} className="flex items-center gap-4 group/link">
                      <div className="relative">
                        <div className="absolute inset-0 bg-violet-500 blur opacity-0 group-hover/link:opacity-40 transition-opacity rounded-full"></div>
                        <img src={client.avatar} alt={client.name} className="relative w-12 h-12 rounded-full object-cover ring-2 ring-zinc-900 group-hover/link:ring-violet-500/50 transition-all" />
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-zinc-900 rounded-full"></div>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white group-hover/link:text-violet-300 transition-colors">{client.name}</p>
                        <p className="text-xs text-zinc-500 font-mono mt-0.5">{client.company}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors font-mono text-xs">
                        <Mail className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400" />
                        {client.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors font-mono text-xs">
                        <Phone className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400" />
                        {client.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <MapPin className="w-3.5 h-3.5 text-zinc-600" />
                      <span className="truncate max-w-[150px]">{client.address}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <Link to={`/clients/${client.id}`} className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-zinc-600 hover:text-white hover:bg-violet-600 transition-all opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0">
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Client Modal */}
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
                <h2 className="text-lg font-bold text-white">Add New Client</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddClient} className="p-6 space-y-4">
                <div className="flex justify-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-zinc-800 border-2 border-dashed border-zinc-600 flex flex-col items-center justify-center text-zinc-500 hover:text-white hover:border-violet-500 hover:bg-violet-500/10 transition-all cursor-pointer group">
                    <Upload className="w-6 h-6 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold uppercase tracking-wide">Avatar</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Full Name</label>
                    <input
                      required
                      value={newClient.name}
                      onChange={e => setNewClient({ ...newClient, name: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Company</label>
                    <input
                      required
                      value={newClient.company}
                      onChange={e => setNewClient({ ...newClient, company: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    required
                    value={newClient.email}
                    onChange={e => setNewClient({ ...newClient, email: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Phone</label>
                  <input
                    required
                    value={newClient.phone}
                    onChange={e => setNewClient({ ...newClient, phone: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Address</label>
                  <input
                    value={newClient.address}
                    onChange={e => setNewClient({ ...newClient, address: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 outline-none transition-all"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 font-medium transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold shadow-lg shadow-violet-600/20 transition-all">
                    Create Profile
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