import React from 'react';

export function SkeletonServiceCard() {
  return (
    <div className="bg-[#181512] border border-[#2d2722] rounded-2xl p-5 space-y-4 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-5 w-24 bg-[#221e1a] rounded-full" />
        <div className="h-6 w-16 bg-[#221e1a] rounded-md" />
      </div>
      <div className="h-6 w-3/4 bg-[#221e1a] rounded-md" />
      <div className="space-y-1.5">
        <div className="h-3 w-full bg-[#221e1a] rounded" />
        <div className="h-3 w-2/3 bg-[#221e1a] rounded" />
      </div>
      <div className="pt-4 border-t border-[#2d2722] flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#221e1a] rounded-full" />
          <div className="h-4 w-20 bg-[#221e1a] rounded" />
        </div>
        <div className="w-8 h-8 bg-[#221e1a] rounded-xl" />
      </div>
    </div>
  );
}

export function SkeletonTechnicianCard() {
  return (
    <div className="bg-[#181512] border border-[#2d2722] rounded-2xl p-5 space-y-4 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#221e1a] rounded-xl" />
          <div className="space-y-1.5">
            <div className="h-5 w-28 bg-[#221e1a] rounded" />
            <div className="h-3 w-20 bg-[#221e1a] rounded" />
          </div>
        </div>
        <div className="h-5 w-14 bg-[#221e1a] rounded" />
      </div>
      <div className="h-8 w-full bg-[#221e1a] rounded-xl" />
      <div className="h-4 w-full bg-[#221e1a] rounded" />
      <div className="flex gap-2">
        <div className="h-5 w-12 bg-[#221e1a] rounded-md" />
        <div className="h-5 w-16 bg-[#221e1a] rounded-md" />
      </div>
    </div>
  );
}
