'use client';

import React from 'react';
import Link from 'next/link';
import {
  Users,
  Wrench,
  Calendar,
  CreditCard,
  Tag,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import {
  useAdminUsers,
  useAdminBookings,
  useAdminPayments,
} from '@/hooks/useAdmin';
import { formatCurrency } from '@/lib/format';

export default function AdminDashboardOverviewPage() {
  const { data: usersData, isLoading: loadingUsers } = useAdminUsers({ limit: 1 });
  const { data: techData, isLoading: loadingTech } = useAdminUsers({ role: 'TECHNICIAN', limit: 1 });
  const { data: bookingsData, isLoading: loadingBookings } = useAdminBookings({ limit: 50 });
  const { data: paymentsData, isLoading: loadingPayments } = useAdminPayments({ status: 'COMPLETED', limit: 50 });

  const totalUsers = usersData?.total || 0;
  const totalTechnicians = techData?.total || 0;

  const bookingsList = bookingsData?.items || bookingsData?.results || [];
  const activeBookingsCount = bookingsList.filter((b) =>
    ['REQUESTED', 'ACCEPTED', 'PAID', 'IN_PROGRESS'].includes(b.status)
  ).length;

  const paymentsList = paymentsData?.items || paymentsData?.results || [];
  const totalRevenue = paymentsList.reduce((acc, curr) => {
    const val = typeof curr.amount === 'number' ? curr.amount : parseFloat(String(curr.amount || 0));
    return acc + (isNaN(val) ? 0 : val);
  }, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1 border-b border-[#2d2722] pb-6">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-[#fbbf24]" />
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
            Admin Operations Center
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-[#a8a095]">
          Platform-wide metrics, user administration, category catalog control, and booking oversight.
        </p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#181512] border border-[#2d2722] p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#12100e] border border-[#2d2722] flex items-center justify-center text-[#5eead4] shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-[#a8a095] block uppercase font-heading font-semibold tracking-wider">
              Total Users
            </span>
            <span className="text-2xl font-extrabold font-heading text-white">
              {loadingUsers ? '...' : totalUsers}
            </span>
          </div>
        </div>

        <div className="bg-[#181512] border border-[#2d2722] p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#0f1716] border border-[#14b8a6]/30 flex items-center justify-center text-[#14b8a6] shrink-0">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-[#a8a095] block uppercase font-heading font-semibold tracking-wider">
              Technicians
            </span>
            <span className="text-2xl font-extrabold font-heading text-[#5eead4]">
              {loadingTech ? '...' : totalTechnicians}
            </span>
          </div>
        </div>

        <div className="bg-[#181512] border border-[#2d2722] p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#221e1a] border border-[#f59e0b]/30 flex items-center justify-center text-[#fbbf24] shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-[#a8a095] block uppercase font-heading font-semibold tracking-wider">
              Active Bookings
            </span>
            <span className="text-2xl font-extrabold font-heading text-[#fbbf24]">
              {loadingBookings ? '...' : activeBookingsCount}
            </span>
          </div>
        </div>

        <div className="bg-[#181512] border border-[#2d2722] p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#1c1212] border border-amber-600/30 flex items-center justify-center text-amber-400 shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-[#a8a095] block uppercase font-heading font-semibold tracking-wider">
              Platform Revenue
            </span>
            <span className="text-2xl font-extrabold font-heading text-amber-400">
              {loadingPayments ? '...' : formatCurrency(totalRevenue)}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Navigation Management Cards */}
      <div className="space-y-4 pt-2">
        <h2 className="text-lg font-bold font-heading text-white">
          Platform Management Modules
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/dashboard/admin/users" className="group">
            <div className="bg-[#181512] border border-[#2d2722] p-6 rounded-2xl flex items-center justify-between hover:border-[#5eead4]/50 transition-colors shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#12100e] border border-[#2d2722] flex items-center justify-center text-[#5eead4]">
                  <Users className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold font-heading text-white">User Administration</h3>
                  <p className="text-xs text-[#a8a095]">Manage user accounts, roles, and status (Active/Banned).</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-[#a8a095] group-hover:text-[#5eead4] group-hover:translate-x-1.5 transition-all shrink-0" />
            </div>
          </Link>

          <Link href="/dashboard/admin/categories" className="group">
            <div className="bg-[#181512] border border-[#2d2722] p-6 rounded-2xl flex items-center justify-between hover:border-[#fbbf24]/50 transition-colors shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#221e1a] border border-[#f59e0b]/30 flex items-center justify-center text-[#fbbf24]">
                  <Tag className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold font-heading text-white">Category Catalog</h3>
                  <p className="text-xs text-[#a8a095]">Create and audit service categories for marketplace listing.</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-[#a8a095] group-hover:text-[#fbbf24] group-hover:translate-x-1.5 transition-all shrink-0" />
            </div>
          </Link>

          <Link href="/dashboard/admin/bookings" className="group">
            <div className="bg-[#181512] border border-[#2d2722] p-6 rounded-2xl flex items-center justify-between hover:border-[#38bdf8]/50 transition-colors shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#0f172a] border border-[#0284c7]/30 flex items-center justify-center text-[#38bdf8]">
                  <Calendar className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold font-heading text-white">All Bookings Oversight</h3>
                  <p className="text-xs text-[#a8a095]">Read-only log of customer-technician bookings & statuses.</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-[#a8a095] group-hover:text-[#38bdf8] group-hover:translate-x-1.5 transition-all shrink-0" />
            </div>
          </Link>

          <Link href="/dashboard/admin/payments" className="group">
            <div className="bg-[#181512] border border-[#2d2722] p-6 rounded-2xl flex items-center justify-between hover:border-[#14b8a6]/50 transition-colors shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#0f1716] border border-[#14b8a6]/30 flex items-center justify-center text-[#14b8a6]">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold font-heading text-white">Payments & Stripe Log</h3>
                  <p className="text-xs text-[#a8a095]">Monitor completed, pending, and failed payment transactions.</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-[#a8a095] group-hover:text-[#14b8a6] group-hover:translate-x-1.5 transition-all shrink-0" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
