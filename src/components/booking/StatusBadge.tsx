import React from 'react';
import { BookingStatus } from '@/types/booking';
import { Clock, CheckCircle2, XCircle, CreditCard, PlayCircle, CheckCheck, Ban } from 'lucide-react';

export interface StatusBadgeProps {
  status: BookingStatus;
  className?: string;
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const config: Record<
    BookingStatus,
    { label: string; style: string; icon: React.ReactNode }
  > = {
    REQUESTED: {
      label: 'Requested',
      style: 'bg-[#221e1a] text-[#fbbf24] border-[#f59e0b]/40',
      icon: <Clock className="w-3 h-3 text-[#f59e0b]" />,
    },
    ACCEPTED: {
      label: 'Accepted',
      style: 'bg-[#0f172a] text-[#38bdf8] border-[#0284c7]/40',
      icon: <CheckCircle2 className="w-3 h-3 text-[#38bdf8]" />,
    },
    DECLINED: {
      label: 'Declined',
      style: 'bg-[#1c1212] text-[#f87171] border-[#dc2626]/40',
      icon: <XCircle className="w-3 h-3 text-[#f87171]" />,
    },
    PAID: {
      label: 'Paid',
      style: 'bg-[#2e1065]/40 text-[#c084fc] border-[#7e22ce]/40',
      icon: <CreditCard className="w-3 h-3 text-[#c084fc]" />,
    },
    IN_PROGRESS: {
      label: 'In Progress',
      style: 'bg-[#0f1716] text-[#5eead4] border-[#14b8a6]/40',
      icon: <PlayCircle className="w-3 h-3 text-[#5eead4]" />,
    },
    COMPLETED: {
      label: 'Completed',
      style: 'bg-[#27272a]/60 text-[#a1a1aa] border-[#52525b]/40',
      icon: <CheckCheck className="w-3 h-3 text-[#a1a1aa]" />,
    },
    CANCELLED: {
      label: 'Cancelled',
      style: 'bg-[#450a0a]/50 text-[#ef4444] border-[#991b1b]/40',
      icon: <Ban className="w-3 h-3 text-[#ef4444]" />,
    },
  };

  const item = config[status] || {
    label: status,
    style: 'bg-[#221e1a] text-[#a8a095] border-[#2d2722]',
    icon: null,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold font-heading border transition-colors ${item.style} ${className}`}
    >
      {item.icon}
      <span>{item.label}</span>
    </span>
  );
}
