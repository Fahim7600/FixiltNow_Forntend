export interface TechnicianProfile {
  id: string;
  userId: string;
  bio?: string;
  skills: string[];
  experienceYears: number;
  hourlyRate: string | number;
  avgRating?: string | number;
  totalReviews?: number;
  location?: string;
  createdAt?: string;
  updatedAt?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface UpsertProfileInput {
  bio?: string;
  skills?: string[];
  experienceYears?: number;
  hourlyRate: number;
  location?: string;
}

export interface Service {
  id: string;
  technicianProfileId: string;
  categoryId: string;
  title: string;
  description?: string;
  price: string | number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  category?: {
    id: string;
    name: string;
  };
}

export interface CreateServiceInput {
  categoryId: string;
  title: string;
  description?: string;
  price: number;
}

export interface UpdateServiceInput {
  categoryId?: string;
  title?: string;
  description?: string;
  price?: number;
  isActive?: boolean;
}

export interface AvailabilityWindow {
  id: string;
  technicianProfileId: string;
  dayOfWeek: number; // 0=Sunday, 6=Saturday
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAvailabilityInput {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}
