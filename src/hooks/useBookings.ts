import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Booking,
  CreateBookingInput,
  UpdateBookingStatusInput,
} from '@/types/booking';

export function useMyBookings() {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: async (): Promise<Booking[]> => {
      const res = await fetch('/api/bookings', { cache: 'no-store' });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to fetch bookings');
      }
      return Array.isArray(json.data) ? json.data : [];
    },
    staleTime: 1000 * 30,
  });
}

export function useBooking(id: string, options?: { refetchInterval?: number | false }) {
  return useQuery({
    queryKey: ['booking', id],
    queryFn: async (): Promise<Booking> => {
      const res = await fetch(`/api/bookings/${id}`, { cache: 'no-store' });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Booking not found');
      }
      return json.data;
    },
    enabled: !!id,
    staleTime: options?.refetchInterval ? 0 : 1000 * 30,
    refetchInterval: options?.refetchInterval,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateBookingInput): Promise<Booking> => {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to create booking');
      }

      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: UpdateBookingStatusInput): Promise<Booking> => {
      const res = await fetch(`/api/technician-bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to update booking status');
      }

      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['booking'] });
    },
  });
}
