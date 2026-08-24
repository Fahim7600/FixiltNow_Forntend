'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Wrench, RotateCcw, AlertTriangle } from 'lucide-react';
import FilterSidebar from '@/components/catalog/FilterSidebar';
import ServiceCard from '@/components/catalog/ServiceCard';
import Pagination from '@/components/catalog/Pagination';
import { SkeletonServiceCard } from '@/components/catalog/SkeletonCard';
import NeonButton from '@/components/ui/NeonButton';
import { useServices } from '@/hooks/useCatalog';
import { ServicesFilter } from '@/types/catalog';

function ServicesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get('page')) || 1;
  const categoryId = searchParams.get('categoryId') || undefined;
  const search = searchParams.get('search') || undefined;
  const minPrice = searchParams.get('minPrice') || undefined;
  const maxPrice = searchParams.get('maxPrice') || undefined;
  const location = searchParams.get('location') || undefined;
  const sortBy = (searchParams.get('sortBy') as ServicesFilter['sortBy']) || 'newest';

  const filterParams: ServicesFilter = {
    page,
    limit: 9,
    categoryId,
    search,
    minPrice,
    maxPrice,
    location,
    sortBy,
  };

  const { data, isLoading, error, refetch } = useServices(filterParams);

  const services = data?.items || [];
  const totalPages = data?.totalPages || 1;
  const totalItems = data?.total || 0;

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    router.push(`/services?${params.toString()}`);
  };

  const handleResetFilters = () => {
    router.push('/services');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b border-[#2d2722] pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#221e1a] text-[#fbbf24] text-xs font-semibold border border-[#f59e0b]/30">
          <Wrench className="w-3.5 h-3.5 text-[#f59e0b]" /> On-Demand Catalog
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-white">
          Browse Home Services
        </h1>
        <p className="text-sm text-[#a8a095] max-w-2xl">
          Filter by category, price, and location to connect with certified local technicians.
        </p>
      </div>

      {/* Main Grid Layout: Sidebar + Services */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <FilterSidebar />
        </div>

        {/* Catalog Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Results Count Bar */}
          {!isLoading && !error && (
            <div className="flex items-center justify-between text-xs text-[#a8a095] bg-[#181512] px-4 py-2.5 rounded-xl border border-[#2d2722]">
              <span>
                Showing <strong className="text-white">{services.length}</strong> of{' '}
                <strong className="text-[#fbbf24]">{totalItems}</strong> services
              </span>
              {(categoryId || search || minPrice || maxPrice || location) && (
                <button
                  onClick={handleResetFilters}
                  className="text-[#fbbf24] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  Clear active filters
                </button>
              )}
            </div>
          )}

          {/* Loading Skeletons */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, i) => (
                <SkeletonServiceCard key={i} />
              ))}
            </div>
          ) : error ? (
            /* Error State */
            <div className="bg-[#181512] border border-red-900/40 p-8 sm:p-12 rounded-2xl text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-950/60 border border-red-800/50 flex items-center justify-center text-red-400 mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold font-heading text-white">
                  Unable to load services
                </h3>
                <p className="text-xs text-[#a8a095] max-w-md mx-auto">
                  {error instanceof Error ? error.message : 'A server error occurred while retrieving catalog services.'}
                </p>
              </div>
              <NeonButton variant="primary" size="sm" onClick={() => refetch()} icon={<RotateCcw className="w-3.5 h-3.5" />}>
                Try Again
              </NeonButton>
            </div>
          ) : services.length === 0 ? (
            /* Empty State */
            <div className="bg-[#181512] border border-[#2d2722] p-8 sm:p-12 rounded-2xl text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#221e1a] border border-[#f59e0b]/30 flex items-center justify-center text-[#fbbf24] mx-auto">
                <Wrench className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold font-heading text-white">
                  No matching services found
                </h3>
                <p className="text-xs text-[#a8a095] max-w-md mx-auto">
                  We couldn&apos;t find any services matching your search or price criteria. Try adjusting your filters.
                </p>
              </div>
              <NeonButton variant="secondary" size="sm" onClick={handleResetFilters} icon={<RotateCcw className="w-3.5 h-3.5" />}>
                Reset All Filters
              </NeonButton>
            </div>
          ) : (
            /* Service Grid */
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-[#a8a095]">
          Loading catalog...
        </div>
      }
    >
      <ServicesContent />
    </Suspense>
  );
}
