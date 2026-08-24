'use client';

import React from 'react';
import Link from 'next/link';
import { Wrench, ShieldCheck, Zap, ArrowRight, Star, CheckCircle } from 'lucide-react';
import NeonButton from '@/components/ui/NeonButton';
import ServiceCard from '@/components/catalog/ServiceCard';
import TechnicianCard from '@/components/catalog/TechnicianCard';
import { SkeletonServiceCard, SkeletonTechnicianCard } from '@/components/catalog/SkeletonCard';
import { useServices, useTechnicians } from '@/hooks/useCatalog';

export default function Home() {
  const { data: servicesData, isLoading: loadingServices, error: servicesError } = useServices({ limit: 6 });
  const { data: techsData, isLoading: loadingTechs, error: techsError } = useTechnicians({ limit: 4 });

  const services = servicesData?.items || [];
  const technicians = techsData?.items || [];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8 text-center border-b border-[#2d2722]/60">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#f59e0b]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#14b8a6]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#221e1a] border border-[#f59e0b]/30 text-xs font-semibold text-[#fbbf24] shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Zap className="w-3.5 h-3.5 fill-[#fbbf24]" />
            Instant Home Repairs & Service Marketplace
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-heading text-white leading-tight">
            Expert Technicians, <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#b45309] via-[#f59e0b] to-[#fbbf24] bg-clip-text text-transparent">
              Sparked & Delivered
            </span>{' '}
            to Your Door
          </h1>

          <p className="text-lg sm:text-xl text-[#a8a095] max-w-2xl mx-auto leading-relaxed">
            FixItNow connects homeowners with certified, background-checked pros for electrical, plumbing, HVAC, and emergency repairs.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/services">
              <NeonButton variant="primary" size="lg" icon={<Wrench className="w-5 h-5" />}>
                Browse Services
              </NeonButton>
            </Link>
            <Link href="/auth/register">
              <NeonButton variant="secondary" size="lg" icon={<ShieldCheck className="w-5 h-5" />}>
                Become a Technician
              </NeonButton>
            </Link>
          </div>

          {/* Value Badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-[#d4ceb8]">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-[#f59e0b]" /> 100% Satisfaction Guarantee
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-[#5eead4]" /> Upfront Pricing
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-[#fbbf24]" /> Verified Background Checks
            </span>
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-[#2d2722] pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#f59e0b] font-heading">
              Popular Solutions
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white mt-1">
              Featured Home Services
            </h2>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#fbbf24] hover:underline"
          >
            Explore All Services <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loadingServices ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonServiceCard key={i} />
            ))}
          </div>
        ) : servicesError ? (
          <div className="bg-[#181512] border border-[#2d2722] p-8 rounded-2xl text-center space-y-2">
            <p className="text-red-400 font-semibold">Unable to load featured services</p>
            <p className="text-xs text-[#a8a095]">Please check your connection or try again later.</p>
          </div>
        ) : services.length === 0 ? (
          <div className="bg-[#181512] border border-[#2d2722] p-8 rounded-2xl text-center space-y-2">
            <p className="text-[#f5f2eb] font-semibold">No services available right now</p>
            <p className="text-xs text-[#a8a095]">Check back soon as our technician network expands.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </section>

      {/* Top Rated Technicians Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-[#2d2722] pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#5eead4] font-heading flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-[#5eead4]" /> Top Performers
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white mt-1">
              Featured Technicians
            </h2>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#5eead4] hover:underline"
          >
            Find Local Pros <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loadingTechs ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonTechnicianCard key={i} />
            ))}
          </div>
        ) : techsError ? (
          <div className="bg-[#181512] border border-[#2d2722] p-8 rounded-2xl text-center space-y-2">
            <p className="text-red-400 font-semibold">Unable to load technicians</p>
            <p className="text-xs text-[#a8a095]">Please check your connection or try again later.</p>
          </div>
        ) : technicians.length === 0 ? (
          <div className="bg-[#181512] border border-[#2d2722] p-8 rounded-2xl text-center space-y-2">
            <p className="text-[#f5f2eb] font-semibold">No technicians available right now</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {technicians.map((tech) => (
              <TechnicianCard key={tech.id} technician={tech} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
