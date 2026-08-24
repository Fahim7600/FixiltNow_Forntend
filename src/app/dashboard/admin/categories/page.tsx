'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  Tag,
  Plus,
  AlertTriangle,
  RotateCcw,
  X,
  FileText,
} from 'lucide-react';
import NeonButton from '@/components/ui/NeonButton';
import { useAdminCategories, useCreateCategory } from '@/hooks/useAdmin';
import { Category } from '@/types/catalog';

export default function AdminCategoriesPage() {
  const { data: categories = [], isLoading, error, refetch } = useAdminCategories();
  const createMutation = useCreateCategory();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);

  const openModal = () => {
    setName('');
    setDescription('');
    setNameError(null);
    setIsModalOpen(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameError(null);

    const trimmedName = name.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setNameError('Category name must be at least 2 characters.');
      return;
    }

    try {
      await createMutation.mutateAsync({
        name: trimmedName,
        description: description.trim() || undefined,
      });

      toast.success(`Category "${trimmedName}" created successfully!`);
      setIsModalOpen(false);
    } catch (err: any) {
      const errMsg = err.message || 'Failed to create category';
      if (
        errMsg.toLowerCase().includes('already exists') ||
        errMsg.toLowerCase().includes('duplicate')
      ) {
        setNameError(errMsg);
      }
      toast.error(errMsg);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#2d2722] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Tag className="w-6 h-6 text-[#fbbf24]" />
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
              Category Catalog Management
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#a8a095]">
            Create and oversee home repair service categories available on the platform.
          </p>
        </div>

        <NeonButton variant="primary" size="md" onClick={openModal} icon={<Plus className="w-4 h-4" />}>
          Add New Category
        </NeonButton>
      </div>

      {/* Categories Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          <div className="h-32 bg-[#181512] rounded-2xl border border-[#2d2722]" />
          <div className="h-32 bg-[#181512] rounded-2xl border border-[#2d2722]" />
          <div className="h-32 bg-[#181512] rounded-2xl border border-[#2d2722]" />
        </div>
      ) : error ? (
        <div className="bg-[#181512] border border-red-900/40 p-8 rounded-2xl text-center space-y-3">
          <AlertTriangle className="w-8 h-8 text-red-400 mx-auto" />
          <p className="text-sm font-semibold text-white">Unable to load categories</p>
          <p className="text-xs text-[#a8a095]">
            {error instanceof Error ? error.message : 'Error fetching categories.'}
          </p>
          <NeonButton variant="primary" size="sm" onClick={() => refetch()} icon={<RotateCcw className="w-3.5 h-3.5" />}>
            Try Again
          </NeonButton>
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-[#181512] border border-[#2d2722] p-12 rounded-2xl text-center text-[#a8a095]">
          No categories exist yet. Click &quot;Add New Category&quot; to create your first category.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat: Category) => (
            <div
              key={cat.id}
              className="bg-[#181512] border border-[#2d2722] p-6 rounded-2xl space-y-3 relative overflow-hidden shadow-lg hover:border-[#f59e0b]/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#fbbf24] font-heading flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#f59e0b]" /> Category
                </span>
                <span className="text-[10px] font-mono text-[#6b6359]">
                  ID: {cat.id.slice(0, 8)}...
                </span>
              </div>

              <h3 className="text-lg font-bold font-heading text-white">
                {cat.name}
              </h3>

              {cat.description ? (
                <p className="text-xs text-[#a8a095] leading-relaxed line-clamp-3">
                  {cat.description}
                </p>
              ) : (
                <p className="text-xs text-[#6b6359] italic">
                  No description provided.
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#181512] border border-[#2d2722] rounded-2xl p-6 shadow-2xl space-y-5 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#b45309] via-[#f59e0b] to-[#fbbf24]" />

            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-[#a8a095] hover:text-white hover:bg-[#221e1a] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#fbbf24] font-heading">
                New Service Domain
              </span>
              <h2 className="text-xl font-bold font-heading text-white">Create Service Category</h2>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              {/* Category Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#d4ceb8] font-heading block">
                  Category Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Electrical & Lighting"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (nameError) setNameError(null);
                  }}
                  required
                  minLength={2}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-[#12100e] border ${
                    nameError ? 'border-red-500' : 'border-[#2d2722]'
                  } text-xs text-white placeholder-[#6b6359] focus:border-[#fbbf24] focus:outline-none transition-colors`}
                />
                {nameError && (
                  <p className="text-[11px] text-red-400 font-medium">{nameError}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#d4ceb8] font-heading flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-[#a8a095]" /> Description (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Summary of services covered under this category..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#12100e] border border-[#2d2722] text-xs text-white placeholder-[#6b6359] focus:border-[#fbbf24] focus:outline-none transition-colors"
                />
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <NeonButton type="button" variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </NeonButton>
                <NeonButton
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={createMutation.isPending}
                  loading={createMutation.isPending}
                  icon={<Plus className="w-4 h-4" />}
                >
                  Create Category
                </NeonButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
