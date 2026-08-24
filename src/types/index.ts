// Shared TypeScript types matching backend response shapes

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errorDetails?: unknown;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'CUSTOMER' | 'TECHNICIAN' | 'ADMIN';
  createdAt?: string;
  updatedAt?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

export interface Technician {
  id: string;
  name: string;
  bio?: string;
  specialization?: string;
  rating?: number;
}
