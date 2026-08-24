import React from 'react';

export default function TechnicianLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-[#181512] border border-[#2d2722] p-8 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="w-20 h-20 bg-[#221e1a] rounded-2xl shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-7 w-48 bg-[#221e1a] rounded" />
            <div className="h-4 w-32 bg-[#221e1a] rounded" />
            <div className="h-4 w-full max-w-lg bg-[#221e1a] rounded" />
          </div>
        </div>
      </div>

      {/* Grid Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-6 w-36 bg-[#221e1a] rounded" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-40 bg-[#181512] rounded-2xl" />
            <div className="h-40 bg-[#181512] rounded-2xl" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-6 w-28 bg-[#221e1a] rounded" />
          <div className="h-32 bg-[#181512] rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
