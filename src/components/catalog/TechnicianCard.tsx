import React from 'react';
import Link from 'next/link';
import { Star, MapPin, Award, ArrowRight } from 'lucide-react';
import { TechnicianSummary } from '@/types/catalog';
import { formatCurrency, formatRating } from '@/lib/format';

export interface TechnicianCardProps {
  technician: TechnicianSummary;
}

export default function TechnicianCard({ technician }: TechnicianCardProps) {
  const name = technician.user?.name || 'Pro Technician';
  const rating = formatRating(technician.avgRating);
  const reviewsCount = technician.totalReviews || 0;
  const skills = Array.isArray(technician.skills) ? technician.skills : [];

  return (
    <div className="group bg-[#181512] border border-[#2d2722] rounded-2xl p-5 hover:border-[#14b8a6]/50 hover:shadow-[0_0_25px_rgba(20,184,166,0.15)] transition-all duration-300 flex flex-col justify-between">
      <div className="space-y-4">
        {/* Top: Avatar, Name & Rate */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0f766e] via-[#14b8a6] to-[#5eead4] flex items-center justify-center text-white font-bold font-heading text-lg shadow-[0_0_12px_rgba(20,184,166,0.3)]">
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-base font-bold font-heading text-white group-hover:text-[#5eead4] transition-colors">
                {name}
              </h3>
              {technician.location && (
                <div className="flex items-center gap-1 text-xs text-[#a8a095] mt-0.5">
                  <MapPin className="w-3 h-3 text-[#14b8a6]" />
                  <span>{technician.location}</span>
                </div>
              )}
            </div>
          </div>

          {technician.hourlyRate && (
            <div className="text-right">
              <span className="text-xs text-[#a8a095] block">Hourly</span>
              <span className="text-base font-bold font-heading text-[#5eead4]">
                {formatCurrency(technician.hourlyRate)}
              </span>
            </div>
          )}
        </div>

        {/* Rating & Experience */}
        <div className="flex items-center gap-4 text-xs bg-[#12100e] p-2.5 rounded-xl border border-[#2d2722]">
          <div className="flex items-center gap-1 text-[#fbbf24] font-semibold">
            <Star className="w-3.5 h-3.5 fill-[#fbbf24]" />
            <span>{rating}</span>
            <span className="text-[#a8a095] font-normal">({reviewsCount})</span>
          </div>

          {technician.experienceYears !== undefined && (
            <div className="flex items-center gap-1 text-[#d4ceb8]">
              <Award className="w-3.5 h-3.5 text-[#f59e0b]" />
              <span>{technician.experienceYears} yrs exp</span>
            </div>
          )}
        </div>

        {/* Bio excerpt */}
        {technician.bio && (
          <p className="text-xs text-[#a8a095] line-clamp-2 leading-relaxed">
            {technician.bio}
          </p>
        )}

        {/* Skills Pills */}
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {skills.slice(0, 4).map((skill, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#221e1a] text-[#d4ceb8] border border-[#2d2722]"
              >
                {skill}
              </span>
            ))}
            {skills.length > 4 && (
              <span className="px-1.5 py-0.5 rounded-md text-[10px] text-[#a8a095]">
                +{skills.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Link */}
      <div className="pt-4 mt-4 border-t border-[#2d2722] flex items-center justify-between">
        <span className="text-xs text-[#14b8a6] font-semibold group-hover:underline">
          View Profile & Services
        </span>
        <Link
          href={`/technicians/${technician.id}`}
          className="inline-flex items-center justify-center p-2 rounded-xl bg-[#221e1a] text-[#5eead4] hover:bg-[#14b8a6] hover:text-black transition-all group-hover:translate-x-0.5"
        >
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
