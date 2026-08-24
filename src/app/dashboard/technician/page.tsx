'use client';

import React from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  Wrench,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  UserCheck,
  User,
  ArrowRight,
} from 'lucide-react';
import StatusBadge from '@/components/booking/StatusBadge';
import NeonButton from '@/components/ui/NeonButton';
import { useMyAvailability } from '@/hooks/useAvailability';
import { useMyBookings, useUpdateBookingStatus } from '@/hooks/useBookings';
import { useMyProfile } from '@/hooks/useTechnicianProfile';
import { useMyServices } from '@/hooks/useTechnicianServices';
import { formatCurrency } from '@/lib/format';
import { Booking } from '@/types/booking';

export default function TechnicianDashboardPage() {
  const { data: bookings = [], isLoading: loadingBookings, error: bookingsError, refetch } = useMyBookings();
  const { data: profile, isLoading: loadingProfile } = useMyProfile();
  const { data: services = [] } = useMyServices();
  const { data: availability = [] } = useMyAvailability();

  const updateStatusMutation = useUpdateBookingStatus();

  // Compute stat cards client-side
  const incomingRequests = bookings.filter((b) => b.status === 'REQUESTED').length;
  const activeJobs = bookings.filter((b) => ['ACCEPTED', 'PAID', 'IN_PROGRESS'].includes(b.status)).length;
  const completedJobs = bookings.filter((b) => b.status === 'COMPLETED').length;

  const activeServicesCount = services.filter((s) => s.isActive).length;
  const availabilitySlotCount = availability.length;

  const handleStatusChange = async (
    bookingId: string,
    status: 'ACCEPTED' | 'DECLINED' | 'IN_PROGRESS' | 'COMPLETED'
  ) => {
    try {
      await updateStatusMutation.mutateAsync({ id: bookingId, status });
      toast.success(`Booking status updated to ${status}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update booking status');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1 border-b border-[#2d2722] pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
          Technician Workspace
        </h1>
        <p className="text-xs sm:text-sm text-[#a8a095]">
          Manage job requests, active service listings, weekly availability, and customer appointments.
        </p>
      </div>

      {/* Quick Access & Setup Navigation Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/dashboard/technician/profile" className="group">
          <div className="bg-[#181512] border border-[#2d2722] p-5 rounded-2xl flex items-center justify-between hover:border-[#14b8a6]/40 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0f1716] border border-[#14b8a6]/30 flex items-center justify-center text-[#5eead4]">
                <User className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold font-heading text-white block">Profile Settings</span>
                <span className="text-[11px] text-[#a8a095]">
                  {loadingProfile ? 'Loading...' : profile ? 'Profile Active' : 'Setup Required'}
                </span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#a8a095] group-hover:text-[#5eead4] group-hover:translate-x-1 transition-all" />
          </div>
        </Link>

        <Link href="/dashboard/technician/services" className="group">
          <div className="bg-[#181512] border border-[#2d2722] p-5 rounded-2xl flex items-center justify-between hover:border-[#f59e0b]/40 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#221e1a] border border-[#f59e0b]/30 flex items-center justify-center text-[#fbbf24]">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold font-heading text-white block">Service Listings</span>
                <span className="text-[11px] text-[#a8a095]">{activeServicesCount} Active Services</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#a8a095] group-hover:text-[#fbbf24] group-hover:translate-x-1 transition-all" />
          </div>
        </Link>

        <Link href="/dashboard/technician/availability" className="group">
          <div className="bg-[#181512] border border-[#2d2722] p-5 rounded-2xl flex items-center justify-between hover:border-[#5eead4]/40 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#12100e] border border-[#2d2722] flex items-center justify-center text-[#5eead4]">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold font-heading text-white block">Availability</span>
                <span className="text-[11px] text-[#a8a095]">{availabilitySlotCount} Slots Scheduled</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#a8a095] group-hover:text-[#5eead4] group-hover:translate-x-1 transition-all" />
          </div>
        </Link>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#181512] border border-[#2d2722] p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#221e1a] border border-[#f59e0b]/30 flex items-center justify-center text-[#fbbf24] shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-[#a8a095] block uppercase font-heading font-semibold tracking-wider">
              Pending Requests
            </span>
            <span className="text-2xl font-extrabold font-heading text-[#fbbf24]">
              {incomingRequests}
            </span>
          </div>
        </div>

        <div className="bg-[#181512] border border-[#2d2722] p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#0f172a] border border-[#0284c7]/30 flex items-center justify-center text-[#38bdf8] shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-[#a8a095] block uppercase font-heading font-semibold tracking-wider">
              Active Jobs
            </span>
            <span className="text-2xl font-extrabold font-heading text-[#38bdf8]">
              {activeJobs}
            </span>
          </div>
        </div>

        <div className="bg-[#181512] border border-[#2d2722] p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#0f1716] border border-[#14b8a6]/30 flex items-center justify-center text-[#5eead4] shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-[#a8a095] block uppercase font-heading font-semibold tracking-wider">
              Completed Jobs
            </span>
            <span className="text-2xl font-extrabold font-heading text-[#5eead4]">
              {completedJobs}
            </span>
          </div>
        </div>
      </div>

      {/* Bookings Management Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2">
            <Wrench className="w-4 h-4 text-[#f59e0b]" /> Incoming Job Requests & Assigned Jobs
          </h2>
        </div>

        {loadingBookings ? (
          <div className="bg-[#181512] border border-[#2d2722] rounded-2xl p-6 space-y-4 animate-pulse">
            <div className="h-12 bg-[#221e1a] rounded-xl" />
            <div className="h-12 bg-[#221e1a] rounded-xl" />
          </div>
        ) : bookingsError ? (
          <div className="bg-[#181512] border border-red-900/40 p-8 rounded-2xl text-center space-y-3">
            <AlertTriangle className="w-8 h-8 text-red-400 mx-auto" />
            <p className="text-sm font-semibold text-white">Unable to load job requests</p>
            <p className="text-xs text-[#a8a095]">
              {bookingsError instanceof Error ? bookingsError.message : 'Error fetching bookings.'}
            </p>
            <NeonButton variant="primary" size="sm" onClick={() => refetch()} icon={<RotateCcw className="w-3.5 h-3.5" />}>
              Try Again
            </NeonButton>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-[#181512] border border-[#2d2722] p-8 sm:p-12 rounded-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#221e1a] border border-[#f59e0b]/30 flex items-center justify-center text-[#fbbf24] mx-auto">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold font-heading text-white">
                No job requests assigned yet
              </h3>
              <p className="text-xs text-[#a8a095]">
                When customers book your services, incoming jobs will appear here for your review.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-[#181512] border border-[#2d2722] rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#d4ceb8]">
                <thead className="bg-[#12100e] text-[#a8a095] uppercase tracking-wider font-heading font-semibold border-b border-[#2d2722]">
                  <tr>
                    <th className="py-3.5 px-4">Service</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Scheduled Date</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2d2722]/60">
                  {bookings.map((booking) => {
                    const custName =
                      booking.customer?.name ||
                      'Marketplace Customer';

                    const formattedDate = new Date(booking.scheduledDate).toLocaleString('en-US', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    });

                    return (
                      <tr key={booking.id} className="hover:bg-[#221e1a]/50 transition-colors">
                        <td className="py-4 px-4 font-semibold text-white font-heading">
                          {booking.service?.title || 'Service Booking'}
                        </td>
                        <td className="py-4 px-4 text-[#f5f2eb]">
                          <span className="flex items-center gap-1.5">
                            <UserCheck className="w-3.5 h-3.5 text-[#5eead4]" />
                            {custName}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-[#a8a095] whitespace-nowrap">
                          {formattedDate}
                        </td>
                        <td className="py-4 px-4">
                          <StatusBadge status={booking.status} />
                        </td>
                        <td className="py-4 px-4 font-bold text-[#fbbf24] font-heading">
                          {formatCurrency(booking.priceAtBooking)}
                        </td>
                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          {booking.status === 'REQUESTED' && (
                            <div className="flex items-center justify-end gap-2">
                              <NeonButton
                                variant="primary"
                                size="sm"
                                onClick={() => handleStatusChange(booking.id, 'ACCEPTED')}
                                loading={updateStatusMutation.isPending}
                              >
                                Accept
                              </NeonButton>
                              <NeonButton
                                variant="danger"
                                size="sm"
                                onClick={() => handleStatusChange(booking.id, 'DECLINED')}
                                loading={updateStatusMutation.isPending}
                              >
                                Decline
                              </NeonButton>
                            </div>
                          )}

                          {booking.status === 'PAID' && (
                            <NeonButton
                              variant="secondary"
                              size="sm"
                              onClick={() => handleStatusChange(booking.id, 'IN_PROGRESS')}
                              loading={updateStatusMutation.isPending}
                            >
                              Start Job
                            </NeonButton>
                          )}

                          {booking.status === 'IN_PROGRESS' && (
                            <NeonButton
                              variant="primary"
                              size="sm"
                              onClick={() => handleStatusChange(booking.id, 'COMPLETED')}
                              loading={updateStatusMutation.isPending}
                            >
                              Mark Completed
                            </NeonButton>
                          )}

                          {!['REQUESTED', 'PAID', 'IN_PROGRESS'].includes(booking.status) && (
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
