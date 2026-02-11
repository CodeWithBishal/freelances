import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Calendar, Filter, Edit2, Save, Trash2, ArrowRight, ArrowLeft, X, Circle } from 'lucide-react';
import { fetchTodos, fetchClients, createTodo, updateTodo, deleteTodo } from '../services/database';
import { Todo, TaskStatus, TaskPriority, Client } from '../types';
import { PageTransition } from '../components/PageTransition';
import { format, isPast, isToday, isTomorrow } from 'date-fns';
import { clsx } from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

const columns: { id: TaskStatus; label: string; color: string; dot: string }[] = [
    { id: 'todo', label: 'To Do', color: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20', dot: 'bg-zinc-500' },
    { id: 'in-progress', label: 'In Progress', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', dot: 'bg-blue-500' },
    { id: 'done', label: 'Done', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', dot: 'bg-emerald-500' }
];

export const Todos = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Task Form State
    const [taskForm, setTaskForm] = useState<{
        title: string;
        description: string;
        priority: TaskPriority;
        status: TaskStatus;
        clientId: string;
        dueDate: string;
    }>({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
        clientId: '',
        dueDate: ''
    });

    useEffect(() => {
        Promise.all([fetchTodos(), fetchClients()])
            .then(([todosData, clientsData]) => {
                setTodos(todosData);
                setClients(clientsData);
            })
            .catch(err => console.error('Failed to fetch data:', err))
            .finally(() => setLoading(false));
    }, []);

    const openCreateModal = () => {
        setEditingId(null);
        setTaskForm({ title: '', description: '', priority: 'medium', status: 'todo', clientId: '', dueDate: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (task: Todo) => {
        setEditingId(task.id);
        setTaskForm({
            title: task.title,
            description: task.description || '',
            priority: task.priority,
            status: task.status,
            clientId: task.clientId || '',
            dueDate: task.dueDate || ''
        });
        setIsModalOpen(true);
    };

    const handleSaveTask = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingId) {
                // Update existing
                await updateTodo(editingId, {
                    title: taskForm.title,
                    description: taskForm.description,
                    priority: taskForm.priority,
                    status: taskForm.status,
                    clientId: taskForm.clientId || undefined,
                    dueDate: taskForm.dueDate || undefined,
                });
                setTodos(todos.map(t => t.id === editingId ? {
                    ...t,
                    title: taskForm.title,
                    description: taskForm.description,
                    priority: taskForm.priority,
                    status: taskForm.status,
                    clientId: taskForm.clientId || undefined,
                    dueDate: taskForm.dueDate || undefined,
                } : t));
            } else {
                // Create new
                const created = await createTodo({
                    title: taskForm.title,
                    description: taskForm.description,
                    priority: taskForm.priority,
                    status: taskForm.status,
                    clientId: taskForm.clientId || undefined,
                    dueDate: taskForm.dueDate || undefined,
                });
                setTodos([created, ...todos]);
            }
            setIsModalOpen(false);
        } catch (err) {
            console.error('Failed to save task:', err);
            alert('Failed to save task. Please try again.');
        }
    };

    const handleDeleteTask = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await deleteTodo(id);
                setTodos(todos.filter(t => t.id !== id));
            } catch (err) {
                console.error('Failed to delete task:', err);
                alert('Failed to delete task.');
            }
        }
    };

    const handleMoveTask = async (id: string, direction: 'next' | 'prev', currentStatus: TaskStatus, e: React.MouseEvent) => {
        e.stopPropagation();
        const flow: TaskStatus[] = ['todo', 'in-progress', 'done'];
        const currentIndex = flow.indexOf(currentStatus);
        let nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

        // Bounds check
        if (nextIndex < 0) nextIndex = 0;
        if (nextIndex >= flow.length) nextIndex = flow.length - 1;

        const nextStatus = flow[nextIndex];
        if (nextStatus !== currentStatus) {
            try {
                await updateTodo(id, { status: nextStatus });
                setTodos(todos.map(t => t.id === id ? { ...t, status: nextStatus } : t));
            } catch (err) {
                console.error('Failed to move task:', err);
            }
        }
    };

    const getPriorityColor = (p: TaskPriority) => {
        switch (p) {
            case 'high': return 'text-red-400 bg-red-400/10 border-red-400/20';
            case 'medium': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
            case 'low': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
        }
    };

    const getDateLabel = (dateStr?: string) => {
        if (!dateStr) return null;
        const date = new Date(dateStr);
        if (isToday(date)) return <span className="text-amber-400 font-bold">Today</span>;
        if (isTomorrow(date)) return <span className="text-blue-400">Tomorrow</span>;
        if (isPast(date)) return <span className="text-red-400 font-bold">Overdue</span>;
        return <span className="text-zinc-400">{format(date, 'MMM dd')}</span>;
    };

    const filteredTodos = useMemo(() => {
        return todos.filter(t => {
            const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (t.description?.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
            return matchesSearch && matchesPriority;
        });
    }, [todos, searchTerm, priorityFilter]);

    return (
        <PageTransition className="space-y-8 h-[calc(100vh-100px)] flex flex-col">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6 flex-shrink-0">
                <div>
                    <h1 className="text-4xl font-bold text-white tracking-tight">Tasks</h1>
                    <p className="text-zinc-400 mt-2 font-light">Manage your daily priorities and workflow</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
                    {/* Filter Group */}
                    <div className="flex items-center gap-2 bg-zinc-900 border border-white/10 rounded-xl px-3 py-2.5">
                        <Filter className="w-4 h-4 text-zinc-500" />
                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value as any)}
                            className="bg-transparent text-sm text-white focus:outline-none border-none p-0 cursor-pointer"
                        >
                            <option value="all">All Priorities</option>
                            <option value="high">High Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="low">Low Priority</option>
                        </select>
                    </div>

                    {/* Search */}
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                            placeholder="Search tasks..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:ring-1 focus:ring-violet-500/50 outline-none"
                        />
                    </div>

                    {/* Add Button */}
                    <button
                        onClick={openCreateModal}
                        className="flex items-center justify-center gap-2 bg-white text-black px-5 py-2.5 rounded-xl hover:bg-zinc-200 transition-all font-bold text-sm whitespace-nowrap shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                    >
                        <Plus className="w-4 h-4" />
                        <span>New Task</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto pb-4">
                <div className="flex gap-6 min-w-[1000px] h-full">
                    {columns.map(col => (
                        <div key={col.id} className="flex-1 flex flex-col gap-4 min-w-[320px]">
                            {/* Column Header */}
                            <div className={clsx("flex items-center justify-between p-3 rounded-xl border backdrop-blur-sm", col.color)}>
                                <div className="flex items-center gap-3">
                                    <span className={clsx("w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]", col.dot)}></span>
                                    <h3 className="font-bold text-sm uppercase tracking-wider">{col.label}</h3>
                                </div>
                                <span className="bg-black/20 text-current text-xs font-mono font-bold px-2 py-0.5 rounded-md">
                                    {filteredTodos.filter(t => t.status === col.id).length}
                                </span>
                            </div>

                            {/* Column Body */}
                            <div className="flex-1 bg-zinc-900/20 border border-white/5 rounded-2xl p-3 overflow-y-auto space-y-3 custom-scrollbar">
                                <AnimatePresence mode="popLayout">
                                    {filteredTodos.filter(t => t.status === col.id).map(task => {
                                        const client = clients.find(c => c.id === task.clientId);
                                        return (
                                            <motion.div
                                                key={task.id}
                                                layout
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                onClick={() => openEditModal(task)}
                                                className="group relative bg-zinc-900 border border-white/5 hover:border-violet-500/30 p-4 rounded-xl shadow-sm hover:shadow-xl transition-all cursor-pointer overflow-hidden"
                                            >
                                                {/* Left Accent Bar */}
                                                <div className={clsx("absolute left-0 top-0 bottom-0 w-1",
                                                    task.priority === 'high' ? 'bg-red-500' :
                                                        task.priority === 'medium' ? 'bg-orange-500' : 'bg-blue-500'
                                                )}></div>

                                                <div className="pl-2">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className={clsx("text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border", getPriorityColor(task.priority))}>
                                                            {task.priority}
                                                        </span>
                                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button onClick={(e) => handleDeleteTask(task.id, e)} className="p-1.5 hover:bg-red-500/10 rounded-lg text-zinc-500 hover:text-red-400 transition-colors">
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <h4 className="text-white font-semibold text-sm leading-snug mb-1.5 pr-2">{task.title}</h4>

                                                    {task.description && (
                                                        <p className="text-zinc-500 text-xs line-clamp-2 mb-4 leading-relaxed font-light">{task.description}</p>
                                                    )}

                                                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                                                        <div className="flex items-center gap-3">
                                                            {client && (
                                                                <div className="flex items-center gap-1.5" title={client.name}>
                                                                    <img src={client.avatar} alt="" className="w-5 h-5 rounded-full ring-1 ring-white/10" />
                                                                    <span className="text-[10px] text-zinc-400 truncate max-w-[80px]">{client.company}</span>
                                                                </div>
                                                            )}
                                                            {task.dueDate && (
                                                                <div className="flex items-center gap-1.5 text-[10px]">
                                                                    <Calendar className="w-3 h-3 text-zinc-600" />
                                                                    {getDateLabel(task.dueDate)}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Directional Buttons (Overlay on hover) */}
                                                <div className="absolute bottom-3 right-3 flex gap-1">
                                                    {task.status !== 'todo' && (
                                                        <button
                                                            onClick={(e) => handleMoveTask(task.id, 'prev', task.status, e)}
                                                            className="p-1.5 bg-black/50 hover:bg-white text-white hover:text-black rounded-lg border border-white/10 transition-colors backdrop-blur-sm opacity-0 group-hover:opacity-100"
                                                            title="Move Back"
                                                        >
                                                            <ArrowLeft className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}
                                                    {task.status !== 'done' && (
                                                        <button
                                                            onClick={(e) => handleMoveTask(task.id, 'next', task.status, e)}
                                                            className="p-1.5 bg-black/50 hover:bg-white text-white hover:text-black rounded-lg border border-white/10 transition-colors backdrop-blur-sm opacity-0 group-hover:opacity-100"
                                                            title="Move Forward"
                                                        >
                                                            <ArrowRight className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                    {filteredTodos.filter(t => t.status === col.id).length === 0 && (
                                        <div className="h-32 flex flex-col items-center justify-center text-zinc-600 text-xs border-2 border-dashed border-white/5 rounded-xl bg-white/[0.01]">
                                            <Circle className="w-6 h-6 mb-2 opacity-20" />
                                            <span>No tasks in {col.label}</span>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Create/Edit Task Modal */}
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
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    {editingId ? <Edit2 className="w-5 h-5 text-violet-500" /> : <Plus className="w-5 h-5 text-violet-500" />}
                                    {editingId ? 'Edit Task' : 'New Task'}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleSaveTask} className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Title</label>
                                    <input
                                        required
                                        value={taskForm.title}
                                        onChange={e => setTaskForm({ ...taskForm, title: e.target.value })}
                                        placeholder="What needs to be done?"
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-violet-500/50 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Description</label>
                                    <textarea
                                        value={taskForm.description}
                                        onChange={e => setTaskForm({ ...taskForm, description: e.target.value })}
                                        placeholder="Details..."
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-violet-500/50 outline-none transition-all resize-none h-24"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Priority</label>
                                        <select
                                            value={taskForm.priority}
                                            onChange={(e: any) => setTaskForm({ ...taskForm, priority: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-violet-500/50 outline-none transition-all"
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Due Date</label>
                                        <input
                                            type="date"
                                            value={taskForm.dueDate}
                                            onChange={e => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-violet-500/50 outline-none transition-all [color-scheme:dark]"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Status</label>
                                        <select
                                            value={taskForm.status}
                                            onChange={(e: any) => setTaskForm({ ...taskForm, status: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-violet-500/50 outline-none transition-all"
                                        >
                                            <option value="todo">To Do</option>
                                            <option value="in-progress">In Progress</option>
                                            <option value="done">Done</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Client</label>
                                        <select
                                            value={taskForm.clientId}
                                            onChange={(e) => setTaskForm({ ...taskForm, clientId: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-violet-500/50 outline-none transition-all"
                                        >
                                            <option value="">None</option>
                                            {clients.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 font-medium transition-colors">Cancel</button>
                                    <button type="submit" className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold shadow-lg shadow-violet-600/20 transition-all flex items-center justify-center gap-2">
                                        {editingId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                        {editingId ? 'Save Changes' : 'Create Task'}
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