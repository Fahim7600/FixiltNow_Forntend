export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'CUSTOMER' | 'TECHNICIAN' | 'ADMIN';
  status: 'ACTIVE' | 'BANNED';
  createdAt: string;
  updatedAt?: string;
}

export interface AdminUsersQuery {
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface AdminBooking {
  id: string;
  scheduledDate: string;
  status: string;
  priceAtBooking: string | number;
  notes?: string;
  createdAt: string;
  service?: {
    id: string;
    title: string;
    price: string | number;
  };
  customer?: {
    id: string;
    name: string;
    email: string;
  };
  technician?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface AdminPayment {
  id: string;
  bookingId: string;
  amount: string | number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
  booking?: {
    id: string;
    service?: {
      title: string;
    };
  };
}

export interface PaginatedResult<T> {
  items?: T[];
  results?: T[];
  data?: T[];
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
}
