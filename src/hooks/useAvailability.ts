import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AvailabilityWindow, CreateAvailabilityInput } from '@/types/technician';

export function useMyAvailability() {
  return useQuery({
    queryKey: ['availability'],
    queryFn: async (): Promise<AvailabilityWindow[]> => {
      const res = await fetch('/api/technician/availability', { cache: 'no-store' });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to fetch availability schedule');
      }
      return Array.isArray(json.data) ? json.data : [];
    },
    staleTime: 1000 * 60 * 2,
  });
}

export function useAddAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateAvailabilityInput): Promise<AvailabilityWindow> => {
      const res = await fetch('/api/technician/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to add availability window');
      }

      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability'] });
    },
  });
}

export function useDeleteAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<boolean> => {
      const res = await fetch(`/api/technician/availability/${id}`, {
        method: 'DELETE',
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to delete availability window');
      }

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability'] });
    },
  });
}
