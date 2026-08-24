import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  AdminUser,
  AdminUsersQuery,
  AdminBooking,
  AdminPayment,
  PaginatedResult,
  CreateCategoryInput,
} from '@/types/admin';
import { Category } from '@/types/catalog';

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

export function useAdminUsers(filters: AdminUsersQuery = {}) {
  const queryString = buildQueryString(filters);

  return useQuery({
    queryKey: ['adminUsers', filters],
    queryFn: async (): Promise<PaginatedResult<AdminUser>> => {
      const res = await fetch(`/api/admin/users${queryString}`, { cache: 'no-store' });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to fetch admin users');
      }
      const data = json.data || {};
      const items = data.items || data.results || data.data || [];
      return {
        items,
        total: data.total || items.length,
        page: data.page || 1,
        limit: data.limit || 10,
        totalPages: data.totalPages || Math.ceil((data.total || items.length) / (data.limit || 10)),
      };
    },
    staleTime: 1000 * 30,
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'ACTIVE' | 'BANNED' }): Promise<AdminUser> => {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to update user status');
      }

      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
  });
}

export function useAdminCategories() {
  return useQuery({
    queryKey: ['adminCategories'],
    queryFn: async (): Promise<Category[]> => {
      const res = await fetch('/api/admin/categories', { cache: 'no-store' });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to fetch categories');
      }
      return Array.isArray(json.data) ? json.data : [];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateCategoryInput): Promise<Category> => {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to create category');
      }

      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCategories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useAdminBookings(filters: { status?: string; page?: number; limit?: number } = {}) {
  const queryString = buildQueryString(filters);

  return useQuery({
    queryKey: ['adminBookings', filters],
    queryFn: async (): Promise<PaginatedResult<AdminBooking>> => {
      const res = await fetch(`/api/admin/bookings${queryString}`, { cache: 'no-store' });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to fetch platform bookings');
      }
      const data = json.data || {};
      const items = data.items || data.results || data.data || [];
      return {
        items,
        total: data.total || items.length,
        page: data.page || 1,
        limit: data.limit || 10,
        totalPages: data.totalPages || Math.ceil((data.total || items.length) / (data.limit || 10)),
      };
    },
    staleTime: 1000 * 30,
  });
}

export function useAdminPayments(filters: { status?: string; page?: number; limit?: number } = {}) {
  const queryString = buildQueryString(filters);

  return useQuery({
    queryKey: ['adminPayments', filters],
    queryFn: async (): Promise<PaginatedResult<AdminPayment>> => {
      const res = await fetch(`/api/admin/payments${queryString}`, { cache: 'no-store' });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to fetch platform payments');
      }
      const data = json.data || {};
      const items = data.items || data.results || data.data || [];
      return {
        items,
        total: data.total || items.length,
        page: data.page || 1,
        limit: data.limit || 10,
        totalPages: data.totalPages || Math.ceil((data.total || items.length) / (data.limit || 10)),
      };
    },
    staleTime: 1000 * 30,
  });
}
