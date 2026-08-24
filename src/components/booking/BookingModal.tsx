'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { X, Calendar, FileText, Zap } from 'lucide-react';
import NeonButton from '@/components/ui/NeonButton';
import { useCreateBooking } from '@/hooks/useBookings';
import { ServiceItem } from '@/types/catalog';
import { formatCurrency } from '@/lib/format';

export interface BookingModalProps {
  service: ServiceItem;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ service, isOpen, onClose }: BookingModalProps) {
  const router = useRouter();
  const createBookingMutation = useCreateBooking();

  // Generate min date-time string in ISO format for datetime-local input
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const minDateTime = now.toISOString().slice(0, 16);

  const [scheduledDate, setScheduledDate] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!scheduledDate) {
      toast.error('Please select a scheduled date and time');
      return;
    }

    const selectedTime = new Date(scheduledDate).getTime();
    if (selectedTime <= Date.now()) {
      toast.error('Scheduled date must be in the future');
      return;
    }

    try {
      const isoDate = new Date(scheduledDate).toISOString();
      await createBookingMutation.mutateAsync({
        serviceId: service.id,
        scheduledDate: isoDate,
        notes: notes.trim() || undefined,
      });

      toast.success('Booking request submitted successfully!');
      onClose();
      router.push('/dashboard/customer');
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit booking');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#181512] border border-[#2d2722] rounded-2xl p-6 shadow-[0_0_40px_rgba(0,0,0,0.6)] space-y-6 overflow-hidden">
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
          <span className="text-xs font-bold uppercase tracking-wider text-[#f59e0b] font-heading">
            Book Service
          </span>
          <h2 className="text-xl font-bold font-heading text-white">{service.title}</h2>
          <p className="text-xs text-[#a8a095]">
            Service Rate: <span className="text-[#fbbf24] font-bold">{formatCurrency(service.price)}</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Scheduled Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#d4ceb8] font-heading flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#f59e0b]" /> Schedule Date & Time *
            </label>
            <input
              type="datetime-local"
              min={minDateTime}
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#12100e] border border-[#2d2722] text-sm text-white focus:border-[#f59e0b] focus:outline-none transition-colors"
            />
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#d4ceb8] font-heading flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#5eead4]" /> Instructions / Notes (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Describe the issue, gate code, or specific requests..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#12100e] border border-[#2d2722] text-xs text-white placeholder-[#6b6359] focus:border-[#5eead4] focus:outline-none transition-colors"
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
              loading={createBookingMutation.isPending}
              icon={<Zap className="w-4 h-4" />}
            >
              Confirm Booking
            </NeonButton>
          </div>
        </form>
      </div>
    </div>
  );
}
