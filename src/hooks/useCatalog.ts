import { useQuery } from '@tanstack/react-query';
import {
  Category,
  ServiceItem,
  TechnicianSummary,
  TechnicianDetail,
  PaginatedResponse,
  ServicesFilter,
  TechniciansFilter,
} from '@/types/catalog';

function buildQueryString(params: Record<string, any>): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      query.append(key, String(val));
    }
  });
  const str = query.toString();
  return str ? `?${str}` : '';
}

export function useServices(filters: ServicesFilter = {}) {
  const queryString = buildQueryString(filters);

  return useQuery({
    queryKey: ['services', filters],
    queryFn: async (): Promise<PaginatedResponse<ServiceItem>> => {
      const res = await fetch(`/api/services${queryString}`);
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to fetch services');
      }
      return json.data || { items: [], total: 0, page: 1, totalPages: 1 };
    },
    staleTime: 1000 * 60 * 2,
  });
}

export function useTechnicians(filters: TechniciansFilter = {}) {
  const queryString = buildQueryString(filters);

  return useQuery({
    queryKey: ['technicians', filters],
    queryFn: async (): Promise<PaginatedResponse<TechnicianSummary>> => {
      const res = await fetch(`/api/technicians${queryString}`);
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to fetch technicians');
      }
      return json.data || { items: [], total: 0, page: 1, totalPages: 1 };
    },
    staleTime: 1000 * 60 * 2,
  });
}

export function useTechnician(id: string) {
  return useQuery({
    queryKey: ['technician', id],
    queryFn: async (): Promise<TechnicianDetail> => {
      const res = await fetch(`/api/technicians/${id}`);
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Technician not found');
      }
      return json.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async (): Promise<Category[]> => {
      const res = await fetch('/api/categories');
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to fetch categories');
      }
      return Array.isArray(json.data) ? json.data : [];
    },
    staleTime: 1000 * 60 * 10,
  });
}
