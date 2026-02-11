import React, { useState, useEffect } from 'react';
import { Plus, FileText, Send, MoreVertical, Edit2, Calendar } from 'lucide-react';
import { fetchQuotes } from '../services/database';
import { Quote } from '../types';
import { format } from 'date-fns';
import { Card } from '../components/Card';

const formatCurrency = (amount: number) => {
   return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
   }).format(amount);
};

export const Quotes = () => {
   const [quotes, setQuotes] = useState<Quote[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      fetchQuotes()
         .then(setQuotes)
         .catch(err => console.error('Failed to fetch quotes:', err))
         .finally(() => setLoading(false));
   }, []);

   return (
      <div className="space-y-6 animate-in fade-in duration-500">
         <div className="flex justify-between items-center">
            <div>
               <h1 className="text-3xl font-bold text-white tracking-tight">Quotes</h1>
               <p className="text-zinc-400 mt-1">Create, track, and manage project proposals.</p>
            </div>
            <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-all shadow-lg shadow-indigo-500/20 text-sm font-medium">
               <Plus className="w-4 h-4" />
               <span>New Quote</span>
            </button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quotes.map(quote => (
               <Card key={quote.id} noPadding className="hover:border-zinc-600 transition-colors group">
                  <div className="p-6">
                     <div className="flex justify-between items-start mb-4">
                        <div className={`p-2.5 rounded-xl ${quote.status === 'sent' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-zinc-800 text-zinc-400'}`}>
                           <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex items-center gap-2">
                           <span className={`text-xs font-semibold px-2.5 py-1 rounded-md capitalize border ${quote.status === 'sent' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                              quote.status === 'draft' ? 'bg-zinc-800 text-zinc-400 border-zinc-700' :
                                 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              }`}>
                              {quote.status}
                           </span>
                           <button className="text-zinc-600 hover:text-zinc-300 transition-colors"><MoreVertical className="w-4 h-4" /></button>
                        </div>
                     </div>

                     <h3 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">{quote.title}</h3>
                     <p className="text-sm text-zinc-500 mb-6 font-medium">for {quote.clientName}</p>

                     <div className="space-y-3 mb-6 bg-zinc-900/50 p-4 rounded-lg border border-zinc-800/50">
                        {quote.items.map((item, idx) => (
                           <div key={idx} className="flex justify-between text-sm">
                              <span className="text-zinc-400">{item.description}</span>
                              <span className="font-medium text-zinc-200">{formatCurrency(item.price)}</span>
                           </div>
                        ))}
                        <div className="border-t border-zinc-800 pt-3 flex justify-between items-center mt-3">
                           <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Total</span>
                           <span className="text-xl font-bold text-white">{formatCurrency(quote.totalAmount)}</span>
                        </div>
                     </div>

                     <div className="flex items-center justify-between text-xs text-zinc-500 pt-2">
                        <div className="flex items-center gap-1.5">
                           <Calendar className="w-3.5 h-3.5" />
                           <span>Valid until {format(new Date(quote.validUntil), 'MMM dd')}</span>
                        </div>
                        <div className="flex gap-3">
                           <button className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors">
                              <Edit2 className="w-3.5 h-3.5" /> Edit
                           </button>
                           {quote.status === 'draft' && (
                              <button className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                                 <Send className="w-3.5 h-3.5" /> Send
                              </button>
                           )}
                        </div>
                     </div>
                  </div>
                  {/* Progress bar visual for sent quotes */}
                  {quote.status === 'sent' && (
                     <div className="h-1 w-full bg-zinc-800">
                        <div className="h-full bg-indigo-500 w-2/3"></div>
                     </div>
                  )}
               </Card>
            ))}

            {/* Empty State / Add New Placeholder */}
            <button className="border border-dashed border-zinc-800 rounded-xl p-6 flex flex-col items-center justify-center text-zinc-500 hover:border-indigo-500/50 hover:text-indigo-400 hover:bg-indigo-500/5 transition-all group min-h-[350px]">
               <div className="p-4 rounded-full bg-zinc-900 group-hover:bg-indigo-500/10 transition-colors mb-4 border border-zinc-800 group-hover:border-indigo-500/20">
                  <Plus className="w-8 h-8" />
               </div>
               <span className="font-medium">Create New Quote</span>
               <span className="text-xs text-zinc-600 mt-2">Start from scratch or use a template</span>
            </button>
         </div>
      </div>
   );
};