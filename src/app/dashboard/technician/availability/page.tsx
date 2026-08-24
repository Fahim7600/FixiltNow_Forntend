'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  CalendarDays,
  Clock,
  Plus,
  Trash2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import NeonButton from '@/components/ui/NeonButton';
import { useMyProfile } from '@/hooks/useTechnicianProfile';
import {
  useMyAvailability,
  useAddAvailability,
  useDeleteAvailability,
} from '@/hooks/useAvailability';
import { AvailabilityWindow } from '@/types/technician';

const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export default function TechnicianAvailabilityPage() {
  const { data: profile, isLoading: loadingProfile } = useMyProfile();
  const { data: windows = [], isLoading, error, refetch } = useMyAvailability();
  const addMutation = useAddAvailability();
  const deleteMutation = useDeleteAvailability();

  const [selectedDay, setSelectedDay] = useState<number>(1); // Default Monday
  const [startTime, setStartTime] = useState<string>('09:00');
  const [endTime, setEndTime] = useState<string>('17:00');

  const handleAddWindow = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!startTime || !endTime) {
      toast.error('Please select both start and end times');
      return;
    }

    if (startTime >= endTime) {
      toast.error('End time must be after start time');
      return;
    }

    try {
      await addMutation.mutateAsync({
        dayOfWeek: Number(selectedDay),
        startTime,
        endTime,
      });

      toast.success(`Availability window added for ${DAYS_OF_WEEK[selectedDay]}!`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to add availability window');
    }
  };

  const handleDeleteWindow = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Availability window removed');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete window');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1 border-b border-[#2d2722] pb-6">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-6 h-6 text-[#5eead4]" />
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
            Availability Scheduler
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-[#a8a095]">
          Set your working hours for each day of the week so customers can schedule appointments.
        </p>
      </div>

      {/* Step 1 Profile Missing Banner */}
      {!loadingProfile && !profile && (
        <div className="bg-[#0f1716] border border-[#14b8a6]/40 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#5eead4]">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-[#f59e0b] shrink-0" />
            <span>
              <strong>Step 1 Required: Complete Profile Settings</strong> — Please set your hourly rate and location first under Profile Settings before adding working hours.
            </span>
          </div>
          <Link href="/dashboard/technician/profile" className="shrink-0">
            <NeonButton variant="secondary" size="sm">
              Setup Profile First
            </NeonButton>
          </Link>
        </div>
      )}

      {/* Add Window Form Card */}
      <div className="bg-[#181512] border border-[#2d2722] p-6 rounded-2xl shadow-xl relative overflow-hidden space-y-4">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0f766e] via-[#14b8a6] to-[#5eead4]" />

        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#5eead4] font-heading">
            Add Time Window
          </span>
          <h2 className="text-lg font-bold font-heading text-white">Schedule Working Hours</h2>
        </div>

        <form onSubmit={handleAddWindow} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          {/* Day Selector */}
          <div className="space-y-1.5 sm:col-span-1">
            <label className="text-xs font-semibold text-[#d4ceb8] font-heading block">
              Day of Week
            </label>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#12100e] border border-[#2d2722] text-xs text-white focus:border-[#5eead4] focus:outline-none transition-colors"
            >
              {DAYS_OF_WEEK.map((day, idx) => (
                <option key={idx} value={idx}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          {/* Start Time */}
          <div className="space-y-1.5 sm:col-span-1">
            <label className="text-xs font-semibold text-[#d4ceb8] font-heading block">
              Start Time
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#12100e] border border-[#2d2722] text-xs text-white focus:border-[#5eead4] focus:outline-none transition-colors"
            />
          </div>

          {/* End Time */}
          <div className="space-y-1.5 sm:col-span-1">
            <label className="text-xs font-semibold text-[#d4ceb8] font-heading block">
              End Time
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#12100e] border border-[#2d2722] text-xs text-white focus:border-[#5eead4] focus:outline-none transition-colors"
            />
          </div>

          {/* Submit Action */}
          <div className="sm:col-span-1">
            <NeonButton
              type="submit"
              variant="secondary"
              size="md"
              disabled={addMutation.isPending}
              loading={addMutation.isPending}
              icon={<Plus className="w-4 h-4" />}
              className="w-full justify-center"
            >
              Add Window
            </NeonButton>
          </div>
        </form>
      </div>

      {/* Weekly Schedule Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-7 gap-4 animate-pulse">
          {DAYS_OF_WEEK.map((_, i) => (
            <div key={i} className="h-36 bg-[#181512] rounded-2xl border border-[#2d2722]" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-[#181512] border border-red-900/40 p-8 rounded-2xl text-center space-y-3">
          <AlertTriangle className="w-8 h-8 text-red-400 mx-auto" />
          <p className="text-sm font-semibold text-white">Unable to load availability schedule</p>
          <p className="text-xs text-[#a8a095]">
            {error instanceof Error ? error.message : 'Error fetching schedule.'}
          </p>
          <NeonButton variant="primary" size="sm" onClick={() => refetch()} icon={<RotateCcw className="w-3.5 h-3.5" />}>
            Try Again
          </NeonButton>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-4">
          {DAYS_OF_WEEK.map((dayName, dayIndex) => {
            const dayWindows = windows.filter((w) => Number(w.dayOfWeek) === dayIndex);

            return (
              <div
                key={dayIndex}
                className="bg-[#181512] border border-[#2d2722] p-4 rounded-2xl flex flex-col justify-between space-y-3 shadow-md"
              >
                <div className="border-b border-[#2d2722] pb-2 flex items-center justify-between">
                  <span className="text-xs font-bold font-heading text-white">
                    {dayName}
                  </span>
                  <span className="text-[10px] text-[#5eead4] font-medium">
                    {dayWindows.length} slots
                  </span>
                </div>

                <div className="space-y-2 flex-1 min-h-[80px]">
                  {dayWindows.length === 0 ? (
                    <p className="text-[11px] text-[#6b6359] italic text-center py-4">
                      Unavailable
                    </p>
                  ) : (
                    dayWindows.map((win: AvailabilityWindow) => (
                      <div
                        key={win.id}
                        className="bg-[#12100e] border border-[#2d2722] px-2.5 py-1.5 rounded-xl flex items-center justify-between gap-1 group hover:border-[#14b8a6]/40 transition-colors"
                      >
                        <span className="text-[11px] font-mono text-[#5eead4] flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#14b8a6]" />
                          {win.startTime}–{win.endTime}
                        </span>
                        <button
                          onClick={() => handleDeleteWindow(win.id)}
                          disabled={deleteMutation.isPending}
                          className="text-[#a8a095] hover:text-red-400 p-0.5 rounded cursor-pointer transition-colors"
                          title="Remove Window"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
