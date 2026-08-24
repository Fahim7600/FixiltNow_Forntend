'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { User as UserIcon, Calendar, Clock, Wrench } from 'lucide-react';

export default function CustomerDashboardPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-[#a8a095]">
        Loading customer dashboard...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-[#181512] border border-[#2d2722] p-6 sm:p-8 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#b45309] via-[#f59e0b] to-[#fbbf24]" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#221e1a] text-[#fbbf24] text-xs font-semibold border border-[#f59e0b]/30">
              <UserIcon className="w-3.5 h-3.5" /> Customer Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
              Welcome, {user?.name || 'Valued Customer'}!
            </h1>
            <p className="text-sm text-[#a8a095]">
              Manage your home service bookings, track active technicians, and review past repairs.
            </p>
          </div>
        </div>
      </div>

      {/* Grid Stats Placeholders */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#181512] border border-[#2d2722] p-5 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-[#f59e0b]">
            <Calendar className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#a8a095]">Active</span>
          </div>
          <p className="text-2xl font-bold font-heading text-white">0</p>
          <p className="text-xs text-[#a8a095]">Scheduled Bookings</p>
        </div>

        <div className="bg-[#181512] border border-[#2d2722] p-5 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-[#5eead4]">
            <Clock className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#a8a095]">Completed</span>
          </div>
          <p className="text-2xl font-bold font-heading text-white">0</p>
          <p className="text-xs text-[#a8a095]">Finished Services</p>
        </div>

        <div className="bg-[#181512] border border-[#2d2722] p-5 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-[#fbbf24]">
            <Wrench className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#a8a095]">Saved</span>
          </div>
          <p className="text-2xl font-bold font-heading text-white">0</p>
          <p className="text-xs text-[#a8a095]">Favorite Techs</p>
        </div>
      </div>
    </div>
  );
}
