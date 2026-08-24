'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { Shield, Users, Wrench, Activity } from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-[#a8a095]">
        Loading admin panel...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-[#1c1212] border border-[#dc2626]/30 p-6 sm:p-8 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#991b1b] via-[#dc2626] to-[#f87171]" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#dc2626]/10 text-[#f87171] text-xs font-semibold border border-[#dc2626]/30">
              <Shield className="w-3.5 h-3.5" /> System Admin Control
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
              Welcome, {user?.name || 'Administrator'}!
            </h1>
            <p className="text-sm text-[#a8a095]">
              Marketplace operations dashboard. Monitor users, verify technician applications, and oversee platform activity.
            </p>
          </div>
        </div>
      </div>

      {/* Grid Stats Placeholders */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#181512] border border-[#2d2722] p-5 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-[#f87171]">
            <Users className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#a8a095]">Users</span>
          </div>
          <p className="text-2xl font-bold font-heading text-[#f5f2eb]">0</p>
          <p className="text-xs text-[#a8a095]">Registered Accounts</p>
        </div>

        <div className="bg-[#181512] border border-[#2d2722] p-5 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-[#5eead4]">
            <Wrench className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#a8a095]">Pending</span>
          </div>
          <p className="text-2xl font-bold font-heading text-[#f5f2eb]">0</p>
          <p className="text-xs text-[#a8a095]">Technician Approvals</p>
        </div>

        <div className="bg-[#181512] border border-[#2d2722] p-5 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-[#fbbf24]">
            <Activity className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#a8a095]">Health</span>
          </div>
          <p className="text-2xl font-bold font-heading text-emerald-400">100%</p>
          <p className="text-xs text-[#a8a095]">System Status OK</p>
        </div>
      </div>
    </div>
  );
}
