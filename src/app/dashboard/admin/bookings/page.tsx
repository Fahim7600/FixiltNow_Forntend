'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Filter,
  AlertTriangle,
  RotateCcw,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Wrench,
} from 'lucide-react';
import StatusBadge from '@/components/booking/StatusBadge';
import NeonButton from '@/components/ui/NeonButton';
import { useAdminBookings } from '@/hooks/useAdmin';
import { formatCurrency } from '@/lib/format';

export default function AdminBookingsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  const limit = 10;

  const { data, isLoading, error, refetch } = useAdminBookings({
    status: statusFilter || undefined,
    page,
    limit,
  });

  const bookings = data?.items || data?.results || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || Math.ceil(total / limit) || 1;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1 border-b border-[#2d2722] pb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-6 h-6 text-[#fbbf24]" />
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
            Platform-Wide Bookings Log
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-[#a8a095]">
          Read-only audit log of all customer-technician service bookings across the platform.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#181512] border border-[#2d2722] p-4 rounded-2xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#fbbf24]" />
          <span className="text-xs font-semibold text-[#d4ceb8] font-heading">
            Filter by Booking Status:
          </span>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="px-3.5 py-2 rounded-xl bg-[#12100e] border border-[#2d2722] text-xs text-white focus:border-[#fbbf24] focus:outline-none transition-colors"
        >
          <option value="">All Statuses</option>
          <option value="REQUESTED">Requested</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="DECLINED">Declined</option>
          <option value="PAID">Paid</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Bookings Table */}
      {isLoading ? (
        <div className="bg-[#181512] border border-[#2d2722] rounded-2xl p-6 space-y-4 animate-pulse">
          <div className="h-12 bg-[#221e1a] rounded-xl" />
          <div className="h-12 bg-[#221e1a] rounded-xl" />
          <div className="h-12 bg-[#221e1a] rounded-xl" />
        </div>
      ) : error ? (
        <div className="bg-[#181512] border border-red-900/40 p-8 rounded-2xl text-center space-y-3">
          <AlertTriangle className="w-8 h-8 text-red-400 mx-auto" />
          <p className="text-sm font-semibold text-white">Unable to load platform bookings</p>
          <p className="text-xs text-[#a8a095]">
            {error instanceof Error ? error.message : 'Error fetching bookings list.'}
          </p>
          <NeonButton variant="primary" size="sm" onClick={() => refetch()} icon={<RotateCcw className="w-3.5 h-3.5" />}>
            Try Again
          </NeonButton>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-[#181512] border border-[#2d2722] p-12 rounded-2xl text-center text-[#a8a095]">
          No bookings found matching your selected status filter.
        </div>
      ) : (
        <div className="bg-[#181512] border border-[#2d2722] rounded-2xl overflow-hidden shadow-lg space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#d4ceb8]">
              <thead className="bg-[#12100e] text-[#a8a095] uppercase tracking-wider font-heading font-semibold border-b border-[#2d2722]">
                <tr>
                  <th className="py-3.5 px-4">Service</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Technician</th>
                  <th className="py-3.5 px-4">Scheduled Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2d2722]/60">
                {bookings.map((b) => {
                  const custName = b.customer?.name || 'Customer';
                  const techName = b.technician?.name || 'Technician';
                  const serviceTitle = b.service?.title || 'Home Repair Service';
                  const scheduledStr = new Date(b.scheduledDate).toLocaleString('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  });

                  return (
                    <tr key={b.id} className="hover:bg-[#221e1a]/50 transition-colors">
                      <td className="py-4 px-4 font-semibold text-white font-heading">
                        <span className="flex items-center gap-1.5">
                          <Wrench className="w-3.5 h-3.5 text-[#fbbf24]" />
                          {serviceTitle}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-[#f5f2eb]">
                        <span className="flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5 text-[#5eead4]" />
                          {custName}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-[#a8a095]">
                        {techName}
                      </td>
                      <td className="py-4 px-4 text-[#a8a095] whitespace-nowrap">
                        {scheduledStr}
                      </td>
                      <td className="py-4 px-4">
                        <StatusBadge status={b.status as any} />
                      </td>
                      <td className="py-4 px-4 font-bold text-[#fbbf24] font-heading text-right">
                        {formatCurrency(b.priceAtBooking)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="p-4 border-t border-[#2d2722] flex items-center justify-between text-xs text-[#a8a095]">
            <span>
              Showing Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({total} total bookings)
            </span>
            <div className="flex items-center gap-2">
              <NeonButton
                variant="ghost"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                icon={<ChevronLeft className="w-3.5 h-3.5" />}
              >
                Previous
              </NeonButton>
              <NeonButton
                variant="ghost"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                icon={<ChevronRight className="w-3.5 h-3.5" />}
              >
                Next
              </NeonButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
