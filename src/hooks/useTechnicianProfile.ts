import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TechnicianProfile, UpsertProfileInput } from '@/types/technician';

export function useMyProfile() {
  return useQuery({
    queryKey: ['technicianProfile'],
    queryFn: async (): Promise<TechnicianProfile | null> => {
      const res = await fetch('/api/technician/profile', { cache: 'no-store' });
      const json = await res.json();
      if (res.status === 404) {
        return null;
      }
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to fetch technician profile');
      }
      return json.data || null;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpsertProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpsertProfileInput): Promise<TechnicianProfile> => {
      const res = await fetch('/api/technician/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to save technician profile');
      }

      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technicianProfile'] });
    },
  });
}
