'use client';

import React from 'react';
import { toast } from 'sonner';
import {
  Calendar,
  Clock,
  DollarSign,
  AlertTriangle,
  RotateCcw,
  Wrench,
  Check,
  X,
  Play,
  CheckCheck,
  User,
} from 'lucide-react';
import StatusBadge from '@/components/booking/StatusBadge';
import NeonButton from '@/components/ui/NeonButton';
import { useMyBookings, useUpdateBookingStatus } from '@/hooks/useBookings';
import { formatCurrency } from '@/lib/format';

export default function TechnicianDashboardPage() {
  const { data: bookings = [], isLoading, error, refetch } = useMyBookings();
  const updateStatusMutation = useUpdateBookingStatus();

  // Compute stat cards client-side
  const totalBookings = bookings.length;
  const pendingRequests = bookings.filter((b) => b.status === 'REQUESTED').length;

  const totalEarnings = bookings.reduce((sum, b) => {
    if (['PAID', 'IN_PROGRESS', 'COMPLETED'].includes(b.status)) {
      const val = typeof b.priceAtBooking === 'number' ? b.priceAtBooking : Number(b.priceAtBooking);
      return sum + (isNaN(val) ? 0 : val);
    }
    return sum;
  }, 0);

  const handleStatusChange = async (
    id: string,
    targetStatus: 'ACCEPTED' | 'DECLINED' | 'IN_PROGRESS' | 'COMPLETED',
    successMessage: string
  ) => {
    try {
      await updateStatusMutation.mutateAsync({ id, status: targetStatus });
      toast.success(successMessage);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update booking status');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1 border-b border-[#2d2722] pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
          Technician Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-[#a8a095]">
          Manage incoming job requests, update service progress, and track your total earnings.
        </p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#181512] border border-[#2d2722] p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#221e1a] border border-[#f59e0b]/30 flex items-center justify-center text-[#fbbf24] shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-[#a8a095] block uppercase font-heading font-semibold tracking-wider">
              Total Bookings
            </span>
            <span className="text-2xl font-extrabold font-heading text-white">
              {totalBookings}
            </span>
          </div>
        </div>

        <div className="bg-[#181512] border border-[#2d2722] p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#221e1a] border border-[#f59e0b]/40 flex items-center justify-center text-[#f59e0b] shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-[#a8a095] block uppercase font-heading font-semibold tracking-wider">
              Pending Requests
            </span>
            <span className="text-2xl font-extrabold font-heading text-[#fbbf24]">
              {pendingRequests}
            </span>
          </div>
        </div>

        <div className="bg-[#181512] border border-[#2d2722] p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#0f1716] border border-[#14b8a6]/30 flex items-center justify-center text-[#5eead4] shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-[#a8a095] block uppercase font-heading font-semibold tracking-wider">
              Total Earnings
            </span>
            <span className="text-2xl font-extrabold font-heading text-[#5eead4]">
              {formatCurrency(totalEarnings)}
            </span>
          </div>
        </div>
      </div>

      {/* Bookings List / Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2">
            <Wrench className="w-4 h-4 text-[#5eead4]" /> Incoming & Active Jobs
          </h2>
        </div>

        {isLoading ? (
          <div className="bg-[#181512] border border-[#2d2722] rounded-2xl p-6 space-y-4 animate-pulse">
            <div className="h-12 bg-[#221e1a] rounded-xl" />
            <div className="h-12 bg-[#221e1a] rounded-xl" />
            <div className="h-12 bg-[#221e1a] rounded-xl" />
          </div>
        ) : error ? (
          <div className="bg-[#181512] border border-red-900/40 p-8 rounded-2xl text-center space-y-3">
            <AlertTriangle className="w-8 h-8 text-red-400 mx-auto" />
            <p className="text-sm font-semibold text-white">Unable to load technician bookings</p>
            <p className="text-xs text-[#a8a095]">
              {error instanceof Error ? error.message : 'Error fetching bookings from server.'}
            </p>
            <NeonButton variant="primary" size="sm" onClick={() => refetch()} icon={<RotateCcw className="w-3.5 h-3.5" />}>
              Try Again
            </NeonButton>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-[#181512] border border-[#2d2722] p-8 sm:p-12 rounded-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#221e1a] border border-[#14b8a6]/30 flex items-center justify-center text-[#5eead4] mx-auto">
              <Wrench className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold font-heading text-white">
                No job requests yet
              </h3>
              <p className="text-xs text-[#a8a095]">
                When customers book your listed services, requests will appear here for your review.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-[#181512] border border-[#2d2722] rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#d4ceb8]">
                <thead className="bg-[#12100e] text-[#a8a095] uppercase tracking-wider font-heading font-semibold border-b border-[#2d2722]">
                  <tr>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Service</th>
                    <th className="py-3.5 px-4">Scheduled Date</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Payout</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2d2722]/60">
                  {bookings.map((booking) => {
                    const customerName = booking.customer?.name || 'Customer';
                    const formattedDate = new Date(booking.scheduledDate).toLocaleString('en-US', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    });

                    return (
                      <tr key={booking.id} className="hover:bg-[#221e1a]/50 transition-colors">
                        <td className="py-4 px-4 font-semibold text-white font-heading">
                          <span className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-[#f59e0b]" />
                            {customerName}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-[#f5f2eb]">
                          {booking.service?.title || 'Service Job'}
                        </td>
                        <td className="py-4 px-4 text-[#a8a095] whitespace-nowrap">
                          {formattedDate}
                        </td>
                        <td className="py-4 px-4">
                          <StatusBadge status={booking.status} />
                        </td>
                        <td className="py-4 px-4 font-bold text-[#5eead4] font-heading">
                          {formatCurrency(booking.priceAtBooking)}
                        </td>
                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          {booking.status === 'REQUESTED' && (
                            <div className="flex items-center justify-end gap-2">
                              <NeonButton
                                variant="primary"
                                size="sm"
                                onClick={() => handleStatusChange(booking.id, 'ACCEPTED', 'Booking accepted')}
                                loading={updateStatusMutation.isPending}
                                icon={<Check className="w-3 h-3" />}
                              >
                                Accept
                              </NeonButton>
                              <NeonButton
                                variant="danger"
                                size="sm"
                                onClick={() => handleStatusChange(booking.id, 'DECLINED', 'Booking declined')}
                                loading={updateStatusMutation.isPending}
                                icon={<X className="w-3 h-3" />}
                              >
                                Decline
                              </NeonButton>
                            </div>
                          )}

                          {booking.status === 'ACCEPTED' && (
                            <span className="text-[11px] text-[#38bdf8] font-medium italic">
                              Waiting for customer payment
                            </span>
                          )}

                          {booking.status === 'PAID' && (
                            <NeonButton
                              variant="primary"
                              size="sm"
                              onClick={() => handleStatusChange(booking.id, 'IN_PROGRESS', 'Job marked in progress')}
                              loading={updateStatusMutation.isPending}
                              icon={<Play className="w-3 h-3" />}
                            >
                              Start Job
                            </NeonButton>
                          )}

                          {booking.status === 'IN_PROGRESS' && (
                            <NeonButton
                              variant="primary"
                              size="sm"
                              onClick={() => handleStatusChange(booking.id, 'COMPLETED', 'Job marked completed')}
                              loading={updateStatusMutation.isPending}
                              icon={<CheckCheck className="w-3 h-3" />}
                            >
                              Mark Completed
                            </NeonButton>
                          )}

                          {['COMPLETED', 'DECLINED', 'CANCELLED'].includes(booking.status) && (
                            <span className="text-[11px] text-[#6b6359] italic">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
