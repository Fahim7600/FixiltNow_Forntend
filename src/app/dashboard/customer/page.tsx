'use client';

import React from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Wrench,
  CreditCard,
  UserCheck,
} from 'lucide-react';
import StatusBadge from '@/components/booking/StatusBadge';
import NeonButton from '@/components/ui/NeonButton';
import { useMyBookings } from '@/hooks/useBookings';
import { formatCurrency } from '@/lib/format';

export default function CustomerDashboardPage() {
  const { data: bookings = [], isLoading, error, refetch } = useMyBookings();

  // Compute stat cards client-side
  const totalBookings = bookings.length;

  const now = new Date().getTime();
  const upcomingBookings = bookings.filter((b) => {
    const isFuture = new Date(b.scheduledDate).getTime() > now;
    const isNotDone = !['COMPLETED', 'DECLINED', 'CANCELLED'].includes(b.status);
    return isFuture && isNotDone;
  }).length;

  const completedBookings = bookings.filter((b) => b.status === 'COMPLETED').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1 border-b border-[#2d2722] pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
          Customer Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-[#a8a095]">
          Manage your booked home repair services, track job status, and initiate payments.
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
          <div className="w-12 h-12 rounded-xl bg-[#0f172a] border border-[#0284c7]/30 flex items-center justify-center text-[#38bdf8] shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-[#a8a095] block uppercase font-heading font-semibold tracking-wider">
              Upcoming Jobs
            </span>
            <span className="text-2xl font-extrabold font-heading text-[#38bdf8]">
              {upcomingBookings}
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
              {completedBookings}
            </span>
          </div>
        </div>
      </div>

      {/* Bookings List / Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2">
            <Wrench className="w-4 h-4 text-[#f59e0b]" /> My Service Bookings
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
            <p className="text-sm font-semibold text-white">Unable to load your bookings</p>
            <p className="text-xs text-[#a8a095]">
              {error instanceof Error ? error.message : 'Error fetching bookings from server.'}
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
                No bookings yet
              </h3>
              <p className="text-xs text-[#a8a095]">
                Browse our marketplace to find expert local technicians for your home repair needs.
              </p>
            </div>
            <Link href="/services">
              <NeonButton variant="primary" size="sm" icon={<Wrench className="w-3.5 h-3.5" />}>
                Browse Services
              </NeonButton>
            </Link>
          </div>
        ) : (
          <div className="bg-[#181512] border border-[#2d2722] rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#d4ceb8]">
                <thead className="bg-[#12100e] text-[#a8a095] uppercase tracking-wider font-heading font-semibold border-b border-[#2d2722]">
                  <tr>
                    <th className="py-3.5 px-4">Service</th>
                    <th className="py-3.5 px-4">Technician</th>
                    <th className="py-3.5 px-4">Scheduled Date</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2d2722]/60">
                  {bookings.map((booking) => {
                    const techName =
                      booking.technician?.user?.name ||
                      booking.technician?.name ||
                      booking.technicianProfile?.user?.name ||
                      'Assigned Technician';

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
                            <UserCheck className="w-3.5 h-3.5 text-[#14b8a6]" />
                            {techName}
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
                          {booking.status === 'ACCEPTED' ? (
                            <Link href={`/dashboard/customer/bookings/${booking.id}/pay`}>
                              <NeonButton variant="primary" size="sm" icon={<CreditCard className="w-3 h-3" />}>
                                Pay Now
                              </NeonButton>
                            </Link>
                          ) : (
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
