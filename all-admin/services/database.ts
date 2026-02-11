import { supabase } from './supabaseClient';
import { Client, Order, Quote, Note, Credential, Todo, QuoteItem } from '../types';

// ─── Helpers ──────────────────────────────────────────────

async function getUserId(): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    return user.id;
}

// Convert snake_case DB row → camelCase TS types
function toClient(row: any): Client {
    return {
        id: row.id,
        name: row.name,
        email: row.email,
        company: row.company,
        avatar: row.avatar || '',
        phone: row.phone || '',
        address: row.address || '',
        joinedAt: row.joined_at,
    };
}

function toOrder(row: any): Order {
    return {
        id: row.id,
        clientId: row.client_id,
        serviceName: row.service_name,
        status: row.status,
        amount: Number(row.amount),
        dueDate: row.due_date,
        createdAt: row.created_at,
        billingFreq: row.billing_freq,
        description: row.description || undefined,
    };
}

function toQuote(row: any): Quote {
    return {
        id: row.id,
        clientId: row.client_id,
        clientName: row.client_name || undefined,
        title: row.title,
        totalAmount: Number(row.total_amount),
        status: row.status,
        validUntil: row.valid_until,
        items: (row.items || []) as QuoteItem[],
    };
}

function toNote(row: any): Note {
    return {
        id: row.id,
        clientId: row.client_id,
        content: row.content,
        createdAt: row.created_at,
        isDeleted: row.is_deleted || false,
    };
}

function toCredential(row: any): Credential {
    return {
        id: row.id,
        clientId: row.client_id,
        service: row.service,
        username: row.username,
        passwordEncrypted: row.password_encrypted,
    };
}

function toTodo(row: any): Todo {
    return {
        id: row.id,
        title: row.title,
        description: row.description || undefined,
        status: row.status,
        priority: row.priority,
        dueDate: row.due_date || undefined,
        clientId: row.client_id || undefined,
        createdAt: row.created_at,
    };
}

// ─── CLIENTS ──────────────────────────────────────────────

export async function fetchClients(): Promise<Client[]> {
    const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(toClient);
}

export async function fetchClientById(id: string): Promise<Client | null> {
    const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();
    if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
    }
    return toClient(data);
}

export async function createClient(client: Omit<Client, 'id' | 'joinedAt'>): Promise<Client> {
    const userId = await getUserId();
    const { data, error } = await supabase
        .from('clients')
        .insert({
            user_id: userId,
            name: client.name,
            email: client.email,
            company: client.company,
            avatar: client.avatar,
            phone: client.phone,
            address: client.address,
        })
        .select()
        .single();
    if (error) throw error;
    return toClient(data);
}

// ─── ORDERS ──────────────────────────────────────────────

export async function fetchOrders(): Promise<Order[]> {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(toOrder);
}

export async function fetchOrdersByClient(clientId: string): Promise<Order[]> {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(toOrder);
}

export async function createOrder(order: Omit<Order, 'createdAt'>): Promise<Order> {
    const userId = await getUserId();
    const { data, error } = await supabase
        .from('orders')
        .insert({
            id: order.id,
            user_id: userId,
            client_id: order.clientId,
            service_name: order.serviceName,
            status: order.status,
            amount: order.amount,
            due_date: order.dueDate,
            billing_freq: order.billingFreq,
            description: order.description || '',
        })
        .select()
        .single();
    if (error) throw error;
    return toOrder(data);
}

// ─── QUOTES ──────────────────────────────────────────────

export async function fetchQuotes(): Promise<Quote[]> {
    const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(toQuote);
}

export async function fetchQuotesByClient(clientId: string): Promise<Quote[]> {
    const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(toQuote);
}

export async function createQuote(quote: Omit<Quote, 'id'>): Promise<Quote> {
    const userId = await getUserId();
    const id = `Q-${Math.floor(100 + Math.random() * 900)}`;
    const { data, error } = await supabase
        .from('quotes')
        .insert({
            id,
            user_id: userId,
            client_id: quote.clientId,
            client_name: quote.clientName || '',
            title: quote.title,
            total_amount: quote.totalAmount,
            status: quote.status,
            valid_until: quote.validUntil,
            items: quote.items,
        })
        .select()
        .single();
    if (error) throw error;
    return toQuote(data);
}

// ─── NOTES ──────────────────────────────────────────────

export async function fetchNotesByClient(clientId: string): Promise<Note[]> {
    const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(toNote);
}

export async function createNote(note: { clientId: string; content: string }): Promise<Note> {
    const userId = await getUserId();
    const { data, error } = await supabase
        .from('notes')
        .insert({
            user_id: userId,
            client_id: note.clientId,
            content: note.content,
        })
        .select()
        .single();
    if (error) throw error;
    return toNote(data);
}

export async function updateNoteContent(id: string, content: string): Promise<void> {
    const { error } = await supabase
        .from('notes')
        .update({ content })
        .eq('id', id);
    if (error) throw error;
}

export async function softDeleteNote(id: string): Promise<void> {
    const { error } = await supabase
        .from('notes')
        .update({ is_deleted: true })
        .eq('id', id);
    if (error) throw error;
}

export async function undeleteNote(id: string): Promise<void> {
    const { error } = await supabase
        .from('notes')
        .update({ is_deleted: false })
        .eq('id', id);
    if (error) throw error;
}

// ─── CREDENTIALS ──────────────────────────────────────────

export async function fetchCredentialsByClient(clientId: string): Promise<Credential[]> {
    const { data, error } = await supabase
        .from('credentials')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(toCredential);
}

export async function createCredential(cred: Omit<Credential, 'id'>): Promise<Credential> {
    const userId = await getUserId();
    const { data, error } = await supabase
        .from('credentials')
        .insert({
            user_id: userId,
            client_id: cred.clientId,
            service: cred.service,
            username: cred.username,
            password_encrypted: cred.passwordEncrypted,
        })
        .select()
        .single();
    if (error) throw error;
    return toCredential(data);
}

// ─── TODOS ──────────────────────────────────────────────

export async function fetchTodos(): Promise<Todo[]> {
    const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(toTodo);
}

export async function createTodo(todo: Omit<Todo, 'id' | 'createdAt'>): Promise<Todo> {
    const userId = await getUserId();
    const { data, error } = await supabase
        .from('todos')
        .insert({
            user_id: userId,
            title: todo.title,
            description: todo.description || '',
            status: todo.status,
            priority: todo.priority,
            due_date: todo.dueDate || null,
            client_id: todo.clientId || null,
        })
        .select()
        .single();
    if (error) throw error;
    return toTodo(data);
}

export async function updateTodo(id: string, updates: Partial<Pick<Todo, 'title' | 'description' | 'status' | 'priority' | 'dueDate' | 'clientId'>>): Promise<void> {
    const payload: any = {};
    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.priority !== undefined) payload.priority = updates.priority;
    if (updates.dueDate !== undefined) payload.due_date = updates.dueDate || null;
    if (updates.clientId !== undefined) payload.client_id = updates.clientId || null;

    const { error } = await supabase
        .from('todos')
        .update(payload)
        .eq('id', id);
    if (error) throw error;
}

export async function deleteTodo(id: string): Promise<void> {
    const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);
    if (error) throw error;
}
