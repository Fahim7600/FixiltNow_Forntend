import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateReviewInput, Review } from '@/types/review';

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateReviewInput): Promise<Review> => {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to submit review');
      }

      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['technician'] });
      queryClient.invalidateQueries({ queryKey: ['technicians'] });
    },
  });
}
