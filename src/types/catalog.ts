export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ServiceItem {
  id: string;
  technicianProfileId: string;
  categoryId: string;
  title: string;
  description: string;
  price: string | number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  category?: {
    id: string;
    name: string;
  };
  technicianProfile?: {
    id: string;
    bio?: string;
    location?: string;
    avgRating?: string | number;
    totalReviews?: number;
    user?: {
      id: string;
      name: string;
    };
  };
}

export interface TechnicianSummary {
  id: string;
  bio?: string;
  skills?: string[];
  experienceYears?: number;
  hourlyRate?: string | number;
  avgRating?: string | number;
  totalReviews?: number;
  location?: string;
  createdAt?: string;
  user?: {
    id: string;
    name: string;
  };
}

export interface ReviewItem {
  id: string;
  rating: number | string;
  comment: string;
  createdAt: string;
  customerName?: string;
  customer?: {
    name: string;
  };
}

export interface TechnicianDetail extends TechnicianSummary {
  userId?: string;
  updatedAt?: string;
  services?: ServiceItem[];
  reviews?: ReviewItem[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ServicesFilter {
  categoryId?: string;
  search?: string;
  minPrice?: string | number;
  maxPrice?: string | number;
  location?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'newest';
  page?: number;
  limit?: number;
}

export interface TechniciansFilter {
  search?: string;
  location?: string;
  minRating?: string | number;
  skills?: string;
  page?: number;
  limit?: number;
}
