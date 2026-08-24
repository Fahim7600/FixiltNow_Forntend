'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { X, MessageSquare, Star } from 'lucide-react';
import StarRating from './StarRating';
import NeonButton from '@/components/ui/NeonButton';
import { useCreateReview } from '@/hooks/useReviews';
import { Booking } from '@/types/booking';

export interface ReviewModalProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (bookingId: string) => void;
}

export default function ReviewModal({
  booking,
  isOpen,
  onClose,
  onSuccess,
}: ReviewModalProps) {
  const createReviewMutation = useCreateReview();

  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');

  if (!isOpen) return null;

  const serviceTitle = booking.service?.title || 'Home Repair Service';
  const techName =
    booking.technician?.user?.name ||
    booking.technician?.name ||
    booking.technicianProfile?.user?.name ||
    'Assigned Technician';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating <= 0) {
      toast.error('Please select a star rating between 1 and 5');
      return;
    }

    try {
      await createReviewMutation.mutateAsync({
        bookingId: booking.id,
        rating,
        comment: comment.trim() || undefined,
      });

      toast.success('Review submitted successfully! Thank you for your feedback.');
      onSuccess(booking.id);
      onClose();
    } catch (err: any) {
      const errMsg = err.message || '';
      if (
        errMsg.toLowerCase().includes('already reviewed') ||
        errMsg.toLowerCase().includes('already submitted')
      ) {
        toast.info("You've already reviewed this booking");
        onSuccess(booking.id);
        onClose();
      } else {
        toast.error(errMsg || 'Failed to submit review');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#181512] border border-[#2d2722] rounded-2xl p-6 shadow-[0_0_40px_rgba(0,0,0,0.6)] space-y-6 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#b45309] via-[#f59e0b] to-[#fbbf24]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#a8a095] hover:text-white hover:bg-[#221e1a] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#fbbf24] font-heading">
            Leave Feedback
          </span>
          <h2 className="text-xl font-bold font-heading text-white">Rate Your Experience</h2>
          <p className="text-xs text-[#a8a095]">
            Service: <strong className="text-white">{serviceTitle}</strong> by{' '}
            <strong className="text-[#5eead4]">{techName}</strong>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Star Rating Input */}
          <div className="space-y-2 text-center bg-[#12100e] border border-[#2d2722] p-4 rounded-xl">
            <label className="text-xs font-semibold text-[#d4ceb8] font-heading block">
              Overall Rating *
            </label>
            <StarRating value={rating} onChange={setRating} size={28} />
            <p className="text-[11px] text-[#a8a095]">
              {rating > 0 ? `${rating} of 5 stars` : 'Click a star to select rating'}
            </p>
          </div>

          {/* Comment Textarea */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-[#d4ceb8] font-heading">
              <label className="flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#5eead4]" /> Review Comment (Optional)
              </label>
              <span
                className={`text-[10px] ${
                  comment.length > 950 ? 'text-red-400 font-bold' : 'text-[#6b6359]'
                }`}
              >
                {comment.length} / 1000
              </span>
            </div>
            <textarea
              rows={4}
              maxLength={1000}
              placeholder="Tell us about the service quality, punctuality, and professionalism..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#12100e] border border-[#2d2722] text-xs text-white placeholder-[#6b6359] focus:border-[#fbbf24] focus:outline-none transition-colors"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <NeonButton type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </NeonButton>
            <NeonButton
              type="submit"
              variant="primary"
              size="md"
              disabled={rating === 0 || createReviewMutation.isPending}
              loading={createReviewMutation.isPending}
              icon={<Star className="w-4 h-4" />}
            >
              Submit Review
            </NeonButton>
          </div>
        </form>
      </div>
    </div>
  );
}
