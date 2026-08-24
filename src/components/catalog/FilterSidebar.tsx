'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, MapPin, DollarSign, ArrowUpDown, RotateCcw } from 'lucide-react';
import { useCategories } from '@/hooks/useCatalog';

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data: categories = [], isLoading: loadingCategories } = useCategories();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [categoryId, setCategoryId] = useState(searchParams.get('categoryId') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'newest');

  // Sync state with URL params when URL changes externally
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setCategoryId(searchParams.get('categoryId') || '');
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    setLocation(searchParams.get('location') || '');
    setSortBy(searchParams.get('sortBy') || 'newest');
  }, [searchParams]);

  const updateUrlParams = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, val]) => {
      if (val) {
        params.set(key, val);
      } else {
        params.delete(key);
      }
    });

    // Reset page to 1 whenever filters change
    params.delete('page');

    router.push(`/services?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrlParams({ search, categoryId, minPrice, maxPrice, location, sortBy });
  };

  const handleReset = () => {
    setSearch('');
    setCategoryId('');
    setMinPrice('');
    setMaxPrice('');
    setLocation('');
    setSortBy('newest');
    router.push('/services');
  };

  return (
    <aside className="bg-[#181512] border border-[#2d2722] p-5 rounded-2xl space-y-6">
      <div className="flex items-center justify-between border-b border-[#2d2722] pb-3">
        <div className="flex items-center gap-2 text-white font-heading font-bold text-base">
          <Filter className="w-4 h-4 text-[#f59e0b]" />
          Filter Services
        </div>
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1 text-xs text-[#a8a095] hover:text-[#fbbf24] transition-colors"
          title="Reset Filters"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      <form onSubmit={handleSearchSubmit} className="space-y-4">
        {/* Search */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#d4ceb8] font-heading">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a8a095]" />
            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#12100e] border border-[#2d2722] text-sm text-white placeholder-[#6b6359] focus:border-[#f59e0b] focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#d4ceb8] font-heading">
            Category
          </label>
          <select
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              updateUrlParams({ search, categoryId: e.target.value, minPrice, maxPrice, location, sortBy });
            }}
            disabled={loadingCategories}
            className="w-full px-3 py-2 rounded-xl bg-[#12100e] border border-[#2d2722] text-sm text-white focus:border-[#f59e0b] focus:outline-none transition-colors cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#d4ceb8] font-heading flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#f59e0b]" /> Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              updateUrlParams({ search, categoryId, minPrice, maxPrice, location, sortBy: e.target.value });
            }}
            className="w-full px-3 py-2 rounded-xl bg-[#12100e] border border-[#2d2722] text-sm text-white focus:border-[#f59e0b] focus:outline-none transition-colors cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>

        {/* Price Range */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#d4ceb8] font-heading flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-[#5eead4]" /> Price Range
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min ($)"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#12100e] border border-[#2d2722] text-xs text-white placeholder-[#6b6359] focus:border-[#5eead4] focus:outline-none transition-colors"
            />
            <input
              type="number"
              placeholder="Max ($)"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#12100e] border border-[#2d2722] text-xs text-white placeholder-[#6b6359] focus:border-[#5eead4] focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#d4ceb8] font-heading flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#fbbf24]" /> Location
          </label>
          <input
            type="text"
            placeholder="City or area..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#12100e] border border-[#2d2722] text-sm text-white placeholder-[#6b6359] focus:border-[#fbbf24] focus:outline-none transition-colors"
          />
        </div>

        {/* Apply Filters Button */}
        <button
          type="submit"
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#b45309] via-[#f59e0b] to-[#fbbf24] text-black font-bold font-heading text-xs tracking-wide shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer"
        >
          Apply Filters
        </button>
      </form>
    </aside>
  );
}
