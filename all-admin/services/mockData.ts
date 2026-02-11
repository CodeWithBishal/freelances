import { Client, Order, Quote, Note, Credential, Todo } from '../types';

// Generators for mock data
export const mockClients: Client[] = [
  {
    id: 'c1',
    name: 'Alice Freeman',
    company: 'TechNova',
    email: 'alice@technova.com',
    phone: '+91 98765 43210',
    address: '123 Innovation Dr, Bangalore, KA',
    avatar: 'https://picsum.photos/200/200?random=1',
    joinedAt: '2023-01-15',
  },
  {
    id: 'c2',
    name: 'Bob Smith',
    company: 'Designify',
    email: 'bob@designify.studio',
    phone: '+91 98989 89898',
    address: '456 Creative Ln, Mumbai, MH',
    avatar: 'https://picsum.photos/200/200?random=2',
    joinedAt: '2023-03-10',
  },
  {
    id: 'c3',
    name: 'Charlie Davis',
    company: 'Logistics Co.',
    email: 'charlie@logisticsco.com',
    phone: '+91 91234 56789',
    address: '789 Shipping Blvd, Delhi, DL',
    avatar: 'https://picsum.photos/200/200?random=3',
    joinedAt: '2023-06-20',
  },
];

export const mockOrders: Order[] = [
  {
    id: 'ORD-1001',
    clientId: 'c1',
    serviceName: 'Web Development Retainer',
    status: 'active',
    amount: 120000,
    dueDate: '2023-11-01',
    createdAt: '2023-01-15',
    billingFreq: 'monthly',
    description: 'Ongoing maintenance and feature updates for the main corporate website.',
    attachments: [
        { name: 'SLA_Agreement_2023.pdf', type: 'pdf', url: '#', size: '2.4 MB' },
        { name: 'Architecture_Diagram.png', type: 'image', url: '#', size: '1.1 MB' }
    ]
  },
  {
    id: 'ORD-1002',
    clientId: 'c1',
    serviceName: 'SEO Optimization',
    status: 'completed',
    amount: 40000,
    dueDate: '2023-02-15',
    createdAt: '2023-01-20',
    billingFreq: 'one-time',
    attachments: [
        { name: 'Keyword_Analysis.xlsx', type: 'doc', url: '#', size: '500 KB' }
    ]
  },
  {
    id: 'ORD-1003',
    clientId: 'c2',
    serviceName: 'Brand Identity Design',
    status: 'active',
    amount: 250000,
    dueDate: '2023-10-30',
    createdAt: '2023-09-01',
    billingFreq: 'one-time',
    description: 'Complete rebranding including logo, color palette, and brand guidelines.',
  },
  {
    id: 'ORD-1004',
    clientId: 'c3',
    serviceName: 'Server Maintenance',
    status: 'expired',
    amount: 15000,
    dueDate: '2023-09-15',
    createdAt: '2023-06-20',
    billingFreq: 'monthly',
  },
];

export const mockQuotes: Quote[] = [
  {
    id: 'Q-201',
    clientId: 'c2',
    clientName: 'Designify',
    title: 'Website Redesign',
    totalAmount: 350000,
    status: 'sent',
    validUntil: '2023-11-15',
    items: [
      { description: 'Homepage Design', price: 100000, quantity: 1 },
      { description: 'Implementation', price: 250000, quantity: 1 },
    ],
  },
  {
    id: 'Q-202',
    clientId: 'c1',
    clientName: 'TechNova',
    title: 'Mobile App MVP',
    totalAmount: 900000,
    status: 'draft',
    validUntil: '2023-12-01',
    items: [
      { description: 'MVP Development', price: 900000, quantity: 1 },
    ],
  },
];

export const mockNotes: Note[] = [
  {
    id: 'n1',
    clientId: 'c1',
    content: 'Client requested a new feature for the dashboard. Need to scope it out.',
    createdAt: '2023-10-05T10:30:00Z',
    attachments: [
        { name: 'Feature_Request_Email.pdf', type: 'pdf', url: '#', size: '150 KB' }
    ]
  },
  {
    id: 'n2',
    clientId: 'c1',
    content: 'Meeting scheduled for next Tuesday to discuss renewal.',
    createdAt: '2023-10-01T14:00:00Z',
  },
  {
    id: 'n3',
    clientId: 'c2',
    content: 'Sent the initial drafts. Waiting for feedback.',
    createdAt: '2023-09-28T09:15:00Z',
    attachments: [
        { name: 'Draft_v1.png', type: 'image', url: '#', size: '3.5 MB' }
    ]
  },
];

export const mockCredentials: Credential[] = [
  {
    id: 'cr1',
    clientId: 'c1',
    service: 'WordPress Admin',
    username: 'admin',
    passwordEncrypted: 'Sup3rS3cr3t!',
  },
  {
    id: 'cr2',
    clientId: 'c1',
    service: 'FTP Access',
    username: 'technova_ftp',
    passwordEncrypted: 'ftp_pass_123',
  },
];

export const mockTodos: Todo[] = [
  {
    id: 't1',
    title: 'Finalize Home Page Design',
    description: 'Review the latest Figma drafts from Bob and provide feedback.',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2023-11-05',
    clientId: 'c2',
    createdAt: '2023-10-25T09:00:00Z'
  },
  {
    id: 't2',
    title: 'Prepare Monthly Report for TechNova',
    description: 'Compile SEO stats and dev hours for the monthly retainer report.',
    status: 'todo',
    priority: 'medium',
    dueDate: '2023-11-01',
    clientId: 'c1',
    createdAt: '2023-10-26T10:00:00Z'
  },
  {
    id: 't3',
    title: 'Update Server Security Patches',
    status: 'todo',
    priority: 'high',
    clientId: 'c3',
    createdAt: '2023-10-27T08:00:00Z'
  },
  {
    id: 't4',
    title: 'Invoice Logistics Co.',
    status: 'done',
    priority: 'low',
    dueDate: '2023-10-20',
    clientId: 'c3',
    createdAt: '2023-10-15T11:00:00Z'
  },
  {
    id: 't5',
    title: 'Research New React Features',
    status: 'todo',
    priority: 'low',
    createdAt: '2023-10-28T14:00:00Z'
  }
];

// Helper to simulate API delay
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));