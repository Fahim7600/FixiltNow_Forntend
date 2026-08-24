import React from 'react';
import { SkeletonServiceCard } from '@/components/catalog/SkeletonCard';

export default function ServicesLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="h-8 w-64 bg-[#221e1a] rounded-lg animate-pulse" />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="h-96 bg-[#181512] rounded-2xl animate-pulse" />
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonServiceCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
