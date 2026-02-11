export type Status = 'active' | 'completed' | 'cancelled' | 'pending' | 'expired';

export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  avatar: string;
  phone: string;
  address: string;
  plusCode: string;
  joinedAt: string;
}

export interface Attachment {
  name: string;
  type: 'image' | 'pdf' | 'doc' | 'other';
  url: string;
  size: string;
}

export interface Order {
  id: string;
  clientId: string;
  serviceName: string;
  status: Status;
  amount: number;
  dueDate: string;
  createdAt: string;
  billingFreq: 'one-time' | 'monthly' | 'yearly';
  attachments?: Attachment[];
  description?: string;
}

export interface Quote {
  id: string;
  clientId: string | null;
  clientName?: string;
  title: string;
  totalAmount: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  validUntil: string;
  items: QuoteItem[];
}

export interface QuoteItem {
  description: string;
  price: number;
  quantity: number;
}

export interface Note {
  id: string;
  clientId: string;
  content: string;
  createdAt: string;
  attachments?: Attachment[];
  isDeleted?: boolean;
}

export interface Credential {
  id: string;
  clientId: string;
  service: string;
  username: string;
  passwordEncrypted: string; // In a real app, this would be encrypted
}

export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  clientId?: string;
  createdAt: string;
}