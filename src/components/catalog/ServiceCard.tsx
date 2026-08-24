import React from 'react';
import Link from 'next/link';
import { Star, MapPin, Wrench, ArrowRight } from 'lucide-react';
import { ServiceItem } from '@/types/catalog';
import { formatCurrency, formatRating } from '@/lib/format';

export interface ServiceCardProps {
  service: ServiceItem;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const tech = service.technicianProfile;
  const techName = tech?.user?.name || 'Verified Technician';
  const techId = service.technicianProfileId;
  const categoryName = service.category?.name || 'Home Repair';

  return (
    <div className="group relative bg-[#181512] border border-[#2d2722] rounded-2xl p-5 hover:border-[#f59e0b]/50 hover:shadow-[0_0_25px_rgba(245,158,11,0.15)] transition-all duration-300 flex flex-col justify-between overflow-hidden">
      <div className="space-y-3">
        {/* Header: Category Badge & Price */}
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#221e1a] text-[#fbbf24] border border-[#f59e0b]/30">
            <Wrench className="w-3 h-3 text-[#f59e0b]" />
            {categoryName}
          </span>
          <span className="text-lg font-bold font-heading text-white bg-gradient-to-r from-[#b45309] to-[#fbbf24] bg-clip-text text-transparent">
            {formatCurrency(service.price)}
          </span>
        </div>

        {/* Service Title */}
        <h3 className="text-lg font-bold font-heading text-white group-hover:text-[#fbbf24] transition-colors line-clamp-1">
          {service.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-[#a8a095] line-clamp-2 leading-relaxed">
          {service.description}
        </p>
      </div>

      {/* Footer: Technician Info & CTA Link */}
      <div className="pt-4 mt-4 border-t border-[#2d2722] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#b45309] to-[#f59e0b] flex items-center justify-center text-white text-xs font-bold shrink-0">
            {techName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[#f5f2eb] truncate">{techName}</p>
            {tech && (
              <div className="flex items-center gap-2 text-[11px] text-[#a8a095]">
                <span className="flex items-center gap-0.5 text-[#fbbf24]">
                  <Star className="w-3 h-3 fill-[#fbbf24]" />
                  {formatRating(tech.avgRating)}
                </span>
                {tech.location && (
                  <span className="flex items-center gap-0.5 truncate">
                    <MapPin className="w-3 h-3 shrink-0" />
                    {tech.location}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <Link
          href={`/technicians/${techId}`}
          className="inline-flex items-center justify-center p-2 rounded-xl bg-[#221e1a] text-[#fbbf24] hover:bg-[#f59e0b] hover:text-black transition-all shrink-0 group-hover:translate-x-0.5"
          title="View Technician & Book"
        >
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
