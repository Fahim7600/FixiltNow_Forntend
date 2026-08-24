'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { Wrench, CheckCircle2, DollarSign, Star } from 'lucide-react';

export default function TechnicianDashboardPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-[#a8a095]">
        Loading technician portal...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-[#0f1716] border border-[#14b8a6]/30 p-6 sm:p-8 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0f766e] via-[#14b8a6] to-[#5eead4]" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#14b8a6]/10 text-[#5eead4] text-xs font-semibold border border-[#14b8a6]/30">
              <Wrench className="w-3.5 h-3.5" /> Technician Pro Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
              Welcome, {user?.name || 'Pro Technician'}!
            </h1>
            <p className="text-sm text-[#a8a095]">
              Manage incoming repair requests, track job schedules, and view earnings payouts.
            </p>
          </div>
        </div>
      </div>

      {/* Grid Stats Placeholders */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#181512] border border-[#2d2722] p-5 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-[#5eead4]">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#a8a095]">Jobs</span>
          </div>
          <p className="text-2xl font-bold font-heading text-white">0</p>
          <p className="text-xs text-[#a8a095]">Assigned Service Calls</p>
        </div>

        <div className="bg-[#181512] border border-[#2d2722] p-5 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-[#fbbf24]">
            <DollarSign className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#a8a095]">Payouts</span>
          </div>
          <p className="text-2xl font-bold font-heading text-white">$0.00</p>
          <p className="text-xs text-[#a8a095]">Total Earnings</p>
        </div>

        <div className="bg-[#181512] border border-[#2d2722] p-5 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-[#f59e0b]">
            <Star className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#a8a095]">Rating</span>
          </div>
          <p className="text-2xl font-bold font-heading text-white">5.0 ★</p>
          <p className="text-xs text-[#a8a095]">Customer Feedback Score</p>
        </div>
      </div>
    </div>
  );
}
