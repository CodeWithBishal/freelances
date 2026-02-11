import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Lock, Eye, EyeOff, Plus, FileText, Paperclip, MoreHorizontal, ShieldCheck, X, Trash2, Wand2, Calculator, FileDown, Copy, RefreshCw, FileCheck, Save, Calendar, DollarSign, Briefcase, ArrowDownUp, Search, RotateCcw, Edit2, Check, ShoppingCart, Image as ImageIcon, File, Download, Clock, ChevronRight } from 'lucide-react';
import {
    fetchClientById, fetchOrdersByClient, fetchQuotesByClient,
    fetchNotesByClient, fetchCredentialsByClient,
    createOrder, createNote, updateNoteContent, softDeleteNote, undeleteNote,
    createCredential, createQuote
} from '../services/database';
import { format } from 'date-fns';
import { clsx } from 'clsx';
import { Card } from '../components/Card';
import { QuoteItem, Quote, Note, Credential, Order, Client } from '../types';
import { PageTransition } from '../components/PageTransition';
import { motion, AnimatePresence } from 'framer-motion';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
};

export const ClientDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // -- Data States --
    const [client, setClient] = useState<Client | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'quotes' | 'notes' | 'vault' | 'attachments'>('overview');
    const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});

    const [notes, setNotes] = useState<Note[]>([]);
    const [credentials, setCredentials] = useState<Credential[]>([]);
    const [clientOrders, setClientOrders] = useState<Order[]>([]);
    const [clientQuotes, setClientQuotes] = useState<Quote[]>([]);

    // Form States
    const [noteContent, setNoteContent] = useState('');
    const [isAddingCredential, setIsAddingCredential] = useState(false);
    const [newCred, setNewCred] = useState({ service: '', username: '', password: '' });

    // Note Features State
    const [noteSearch, setNoteSearch] = useState('');
    const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
    const [editingContent, setEditingContent] = useState('');

    // Quick Action Modal States
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
    const [quickOrderForm, setQuickOrderForm] = useState({ serviceName: '', amount: '', billingFreq: 'one-time', dueDate: '' });
    const [invoiceForm, setInvoiceForm] = useState({ description: '', amount: '', dueDate: '' });

    // Order Details Modal
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    // Quote Builder State
    const [isCreatingQuote, setIsCreatingQuote] = useState(false);
    const [newQuoteItems, setNewQuoteItems] = useState<QuoteItem[]>([{ description: '', price: 0, quantity: 1 }]);
    const [newQuoteTitle, setNewQuoteTitle] = useState('');

    // Fetch all data on mount
    useEffect(() => {
        if (!id) return;
        Promise.all([
            fetchClientById(id),
            fetchOrdersByClient(id),
            fetchQuotesByClient(id),
            fetchNotesByClient(id),
            fetchCredentialsByClient(id),
        ])
            .then(([clientData, ordersData, quotesData, notesData, credsData]) => {
                setClient(clientData);
                setClientOrders(ordersData);
                setClientQuotes(quotesData);
                setNotes(notesData);
                setCredentials(credsData);
            })
            .catch(err => console.error('Failed to fetch client data:', err))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="p-8 text-white flex items-center justify-center min-h-[400px]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div></div>;
    if (!client) return <div className="p-8 text-white">Client not found</div>;

    const togglePassword = (credId: string) => {
        setShowPassword(prev => ({ ...prev, [credId]: !prev[credId] }));
    };

    // --- Handlers ---

    const handleSaveNote = async () => {
        if (!noteContent.trim()) return;
        try {
            const newNote = await createNote({ clientId: client.id, content: noteContent });
            setNotes([newNote, ...notes]);
            setNoteContent('');
        } catch (err) {
            console.error('Failed to save note:', err);
            alert('Failed to save note.');
        }
    };

    const handleSoftDeleteNote = async (noteId: string) => {
        try {
            await softDeleteNote(noteId);
            setNotes(notes.map(n => n.id === noteId ? { ...n, isDeleted: true } : n));
        } catch (err) {
            console.error('Failed to delete note:', err);
        }
    };

    const handleUndeleteNote = async (noteId: string) => {
        try {
            await undeleteNote(noteId);
            setNotes(notes.map(n => n.id === noteId ? { ...n, isDeleted: false } : n));
        } catch (err) {
            console.error('Failed to restore note:', err);
        }
    };

    const startEditingNote = (note: Note) => {
        setEditingNoteId(note.id);
        setEditingContent(note.content);
    };

    const saveEditedNote = async () => {
        if (!editingNoteId || !editingContent.trim()) return;
        try {
            await updateNoteContent(editingNoteId, editingContent);
            setNotes(notes.map(n => n.id === editingNoteId ? { ...n, content: editingContent } : n));
            setEditingNoteId(null);
            setEditingContent('');
        } catch (err) {
            console.error('Failed to update note:', err);
            alert('Failed to update note.');
        }
    };

    const cancelEditNote = () => {
        setEditingNoteId(null);
        setEditingContent('');
    };

    const handleSaveCredential = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const newCredential = await createCredential({
                clientId: client.id,
                service: newCred.service,
                username: newCred.username,
                passwordEncrypted: newCred.password
            });
            setCredentials([...credentials, newCredential]);
            setIsAddingCredential(false);
            setNewCred({ service: '', username: '', password: '' });
        } catch (err) {
            console.error('Failed to save credential:', err);
            alert('Failed to save credential.');
        }
    };

    const handleQuickOrderSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const newOrder = await createOrder({
                id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
                clientId: client.id,
                serviceName: quickOrderForm.serviceName,
                amount: parseFloat(quickOrderForm.amount),
                dueDate: quickOrderForm.dueDate || new Date().toISOString(),
                status: 'active',
                billingFreq: quickOrderForm.billingFreq as any,
                description: 'Generated via Quick Action',
            });
            setClientOrders([newOrder, ...clientOrders]);
            setIsOrderModalOpen(false);
            setQuickOrderForm({ serviceName: '', amount: '', billingFreq: 'one-time', dueDate: '' });
            setActiveTab('orders');
        } catch (err) {
            console.error('Failed to create order:', err);
            alert('Failed to create order.');
        }
    };

    const handleInvoiceSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const newInvoice = await createOrder({
                id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
                clientId: client.id,
                serviceName: invoiceForm.description,
                amount: parseFloat(invoiceForm.amount),
                dueDate: invoiceForm.dueDate || new Date().toISOString(),
                status: 'pending',
                billingFreq: 'one-time',
                description: 'Direct Invoice'
            });
            setClientOrders([newInvoice, ...clientOrders]);
            setIsInvoiceModalOpen(false);
            setInvoiceForm({ description: '', amount: '', dueDate: '' });
            setActiveTab('orders');
            alert(`Invoice ${newInvoice.id} sent to ${client.email}`);
        } catch (err) {
            console.error('Failed to create invoice:', err);
            alert('Failed to create invoice.');
        }
    };

    // Quote Builder Handlers
    const addQuoteItem = () => {
        setNewQuoteItems([...newQuoteItems, { description: '', price: 0, quantity: 1 }]);
    };

    const removeQuoteItem = (index: number) => {
        setNewQuoteItems(newQuoteItems.filter((_, i) => i !== index));
    };

    const updateQuoteItem = (index: number, field: keyof QuoteItem, value: any) => {
        const updated = [...newQuoteItems];
        updated[index] = { ...updated[index], [field]: value };
        setNewQuoteItems(updated);
    };

    const calculateTotal = () => {
        return newQuoteItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const handleDownloadPDF = () => {
        if (!newQuoteTitle) {
            alert("Please enter a project title first.");
            return;
        }
        alert(`Generating PDF Proposal for "${newQuoteTitle}"...\n\n(This would trigger a real PDF download in production)`);
        setIsCreatingQuote(false);
    };

    const handleSaveTemplate = () => {
        if (!newQuoteTitle) {
            alert("Please enter a template name.");
            return;
        }
        alert(`Saved "${newQuoteTitle}" as a reusable quote template.`);
    };

    const handleConvertToOrder = async (quote: Quote) => {
        const confirmConvert = window.confirm(`Convert quote "${quote.title}" (${quote.id}) into an active order?\n\nTotal Value: ${formatCurrency(quote.totalAmount)}`);
        if (confirmConvert) {
            try {
                const newOrder = await createOrder({
                    id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
                    clientId: client.id,
                    serviceName: quote.title,
                    amount: quote.totalAmount,
                    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                    status: 'active',
                    billingFreq: 'one-time',
                    description: `Converted from Quote ${quote.id}`
                });
                setClientOrders([newOrder, ...clientOrders]);
                setActiveTab('orders');
                alert(`Quote converted successfully!`);
            } catch (err) {
                console.error('Failed to convert quote:', err);
                alert('Failed to convert quote to order.');
            }
        }
    };

    const filteredNotes = notes.filter(n =>
        n.content.toLowerCase().includes(noteSearch.toLowerCase())
    );

    // Aggregate Attachments Logic
    const allAttachments = [
        ...notes.flatMap(n => (n.attachments || []).map(a => ({ ...a, source: 'Note', date: n.createdAt, refId: n.id }))),
        ...clientOrders.flatMap(o => (o.attachments || []).map(a => ({ ...a, source: 'Order', date: o.createdAt, refId: o.id })))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <PageTransition className="space-y-8">
            <Link to="/clients" className="inline-flex items-center text-xs font-mono text-zinc-500 hover:text-white transition-colors uppercase tracking-widest group">
                <ArrowLeft className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Directory
            </Link>

            {/* Header */}
            <Card className="relative overflow-hidden border-white/5 bg-zinc-900/40">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="flex flex-col md:flex-row justify-between md:items-start gap-6 relative z-10">
                    <div className="flex items-center gap-8">
                        <div className="relative group cursor-pointer">
                            <div className="absolute inset-0 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                            <img src={client.avatar} alt={client.name} className="relative w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-2 border-white/5 shadow-2xl" />
                            <div className="absolute bottom-2 right-2 w-5 h-5 bg-[#030304] rounded-full flex items-center justify-center">
                                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{client.name}</h1>
                            <p className="text-violet-400 font-medium text-lg mt-1 flex items-center gap-2">
                                {client.company} <span className="w-1 h-1 rounded-full bg-zinc-700"></span> <span className="text-zinc-500 text-sm">Tech Partner</span>
                            </p>
                            <div className="flex flex-wrap gap-x-8 gap-y-3 mt-6">
                                <div className="flex items-center text-sm text-zinc-400 hover:text-white transition-colors cursor-pointer group">
                                    <Mail className="w-4 h-4 mr-2 text-zinc-600 group-hover:text-violet-400 transition-colors" />
                                    {client.email}
                                </div>
                                <div className="flex items-center text-sm text-zinc-400 hover:text-white transition-colors cursor-pointer group">
                                    <Phone className="w-4 h-4 mr-2 text-zinc-600 group-hover:text-violet-400 transition-colors" />
                                    {client.phone}
                                </div>
                            </div>
                        </div>
                    </div>
                    <button className="hidden md:block px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-zinc-300 hover:text-white font-medium transition-all text-sm backdrop-blur-sm">
                        Manage Profile
                    </button>
                </div>
            </Card>

            {/* Tabs */}
            <div className="border-b border-white/5 overflow-x-auto scrollbar-hide">
                <nav className="flex space-x-8 md:space-x-10 min-w-max">
                    {['overview', 'orders', 'quotes', 'notes', 'attachments', 'vault'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={clsx(
                                'py-4 px-2 border-b-2 font-medium text-sm transition-all capitalize relative flex-shrink-0',
                                activeTab === tab
                                    ? 'border-violet-500 text-white'
                                    : 'border-transparent text-zinc-500 hover:text-zinc-300'
                            )}
                        >
                            <span className="flex items-center gap-2 relative z-10">
                                {tab === 'overview' && <FileText className="w-4 h-4" />}
                                {tab === 'orders' && <ShoppingCart className="w-4 h-4" />}
                                {tab === 'quotes' && <Calculator className="w-4 h-4" />}
                                {tab === 'notes' && <Paperclip className="w-4 h-4" />}
                                {tab === 'attachments' && <File className="w-4 h-4" />}
                                {tab === 'vault' && <Lock className="w-4 h-4" />}
                                {tab}
                            </span>
                            {activeTab === tab && (
                                <motion.div layoutId="activeTab" className="absolute inset-0 bg-white/[0.02] -z-0 rounded-t-lg" />
                            )}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 xl:grid-cols-3 gap-8"
                >
                    {/* Main Content Area */}
                    <div className="xl:col-span-2 space-y-6">

                        {activeTab === 'overview' && (
                            <Card noPadding className="border-white/5 bg-zinc-900/20">
                                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                                    <h3 className="font-bold text-white flex items-center gap-2 text-sm uppercase tracking-wider">
                                        Recent Activity
                                    </h3>
                                    <button onClick={() => setActiveTab('orders')} className="text-xs text-violet-400 hover:text-white transition-colors">View All Orders</button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-white/[0.02] text-zinc-500 text-[10px] uppercase tracking-widest font-mono">
                                            <tr>
                                                <th className="px-6 py-4 font-semibold">Ref ID</th>
                                                <th className="px-6 py-4 font-semibold">Service</th>
                                                <th className="px-6 py-4 font-semibold">Status</th>
                                                <th className="px-6 py-4 font-semibold text-right">Value</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {clientOrders.slice(0, 5).map(order => (
                                                <tr key={order.id} onClick={() => setSelectedOrder(order)} className="hover:bg-white/[0.02] transition-colors cursor-pointer">
                                                    <td className="px-6 py-4 text-sm font-medium text-white font-mono text-xs opacity-70">{order.id}</td>
                                                    <td className="px-6 py-4 text-sm text-zinc-300">{order.serviceName}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={clsx(
                                                            "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border",
                                                            order.status === 'active' ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/20" :
                                                                order.status === 'completed' ? "bg-zinc-700/20 text-zinc-400 border-zinc-700/30" :
                                                                    order.status === 'pending' ? "bg-amber-500/5 text-amber-400 border-amber-500/20" :
                                                                        "bg-rose-500/5 text-rose-400 border-rose-500/20"
                                                        )}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-white font-medium text-right font-mono">{formatCurrency(order.amount)}</td>
                                                </tr>
                                            ))}
                                            {clientOrders.length === 0 && (
                                                <tr>
                                                    <td colSpan={4} className="px-6 py-8 text-center text-zinc-500 text-sm">No orders found for this client.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        )}

                        {activeTab === 'orders' && (
                            <div className="space-y-6">
                                <Card noPadding className="border-white/5 bg-zinc-900/20">
                                    <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                        <div>
                                            <h3 className="font-bold text-white text-lg">Order History</h3>
                                            <p className="text-zinc-500 text-xs mt-1">Active and previous transactions</p>
                                        </div>
                                        <button
                                            onClick={() => setIsOrderModalOpen(true)}
                                            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white px-4 py-2 rounded-xl transition-all text-sm font-medium border border-white/10"
                                        >
                                            <Plus className="w-4 h-4" /> New Order
                                        </button>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-white/[0.02] text-zinc-500 text-[10px] uppercase tracking-widest font-mono">
                                                <tr>
                                                    <th className="px-6 py-4 font-semibold">Order ID</th>
                                                    <th className="px-6 py-4 font-semibold">Service Name</th>
                                                    <th className="px-6 py-4 font-semibold">Billing</th>
                                                    <th className="px-6 py-4 font-semibold">Due Date</th>
                                                    <th className="px-6 py-4 font-semibold">Status</th>
                                                    <th className="px-6 py-4 font-semibold text-right">Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {clientOrders.map(order => (
                                                    <tr key={order.id} onClick={() => setSelectedOrder(order)} className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
                                                        <td className="px-6 py-4 text-sm font-medium text-white font-mono text-xs opacity-70 group-hover:opacity-100">{order.id}</td>
                                                        <td className="px-6 py-4 text-sm text-zinc-300 font-medium">{order.serviceName}</td>
                                                        <td className="px-6 py-4 text-[10px] text-zinc-500 uppercase font-bold tracking-wider">{order.billingFreq}</td>
                                                        <td className="px-6 py-4 text-sm text-zinc-500 font-mono">{format(new Date(order.dueDate), 'MMM dd, yyyy')}</td>
                                                        <td className="px-6 py-4">
                                                            <span className={clsx(
                                                                "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border",
                                                                order.status === 'active' ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/20" :
                                                                    order.status === 'completed' ? "bg-zinc-700/20 text-zinc-400 border-zinc-700/30" :
                                                                        order.status === 'pending' ? "bg-amber-500/5 text-amber-400 border-amber-500/20" :
                                                                            "bg-rose-500/5 text-rose-400 border-rose-500/20"
                                                            )}>
                                                                {order.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-white font-medium text-right font-mono">{formatCurrency(order.amount)}</td>
                                                    </tr>
                                                ))}
                                                {clientOrders.length === 0 && (
                                                    <tr>
                                                        <td colSpan={6} className="px-6 py-12 text-center text-zinc-500 text-sm">
                                                            No orders found for this client. <br />
                                                            <button onClick={() => setIsOrderModalOpen(true)} className="mt-2 text-violet-400 hover:text-white underline">Create the first one</button>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </Card>
                            </div>
                        )}

                        {activeTab === 'quotes' && (
                            <div className="space-y-6">
                                {!isCreatingQuote ? (
                                    <>
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-bold text-white text-lg">Proposals & Estimates</h3>
                                            <button
                                                onClick={() => setIsCreatingQuote(true)}
                                                className="flex items-center gap-2 bg-white text-black hover:bg-zinc-200 px-5 py-2.5 rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] text-sm font-bold group"
                                            >
                                                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" /> Create Quote
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            {clientQuotes.map(quote => (
                                                <motion.div
                                                    key={quote.id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="group"
                                                >
                                                    <Card noPadding className="hover:border-violet-500/30 transition-colors bg-zinc-900/20">
                                                        <div className="p-6">
                                                            <div className="flex justify-between items-start mb-6">
                                                                <div className="flex items-center gap-4">
                                                                    <div className={clsx("p-3 rounded-2xl shadow-inner", quote.status === 'sent' ? 'bg-violet-500/10 text-violet-400 shadow-violet-500/5' : 'bg-zinc-800 text-zinc-400')}>
                                                                        <Wand2 className="w-6 h-6" />
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="text-xl font-bold text-white group-hover:text-violet-200 transition-colors">{quote.title}</h3>
                                                                        <p className="text-xs text-zinc-500 font-mono mt-1">{quote.id} • Created {format(new Date(), 'MMM dd')}</p>
                                                                    </div>
                                                                </div>
                                                                <span className={clsx("text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border",
                                                                    quote.status === 'sent' ? 'bg-violet-500/10 text-violet-400 border-violet-500/20' :
                                                                        quote.status === 'draft' ? 'bg-zinc-800 text-zinc-400 border-zinc-700' :
                                                                            'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                                )}>
                                                                    {quote.status}
                                                                </span>
                                                            </div>

                                                            <div className="space-y-3 mb-6 bg-black/40 p-5 rounded-xl border border-white/5">
                                                                {quote.items.map((item, i) => (
                                                                    <div key={i} className="flex justify-between text-sm group/item">
                                                                        <div className="flex items-center gap-3">
                                                                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-700 group-hover/item:bg-violet-500 transition-colors"></span>
                                                                            <span className="text-zinc-300">{item.description} <span className="text-zinc-600 ml-1">x{item.quantity}</span></span>
                                                                        </div>
                                                                        <span className="text-white font-mono">{formatCurrency(item.price * item.quantity)}</span>
                                                                    </div>
                                                                ))}
                                                                <div className="border-t border-white/10 pt-4 flex justify-between items-center mt-4">
                                                                    <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Total Value</span>
                                                                    <span className="text-2xl font-bold text-white tracking-tight">{formatCurrency(quote.totalAmount)}</span>
                                                                </div>
                                                            </div>

                                                            <div className="flex justify-between items-center">
                                                                <div className="flex -space-x-2">
                                                                    <div className="w-8 h-8 rounded-full border border-black bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-400">AD</div>
                                                                </div>
                                                                <div className="flex items-center gap-3">
                                                                    {quote.status !== 'rejected' && (
                                                                        <button
                                                                            onClick={() => handleConvertToOrder(quote)}
                                                                            className="text-xs font-bold text-emerald-500 hover:text-emerald-300 transition-colors flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 hover:border-emerald-500/50"
                                                                        >
                                                                            <RefreshCw className="w-3.5 h-3.5" /> Convert to Order
                                                                        </button>
                                                                    )}
                                                                    {quote.status === 'draft' && (
                                                                        <button className="text-sm font-medium text-violet-400 hover:text-white transition-colors flex items-center gap-2">
                                                                            Edit <ArrowLeft className="w-4 h-4 rotate-180" />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <Card className="animate-in slide-in-from-bottom-8 duration-500 border-violet-500/20 shadow-[0_0_50px_rgba(124,58,237,0.1)]">
                                        <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
                                            <div>
                                                <h3 className="font-bold text-white text-2xl flex items-center gap-3">
                                                    <Calculator className="w-6 h-6 text-violet-500" />
                                                    Quote Builder
                                                </h3>
                                                <p className="text-zinc-500 text-sm mt-1">Drafting proposal for <span className="text-white">{client.name}</span></p>
                                            </div>
                                            <button onClick={() => setIsCreatingQuote(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors">
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="space-y-8">
                                            <div>
                                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Project Title</label>
                                                <input
                                                    type="text"
                                                    value={newQuoteTitle}
                                                    onChange={(e) => setNewQuoteTitle(e.target.value)}
                                                    placeholder="e.g. Q3 System Architecture Overhaul"
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-lg placeholder-zinc-700 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
                                                    autoFocus
                                                />
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest">Line Items</label>
                                                    <button onClick={addQuoteItem} className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 font-medium bg-violet-500/10 px-2 py-1 rounded-lg border border-violet-500/20 hover:border-violet-500/40 transition-all">
                                                        <Plus className="w-3 h-3" /> Add Item
                                                    </button>
                                                </div>

                                                <div className="space-y-3">
                                                    <AnimatePresence>
                                                        {newQuoteItems.map((item, idx) => (
                                                            <motion.div
                                                                key={idx}
                                                                initial={{ opacity: 0, height: 0 }}
                                                                animate={{ opacity: 1, height: 'auto' }}
                                                                exit={{ opacity: 0, height: 0 }}
                                                                className="flex gap-3 items-start group"
                                                            >
                                                                <div className="flex-1">
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Item description..."
                                                                        value={item.description}
                                                                        onChange={(e) => updateQuoteItem(idx, 'description', e.target.value)}
                                                                        className="w-full bg-zinc-900/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500/50 focus:bg-zinc-900 transition-colors"
                                                                    />
                                                                </div>
                                                                <div className="w-20">
                                                                    <input
                                                                        type="number"
                                                                        placeholder="Qty"
                                                                        value={item.quantity}
                                                                        onChange={(e) => updateQuoteItem(idx, 'quantity', parseInt(e.target.value) || 1)}
                                                                        className="w-full bg-zinc-900/50 border border-white/5 rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-violet-500/50 text-center"
                                                                    />
                                                                </div>
                                                                <div className="w-32 relative">
                                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">₹</span>
                                                                    <input
                                                                        type="number"
                                                                        placeholder="0"
                                                                        value={item.price || ''}
                                                                        onChange={(e) => updateQuoteItem(idx, 'price', parseFloat(e.target.value) || 0)}
                                                                        className="w-full bg-zinc-900/50 border border-white/5 rounded-xl pl-6 pr-3 py-3 text-sm text-white focus:outline-none focus:border-violet-500/50 font-mono text-right"
                                                                    />
                                                                </div>
                                                                <button onClick={() => removeQuoteItem(idx)} className="p-3 text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors opacity-0 group-hover:opacity-100">
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </motion.div>
                                                        ))}
                                                    </AnimatePresence>
                                                </div>
                                            </div>

                                            <div className="border-t border-white/10 pt-6 flex flex-col items-end gap-2">
                                                <div className="flex justify-between w-full md:w-1/2 lg:w-1/3 border-t border-white/10 pt-2 mt-2">
                                                    <span className="text-xs font-bold text-violet-400 uppercase tracking-widest">Total Estimate</span>
                                                    <span className="text-3xl font-bold text-white tracking-tight">{formatCurrency(calculateTotal())}</span>
                                                </div>
                                            </div>

                                            <div className="flex gap-4 pt-4">
                                                <button onClick={handleDownloadPDF} className="flex-1 bg-white text-black hover:bg-zinc-200 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2 group">
                                                    <FileDown className="w-4 h-4 group-hover:scale-110 transition-transform" /> Download PDF Proposal
                                                </button>
                                                <button onClick={handleSaveTemplate} className="flex-1 bg-transparent hover:bg-white/5 text-zinc-300 py-3 rounded-xl font-semibold transition-all border border-white/10 flex items-center justify-center gap-2 hover:text-white">
                                                    <Copy className="w-4 h-4" /> Save as Template
                                                </button>
                                            </div>
                                        </div>
                                    </Card>
                                )}
                            </div>
                        )}

                        {activeTab === 'notes' && (
                            <div className="space-y-4">
                                <Card className="bg-zinc-900/60 border-white/10 focus-within:border-violet-500/50 focus-within:ring-1 focus-within:ring-violet-500/20 transition-all">
                                    <textarea
                                        className="w-full bg-transparent border-0 focus:ring-0 text-white placeholder-zinc-600 resize-none h-24 p-4"
                                        placeholder="Jot down specifics..."
                                        value={noteContent}
                                        onChange={(e) => setNoteContent(e.target.value)}
                                    ></textarea>
                                    <div className="flex justify-between items-center px-4 pb-4 pt-2">
                                        <button className="text-zinc-500 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors">
                                            <Paperclip className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={handleSaveNote}
                                            disabled={!noteContent.trim()}
                                            className="bg-violet-600 text-white px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wide hover:bg-violet-500 shadow-lg shadow-violet-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            Save Note
                                        </button>
                                    </div>
                                </Card>

                                <div className="flex items-center gap-2 mb-2 bg-black/40 border border-white/10 rounded-xl px-3 py-2">
                                    <Search className="w-4 h-4 text-zinc-500" />
                                    <input
                                        type="text"
                                        placeholder="Search notes..."
                                        value={noteSearch}
                                        onChange={(e) => setNoteSearch(e.target.value)}
                                        className="bg-transparent border-none text-sm text-white focus:ring-0 w-full placeholder-zinc-600 focus:outline-none"
                                    />
                                    {noteSearch && (
                                        <button onClick={() => setNoteSearch('')} className="text-zinc-500 hover:text-white">
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>

                                <div className="relative border-l border-white/10 ml-4 space-y-4 pl-8 py-2">
                                    {filteredNotes.map(note => (
                                        <div key={note.id} className="relative group">
                                            <div className={clsx("absolute -left-[37px] top-0 border w-4 h-4 rounded-full transition-all shadow-[0_0_10px_rgba(124,58,237,0.4)]",
                                                note.isDeleted ? "bg-zinc-800 border-zinc-600" : "bg-black border-violet-500/50 group-hover:scale-110"
                                            )}></div>

                                            <Card className={clsx("transition-colors bg-zinc-900/20",
                                                note.isDeleted ? "border-red-900/20 bg-red-900/5" : "hover:border-white/10"
                                            )}>
                                                {editingNoteId === note.id ? (
                                                    <div className="space-y-3">
                                                        <textarea
                                                            value={editingContent}
                                                            onChange={(e) => setEditingContent(e.target.value)}
                                                            className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white resize-none h-24 focus:border-violet-500/50 focus:outline-none"
                                                            autoFocus
                                                        />
                                                        <div className="flex justify-end gap-2">
                                                            <button onClick={cancelEditNote} className="p-2 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-colors">
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                            <button onClick={saveEditedNote} className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg text-emerald-400 border border-emerald-500/20 transition-colors">
                                                                <Check className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="flex justify-between items-start mb-3">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] font-bold text-zinc-500 font-mono uppercase tracking-widest">{format(new Date(note.createdAt), 'MMM dd • HH:mm')}</span>
                                                                {note.isDeleted && <span className="text-[9px] bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded border border-red-500/20 uppercase font-bold tracking-wider">Deleted</span>}
                                                            </div>
                                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                {note.isDeleted ? (
                                                                    <button onClick={() => handleUndeleteNote(note.id)} className="text-zinc-500 hover:text-emerald-400 transition-colors" title="Restore">
                                                                        <RotateCcw className="w-4 h-4" />
                                                                    </button>
                                                                ) : (
                                                                    <>
                                                                        <button onClick={() => startEditingNote(note)} className="text-zinc-500 hover:text-violet-400 transition-colors" title="Edit">
                                                                            <Edit2 className="w-4 h-4" />
                                                                        </button>
                                                                        <button onClick={() => handleSoftDeleteNote(note.id)} className="text-zinc-500 hover:text-red-400 transition-colors" title="Delete">
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <p className={clsx("text-sm whitespace-pre-wrap leading-relaxed",
                                                            note.isDeleted ? "text-zinc-600 line-through decoration-zinc-700" : "text-zinc-300"
                                                        )}>
                                                            {note.content}
                                                        </p>
                                                        {note.attachments && note.attachments.length > 0 && (
                                                            <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-white/5">
                                                                {note.attachments.map((file, idx) => (
                                                                    <div key={idx} className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5 hover:border-violet-500/30 transition-colors cursor-pointer group/file">
                                                                        {file.type === 'image' ? <ImageIcon className="w-3 h-3 text-purple-400" /> : <FileText className="w-3 h-3 text-blue-400" />}
                                                                        <span className="text-xs text-zinc-400 group-hover/file:text-zinc-200">{file.name}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </Card>
                                        </div>
                                    ))}
                                    {filteredNotes.length === 0 && (
                                        <p className="text-zinc-600 text-sm italic">
                                            {noteSearch ? "No notes found matching your search." : "No notes yet. Start writing above."}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'attachments' && (
                            <div className="space-y-6">
                                <Card noPadding className="border-white/5 bg-zinc-900/20">
                                    <div className="p-6 border-b border-white/5">
                                        <h3 className="font-bold text-white text-lg">All Attachments</h3>
                                        <p className="text-zinc-500 text-xs mt-1">Consolidated files from Orders & Notes</p>
                                    </div>
                                    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {allAttachments.map((file, idx) => (
                                            <div key={idx} className="flex items-center gap-4 bg-black/40 p-4 rounded-xl border border-white/5 hover:border-violet-500/30 transition-all group">
                                                <div className={clsx("w-10 h-10 rounded-lg flex items-center justify-center",
                                                    file.type === 'image' ? "bg-purple-500/10 text-purple-400" :
                                                        file.type === 'pdf' ? "bg-red-500/10 text-red-400" :
                                                            "bg-blue-500/10 text-blue-400"
                                                )}>
                                                    {file.type === 'image' ? <ImageIcon className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-medium text-white truncate">{file.name}</h4>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[10px] text-zinc-500">{file.size}</span>
                                                        <span className="text-[10px] text-zinc-600">•</span>
                                                        <span className="text-[10px] text-zinc-500">{format(new Date(file.date), 'MMM dd')}</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <span className={clsx("text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border",
                                                        file.source === 'Order' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                                    )}>
                                                        {file.source}
                                                    </span>
                                                    <button className="text-zinc-500 hover:text-white transition-colors">
                                                        <Download className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {allAttachments.length === 0 && (
                                            <div className="col-span-full py-12 text-center text-zinc-500 text-sm">
                                                <File className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                                No attachments found in history.
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            </div>
                        )}

                        {activeTab === 'vault' && (
                            <Card noPadding className="overflow-hidden border-white/10 bg-zinc-900/20">
                                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                                            <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white text-sm">Encrypted Vault</h3>
                                            <p className="text-xs text-zinc-500">Zero-knowledge storage</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsAddingCredential(true)}
                                        className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest bg-zinc-800 text-white px-3 py-2 rounded-lg hover:bg-zinc-700 border border-zinc-700 transition-all"
                                    >
                                        <Plus className="w-3 h-3" /> Entry
                                    </button>
                                </div>

                                <AnimatePresence>
                                    {isAddingCredential && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden bg-black/40 border-b border-white/5"
                                        >
                                            <form onSubmit={handleSaveCredential} className="p-6 space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <input
                                                        placeholder="Service Name (e.g. AWS)"
                                                        className="bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-violet-500/50 outline-none"
                                                        value={newCred.service}
                                                        onChange={e => setNewCred({ ...newCred, service: e.target.value })}
                                                        required
                                                    />
                                                    <input
                                                        placeholder="Username"
                                                        className="bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-violet-500/50 outline-none"
                                                        value={newCred.username}
                                                        onChange={e => setNewCred({ ...newCred, username: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <input
                                                    type="password"
                                                    placeholder="Password / Key"
                                                    className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-violet-500/50 outline-none"
                                                    value={newCred.password}
                                                    onChange={e => setNewCred({ ...newCred, password: e.target.value })}
                                                    required
                                                />
                                                <div className="flex justify-end gap-2">
                                                    <button type="button" onClick={() => setIsAddingCredential(false)} className="text-xs text-zinc-400 hover:text-white px-3 py-2">Cancel</button>
                                                    <button type="submit" className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-lg font-bold flex items-center gap-2">
                                                        <Save className="w-3 h-3" /> Save Securely
                                                    </button>
                                                </div>
                                            </form>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="divide-y divide-white/5">
                                    {credentials.map(cred => (
                                        <div key={cred.id} className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
                                            <div>
                                                <h4 className="font-medium text-zinc-200 text-sm">{cred.service}</h4>
                                                <p className="text-xs text-zinc-500 font-mono mt-1">user: {cred.username}</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2 bg-black/50 px-3 py-2 rounded-lg border border-white/10 group-hover:border-violet-500/30 transition-colors">
                                                    <span className="font-mono text-xs text-zinc-400 min-w-[100px] tracking-wider blur-[2px] hover:blur-none transition-all cursor-pointer">
                                                        {showPassword[cred.id] ? cred.passwordEncrypted : '••••••••••••'}
                                                    </span>
                                                    <button onClick={() => togglePassword(cred.id)} className="text-zinc-600 hover:text-white transition-colors">
                                                        {showPassword[cred.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {credentials.length === 0 && !isAddingCredential && (
                                        <div className="p-8 text-center text-zinc-600 text-sm">
                                            <ShieldCheck className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                            No credentials stored.
                                        </div>
                                    )}
                                </div>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar Info - Hidden on mobile, pushed to bottom or managed differently if needed. For now stack on mobile via grid */}
                    <div className="space-y-6">
                        <div className="sticky top-6">
                            <Card className="bg-gradient-to-br from-violet-900/20 to-black border-violet-500/20">
                                <h3 className="font-bold text-white mb-6 text-xs uppercase tracking-widest text-violet-400">Quick Actions</h3>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => { setActiveTab('quotes'); setIsCreatingQuote(true); }}
                                        className="w-full text-left p-4 rounded-xl text-sm font-semibold text-white bg-white/5 hover:bg-violet-600 hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] border border-white/10 transition-all flex items-center justify-between group"
                                    >
                                        Generate Proposal
                                        <Wand2 className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                                    </button>
                                    <button
                                        onClick={() => setIsOrderModalOpen(true)}
                                        className="w-full text-left p-4 rounded-xl text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 border border-white/5 hover:border-white/20 transition-all flex items-center justify-between group"
                                    >
                                        New Order
                                        <Plus className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                                    </button>
                                    <button
                                        onClick={() => setIsInvoiceModalOpen(true)}
                                        className="w-full text-left p-4 rounded-xl text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 border border-white/5 hover:border-white/20 transition-all flex items-center justify-between group"
                                    >
                                        Invoice Client
                                        <FileCheck className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                                    </button>
                                </div>
                            </Card>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Quick Order Modal */}
            <AnimatePresence>
                {isOrderModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOrderModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                        >
                            <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                <h2 className="text-lg font-bold text-white">Quick Order</h2>
                                <button onClick={() => setIsOrderModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleQuickOrderSubmit} className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Service Name</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                        <input
                                            required
                                            placeholder="e.g. Urgent Bug Fix"
                                            value={quickOrderForm.serviceName}
                                            onChange={e => setQuickOrderForm({ ...quickOrderForm, serviceName: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-3 py-2 text-white focus:border-violet-500/50 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Amount</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                            <input
                                                type="number"
                                                required
                                                placeholder="0.00"
                                                value={quickOrderForm.amount}
                                                onChange={e => setQuickOrderForm({ ...quickOrderForm, amount: e.target.value })}
                                                className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-3 py-2 text-white focus:border-violet-500/50 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Billing</label>
                                        <select
                                            value={quickOrderForm.billingFreq}
                                            onChange={(e) => setQuickOrderForm({ ...quickOrderForm, billingFreq: e.target.value })}
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
                                            value={quickOrderForm.dueDate}
                                            onChange={e => setQuickOrderForm({ ...quickOrderForm, dueDate: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-3 py-2 text-white focus:border-violet-500/50 outline-none transition-all [color-scheme:dark]"
                                        />
                                    </div>
                                </div>
                                <div className="pt-4 flex gap-3">
                                    <button type="button" onClick={() => setIsOrderModalOpen(false)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 font-medium transition-colors">Cancel</button>
                                    <button type="submit" className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold shadow-lg shadow-violet-600/20 transition-all">Create Order</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Invoice Modal */}
            <AnimatePresence>
                {isInvoiceModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsInvoiceModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                        >
                            <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                <h2 className="text-lg font-bold text-white">Send Invoice</h2>
                                <button onClick={() => setIsInvoiceModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleInvoiceSubmit} className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Description</label>
                                    <input
                                        required
                                        placeholder="e.g. Q4 Consultation Fees"
                                        value={invoiceForm.description}
                                        onChange={e => setInvoiceForm({ ...invoiceForm, description: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-violet-500/50 outline-none transition-all"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Amount</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                            <input
                                                type="number"
                                                required
                                                placeholder="0.00"
                                                value={invoiceForm.amount}
                                                onChange={e => setInvoiceForm({ ...invoiceForm, amount: e.target.value })}
                                                className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-3 py-2 text-white focus:border-violet-500/50 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Due Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                            <input
                                                type="date"
                                                required
                                                value={invoiceForm.dueDate}
                                                onChange={e => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
                                                className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-3 py-2 text-white focus:border-violet-500/50 outline-none transition-all [color-scheme:dark]"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-4 flex gap-3">
                                    <button type="button" onClick={() => setIsInvoiceModalOpen(false)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 font-medium transition-colors">Cancel</button>
                                    <button type="submit" className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/20 transition-all">Send Invoice</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Detailed Order View Modal */}
            <AnimatePresence>
                {selectedOrder && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedOrder(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-zinc-900 z-10">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-lg font-bold text-white">{selectedOrder.serviceName}</h2>
                                        <span className="bg-white/5 px-2 py-0.5 rounded text-xs font-mono text-zinc-400">{selectedOrder.id}</span>
                                    </div>
                                    <p className="text-zinc-500 text-xs mt-1">Created on {format(new Date(selectedOrder.createdAt), 'MMM dd, yyyy')}</p>
                                </div>
                                <button onClick={() => setSelectedOrder(null)} className="text-zinc-500 hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                                {/* Status & Amount */}
                                <div className="flex justify-between items-center bg-black/40 p-4 rounded-xl border border-white/5">
                                    <div>
                                        <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Status</p>
                                        <span className={clsx(
                                            "px-2 py-1 rounded text-xs font-bold uppercase tracking-wide border",
                                            selectedOrder.status === 'active' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                                selectedOrder.status === 'completed' ? "bg-zinc-700/20 text-zinc-400 border-zinc-700/30" :
                                                    selectedOrder.status === 'pending' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                                                        "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                        )}>
                                            {selectedOrder.status}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Total Amount</p>
                                        <p className="text-2xl font-bold text-white tracking-tight">{formatCurrency(selectedOrder.amount)}</p>
                                    </div>
                                </div>

                                {/* Description / Notes */}
                                <div>
                                    <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-violet-400" /> Description & Notes
                                    </h3>
                                    <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                                        <p className="text-sm text-zinc-300 leading-relaxed">
                                            {selectedOrder.description || "No description provided for this order."}
                                        </p>
                                    </div>
                                </div>

                                {/* Attachments */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                            <Paperclip className="w-4 h-4 text-blue-400" /> Attachments
                                        </h3>
                                        <button className="text-xs text-violet-400 hover:text-white flex items-center gap-1">
                                            <Plus className="w-3 h-3" /> Add
                                        </button>
                                    </div>

                                    {selectedOrder.attachments && selectedOrder.attachments.length > 0 ? (
                                        <div className="grid grid-cols-2 gap-3">
                                            {selectedOrder.attachments.map((file, idx) => (
                                                <div key={idx} className="flex items-center gap-3 bg-black/40 p-3 rounded-lg border border-white/5 hover:border-violet-500/30 transition-colors group cursor-pointer">
                                                    <div className="p-2 bg-white/5 rounded-md text-zinc-400">
                                                        {file.type === 'image' ? <ImageIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-medium text-white truncate">{file.name}</p>
                                                        <p className="text-[10px] text-zinc-500">{file.size}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-6 bg-zinc-900/30 rounded-xl border border-dashed border-zinc-800">
                                            <p className="text-xs text-zinc-500">No files attached to this order.</p>
                                        </div>
                                    )}
                                </div>

                                {/* Timeline / Stats */}
                                <div>
                                    <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-orange-400" /> Timeline
                                    </h3>
                                    <div className="relative pl-4 space-y-6 border-l border-white/10 ml-2">
                                        <div className="relative">
                                            <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                            <p className="text-xs text-zinc-500 mb-0.5">{format(new Date(selectedOrder.createdAt), 'MMM dd, yyyy')}</p>
                                            <p className="text-sm text-white font-medium">Order Created</p>
                                        </div>
                                        <div className="relative">
                                            <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-zinc-700 border border-zinc-600"></div>
                                            <p className="text-xs text-zinc-500 mb-0.5">{format(new Date(selectedOrder.dueDate), 'MMM dd, yyyy')}</p>
                                            <p className="text-sm text-zinc-400">Due Date</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 border-t border-white/5 bg-black/20 flex gap-3">
                                <button className="flex-1 py-2.5 rounded-xl border border-white/10 text-zinc-300 hover:text-white hover:bg-white/5 font-medium transition-colors text-sm flex items-center justify-center gap-2">
                                    <Download className="w-4 h-4" /> Invoice PDF
                                </button>
                                <button className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold shadow-lg shadow-violet-600/20 transition-all text-sm">
                                    Mark Complete
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </PageTransition>
    );
};