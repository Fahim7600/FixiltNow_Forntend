export type Role = 'CUSTOMER' | 'TECHNICIAN' | 'ADMIN';

export type UserStatus = 'ACTIVE' | 'BANNED' | 'SUSPENDED' | 'PENDING';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  status?: UserStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: 'CUSTOMER' | 'TECHNICIAN';
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponseData {
  token?: string;
  user: User;
}

export interface AuthApiResponse {
  success: boolean;
  message?: string;
  data?: AuthResponseData | User;
  user?: User;
  errorDetails?: unknown;
}
