'use client';

import React, { use, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  MapPin,
  Award,
  Wrench,
  Calendar,
  MessageSquare,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import NeonButton from '@/components/ui/NeonButton';
import BookingModal from '@/components/booking/BookingModal';
import StarRating from '@/components/review/StarRating';
import { useTechnician } from '@/hooks/useCatalog';
import { useAuth } from '@/lib/auth-context';
import { formatCurrency, formatRating } from '@/lib/format';
import { ServiceItem } from '@/types/catalog';
import TechnicianLoading from './loading';

export default function TechnicianProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { data: tech, isLoading, error } = useTechnician(id);

  if (isLoading) {
    return <TechnicianLoading />;
  }

  if (error || !tech) {
    notFound();
  }

  const name = tech.user?.name || 'Pro Technician';
  const ratingNum = typeof tech.avgRating === 'number' ? tech.avgRating : Number(tech.avgRating || 0);
  const ratingText = formatRating(tech.avgRating);
  const reviewsCount = tech.totalReviews || 0;
  const skills = Array.isArray(tech.skills) ? tech.skills : [];
  const services = Array.isArray(tech.services) ? tech.services.filter((s) => s.isActive) : [];
  const reviews = Array.isArray(tech.reviews) ? tech.reviews : [];

  const handleBookClick = (service: ServiceItem) => {
    if (!isAuthenticated) {
      toast.info('Please sign in to book a service');
      router.push(`/auth/login?redirect=/technicians/${id}`);
      return;
    }

    if (user?.role !== 'CUSTOMER') {
      toast.error('Only customer accounts can book services.');
      return;
    }

    setSelectedService(service);
    setModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Profile Header Banner */}
      <div className="bg-[#181512] border border-[#2d2722] p-6 sm:p-8 rounded-2xl relative overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.4)]">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0f766e] via-[#14b8a6] to-[#5eead4]" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-[#0f766e] via-[#14b8a6] to-[#5eead4] flex items-center justify-center text-white font-bold font-heading text-3xl shadow-[0_0_20px_rgba(20,184,166,0.35)] shrink-0">
              {name.charAt(0).toUpperCase()}
            </div>

            {/* Info */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
                  {name}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#14b8a6]/10 text-[#5eead4] text-xs font-semibold border border-[#14b8a6]/30">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Pro
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-[#a8a095]">
                <div className="flex items-center gap-1.5 font-bold">
                  <StarRating value={ratingNum} size={16} />
                  <span className="text-[#fbbf24] font-heading">{ratingText}</span>
                  <span className="text-[#a8a095] font-normal">({reviewsCount} reviews)</span>
                </div>

                {tech.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#14b8a6]" />
                    {tech.location}
                  </span>
                )}

                {tech.experienceYears !== undefined && (
                  <span className="flex items-center gap-1 text-[#d4ceb8]">
                    <Award className="w-3.5 h-3.5 text-[#f59e0b]" />
                    {tech.experienceYears} Years Experience
                  </span>
                )}
              </div>

              {/* Skills Pills */}
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#221e1a] text-[#5eead4] border border-[#14b8a6]/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Hourly Rate Card */}
          {tech.hourlyRate && (
            <div className="bg-[#12100e] border border-[#2d2722] p-4 rounded-xl text-right shrink-0 w-full md:w-auto">
              <span className="text-xs text-[#a8a095] block uppercase font-heading tracking-wider">
                Standard Hourly Rate
              </span>
              <span className="text-2xl font-extrabold font-heading text-[#5eead4]">
                {formatCurrency(tech.hourlyRate)}
              </span>
              <span className="text-[11px] text-[#a8a095] block mt-0.5">
                Transparent & Upfront Billing
              </span>
            </div>
          )}
        </div>

        {/* Bio */}
        {tech.bio && (
          <div className="mt-6 pt-6 border-t border-[#2d2722]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#d4ceb8] font-heading mb-1.5">
              About the Technician
            </h3>
            <p className="text-sm text-[#a8a095] leading-relaxed max-w-4xl">
              {tech.bio}
            </p>
          </div>
        )}
      </div>

      {/* Main Grid: Services & Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Active Services List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-[#2d2722] pb-3">
            <h2 className="text-xl font-bold font-heading text-white flex items-center gap-2">
              <Wrench className="w-5 h-5 text-[#f59e0b]" /> Available Services ({services.length})
            </h2>
          </div>

          {services.length === 0 ? (
            <div className="bg-[#181512] border border-[#2d2722] p-8 rounded-2xl text-center text-[#a8a095]">
              No active services listed by this technician at the moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="bg-[#181512] border border-[#2d2722] p-5 rounded-2xl flex flex-col justify-between space-y-4 hover:border-[#f59e0b]/40 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#fbbf24] bg-[#221e1a] px-2.5 py-1 rounded-full border border-[#f59e0b]/20">
                        {service.category?.name || 'Service'}
                      </span>
                      <span className="text-lg font-bold font-heading text-white">
                        {formatCurrency(service.price)}
                      </span>
                    </div>

                    <h3 className="text-base font-bold font-heading text-white">
                      {service.title}
                    </h3>
                    <p className="text-xs text-[#a8a095] line-clamp-2 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <NeonButton
                    variant="primary"
                    size="sm"
                    onClick={() => handleBookClick(service)}
                    icon={<Zap className="w-3.5 h-3.5" />}
                    className="w-full justify-center"
                  >
                    Book Now
                  </NeonButton>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Customer Reviews */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#2d2722] pb-3">
            <h2 className="text-xl font-bold font-heading text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#5eead4]" /> Reviews ({reviews.length})
            </h2>
          </div>

          {reviews.length === 0 ? (
            <div className="bg-[#181512] border border-[#2d2722] p-6 rounded-2xl text-center text-xs text-[#a8a095]">
              No reviews recorded yet for this technician.
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => {
                const reviewerName = rev.customerName || rev.customer?.name || 'Verified Customer';
                const revRating = typeof rev.rating === 'number' ? rev.rating : Number(rev.rating || 0);

                return (
                  <div
                    key={rev.id}
                    className="bg-[#181512] border border-[#2d2722] p-4 rounded-xl space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#f5f2eb]">{reviewerName}</span>
                      <StarRating value={revRating} size={14} />
                    </div>

                    <p className="text-xs text-[#a8a095] leading-relaxed italic">
                      &quot;{rev.comment}&quot;
                    </p>

                    {rev.createdAt && (
                      <span className="text-[10px] text-[#6b6359] block flex items-center gap-1 pt-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {selectedService && (
        <BookingModal
          service={selectedService}
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedService(null);
          }}
        />
      )}
    </div>
  );
}
