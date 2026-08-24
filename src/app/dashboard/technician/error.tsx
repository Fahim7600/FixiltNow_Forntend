'use client';

import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import NeonButton from '@/components/ui/NeonButton';

export default function TechnicianDashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-md mx-auto my-16 p-8 bg-[#181512] border border-red-900/40 rounded-2xl text-center space-y-4 shadow-2xl">
      <div className="w-14 h-14 rounded-full bg-red-950/60 border border-red-800/50 flex items-center justify-center text-red-400 mx-auto">
        <AlertTriangle className="w-7 h-7" />
      </div>
      <div className="space-y-1">
        <h2 className="text-xl font-bold font-heading text-white">Something Went Wrong</h2>
        <p className="text-xs text-[#a8a095]">
          {error?.message || 'An unexpected error occurred in your technician workspace.'}
        </p>
      </div>
      <NeonButton variant="primary" size="sm" onClick={reset} icon={<RotateCcw className="w-4 h-4" />}>
        Try Reloading
      </NeonButton>
    </div>
  );
}
