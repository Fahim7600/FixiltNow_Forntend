'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  Filter,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import NeonButton from '@/components/ui/NeonButton';
import { useAdminPayments } from '@/hooks/useAdmin';
import { formatCurrency } from '@/lib/format';
import { AdminPayment } from '@/types/admin';

export default function AdminPaymentsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  const limit = 10;

  const { data, isLoading, error, refetch } = useAdminPayments({
    status: statusFilter || undefined,
    page,
    limit,
  });

  const payments = data?.items || data?.results || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || Math.ceil(total / limit) || 1;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1 border-b border-[#2d2722] pb-6">
        <div className="flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-[#14b8a6]" />
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
            Platform Payments & Stripe Audit Log
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-[#a8a095]">
          Audit log of all payment intent transactions processed via Stripe.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#181512] border border-[#2d2722] p-4 rounded-2xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#14b8a6]" />
          <span className="text-xs font-semibold text-[#d4ceb8] font-heading">
            Filter by Payment Status:
          </span>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="px-3.5 py-2 rounded-xl bg-[#12100e] border border-[#2d2722] text-xs text-white focus:border-[#14b8a6] focus:outline-none transition-colors"
        >
          <option value="">All Statuses</option>
          <option value="COMPLETED">Completed</option>
          <option value="PENDING">Pending</option>
          <option value="FAILED">Failed</option>
        </select>
      </div>

      {/* Payments Table */}
      {isLoading ? (
        <div className="bg-[#181512] border border-[#2d2722] rounded-2xl p-6 space-y-4 animate-pulse">
          <div className="h-12 bg-[#221e1a] rounded-xl" />
          <div className="h-12 bg-[#221e1a] rounded-xl" />
          <div className="h-12 bg-[#221e1a] rounded-xl" />
        </div>
      ) : error ? (
        <div className="bg-[#181512] border border-red-900/40 p-8 rounded-2xl text-center space-y-3">
          <AlertTriangle className="w-8 h-8 text-red-400 mx-auto" />
          <p className="text-sm font-semibold text-white">Unable to load platform payments</p>
          <p className="text-xs text-[#a8a095]">
            {error instanceof Error ? error.message : 'Error fetching payment log.'}
          </p>
          <NeonButton variant="primary" size="sm" onClick={() => refetch()} icon={<RotateCcw className="w-3.5 h-3.5" />}>
            Try Again
          </NeonButton>
        </div>
      ) : payments.length === 0 ? (
        <div className="bg-[#181512] border border-[#2d2722] p-12 rounded-2xl text-center text-[#a8a095]">
          No payment records found matching your selected status filter.
        </div>
      ) : (
        <div className="bg-[#181512] border border-[#2d2722] rounded-2xl overflow-hidden shadow-lg space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#d4ceb8]">
              <thead className="bg-[#12100e] text-[#a8a095] uppercase tracking-wider font-heading font-semibold border-b border-[#2d2722]">
                <tr>
                  <th className="py-3.5 px-4">Payment ID</th>
                  <th className="py-3.5 px-4">Booking Reference</th>
                  <th className="py-3.5 px-4">Service</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2d2722]/60">
                {payments.map((p: AdminPayment) => {
                  const createdStr = new Date(p.createdAt).toLocaleString('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  });

                  const serviceTitle = p.booking?.service?.title || 'Service Booking';

                  return (
                    <tr key={p.id} className="hover:bg-[#221e1a]/50 transition-colors">
                      <td className="py-4 px-4 font-mono text-[#a8a095] font-medium">
                        {p.id.slice(0, 10)}...
                      </td>
                      <td className="py-4 px-4 font-mono text-[#5eead4]">
                        {p.bookingId ? (
                          <span className="flex items-center gap-1">
                            {p.bookingId.slice(0, 10)}...
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="py-4 px-4 font-semibold text-white font-heading">
                        {serviceTitle}
                      </td>
                      <td className="py-4 px-4">
                        {p.status === 'COMPLETED' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-950/60 text-[#5eead4] border border-teal-800/60 font-semibold text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#14b8a6]" /> COMPLETED
                          </span>
                        )}
                        {p.status === 'PENDING' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-950/60 text-[#fbbf24] border border-amber-800/60 font-semibold text-[11px]">
                            <Clock className="w-3.5 h-3.5 text-[#fbbf24]" /> PENDING
                          </span>
                        )}
                        {p.status === 'FAILED' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-950/60 text-red-400 border border-red-800/60 font-semibold text-[11px]">
                            <XCircle className="w-3.5 h-3.5 text-red-400" /> FAILED
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-[#a8a095] whitespace-nowrap">
                        {createdStr}
                      </td>
                      <td className="py-4 px-4 font-bold text-[#5eead4] font-heading text-right">
                        {formatCurrency(p.amount)}
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
              Showing Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({total} total transactions)
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
