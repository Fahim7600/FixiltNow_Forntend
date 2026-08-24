'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  Wrench,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  XCircle,
  X,
  ExternalLink,
  Tag,
} from 'lucide-react';
import NeonButton from '@/components/ui/NeonButton';
import { useCategories } from '@/hooks/useCatalog';
import { useMyProfile } from '@/hooks/useTechnicianProfile';
import {
  useMyServices,
  useCreateService,
  useUpdateService,
  useDeleteService,
} from '@/hooks/useTechnicianServices';
import { formatCurrency } from '@/lib/format';
import { Service } from '@/types/technician';

export default function TechnicianServicesPage() {
  const { data: profile, isLoading: loadingProfile } = useMyProfile();
  const { data: services = [], isLoading, error, refetch } = useMyServices();
  const { data: categories = [] } = useCategories();

  const createMutation = useCreateService();
  const updateMutation = useUpdateService();
  const deleteMutation = useDeleteService();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form State
  const [categoryId, setCategoryId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Profile missing error state
  const [profileMissingError, setProfileMissingError] = useState(false);

  // Delete Confirm State
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);

  const openCreateModal = () => {
    setEditingService(null);
    setCategoryId(categories[0]?.id || '');
    setTitle('');
    setDescription('');
    setPrice('');
    setIsActive(true);
    setProfileMissingError(false);
    setIsModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setCategoryId(service.categoryId || service.category?.id || categories[0]?.id || '');
    setTitle(service.title || '');
    setDescription(service.description || '');
    setPrice(String(service.price || ''));
    setIsActive(service.isActive);
    setProfileMissingError(false);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMissingError(false);

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }

    if (!title.trim() || title.trim().length < 3) {
      toast.error('Title must be at least 3 characters');
      return;
    }

    if (!categoryId) {
      toast.error('Please select a category');
      return;
    }

    try {
      if (editingService) {
        await updateMutation.mutateAsync({
          id: editingService.id,
          data: {
            categoryId,
            title: title.trim(),
            description: description.trim() || undefined,
            price: priceNum,
            isActive,
          },
        });
        toast.success('Service updated successfully!');
      } else {
        await createMutation.mutateAsync({
          categoryId,
          title: title.trim(),
          description: description.trim() || undefined,
          price: priceNum,
        });
        toast.success('Service created successfully!');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      const msg = err.message || '';
      if (
        msg.toLowerCase().includes('profile missing') ||
        msg.toLowerCase().includes('profile first')
      ) {
        setProfileMissingError(true);
      } else {
        toast.error(msg || 'Failed to save service');
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (!serviceToDelete) return;
    try {
      await deleteMutation.mutateAsync(serviceToDelete.id);
      toast.success('Service deleted successfully!');
      setServiceToDelete(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete service');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#2d2722] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Wrench className="w-6 h-6 text-[#fbbf24]" />
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
              My Service Listings
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#a8a095]">
            Create and manage the home repair services offered on the marketplace.
          </p>
        </div>

        <NeonButton variant="primary" size="md" onClick={openCreateModal} icon={<Plus className="w-4 h-4" />}>
          Add New Service
        </NeonButton>
      </div>

      {/* Step 1 Profile Missing Banner */}
      {!loadingProfile && !profile && (
        <div className="bg-[#0f1716] border border-[#14b8a6]/40 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#5eead4]">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-[#f59e0b] shrink-0" />
            <span>
              <strong>Step 1 Required: Complete Profile Settings</strong> — Please set your hourly rate and location first under Profile Settings before listing services.
            </span>
          </div>
          <Link href="/dashboard/technician/profile" className="shrink-0">
            <NeonButton variant="secondary" size="sm">
              Setup Profile First
            </NeonButton>
          </Link>
        </div>
      )}

      {/* Services List Table */}
      {isLoading ? (
        <div className="bg-[#181512] border border-[#2d2722] rounded-2xl p-6 space-y-4 animate-pulse">
          <div className="h-12 bg-[#221e1a] rounded-xl" />
          <div className="h-12 bg-[#221e1a] rounded-xl" />
        </div>
      ) : error ? (
        <div className="bg-[#181512] border border-red-900/40 p-8 rounded-2xl text-center space-y-3">
          <AlertTriangle className="w-8 h-8 text-red-400 mx-auto" />
          <p className="text-sm font-semibold text-white">Unable to load your services</p>
          <p className="text-xs text-[#a8a095]">
            {error instanceof Error ? error.message : 'Error fetching services.'}
          </p>
          <NeonButton variant="primary" size="sm" onClick={() => refetch()} icon={<RotateCcw className="w-3.5 h-3.5" />}>
            Try Again
          </NeonButton>
        </div>
      ) : services.length === 0 ? (
        <div className="bg-[#181512] border border-[#2d2722] p-8 sm:p-12 rounded-2xl text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#221e1a] border border-[#f59e0b]/30 flex items-center justify-center text-[#fbbf24] mx-auto">
            <Wrench className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold font-heading text-white">
              No services offered yet
            </h3>
            <p className="text-xs text-[#a8a095] max-w-sm mx-auto">
              Add your first service listing to start receiving booking requests from customers.
            </p>
          </div>
          <NeonButton variant="primary" size="sm" onClick={openCreateModal} icon={<Plus className="w-3.5 h-3.5" />}>
            Create Service
          </NeonButton>
        </div>
      ) : (
        <div className="bg-[#181512] border border-[#2d2722] rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#d4ceb8]">
              <thead className="bg-[#12100e] text-[#a8a095] uppercase tracking-wider font-heading font-semibold border-b border-[#2d2722]">
                <tr>
                  <th className="py-3.5 px-4">Title</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2d2722]/60">
                {services.map((svc) => (
                  <tr key={svc.id} className="hover:bg-[#221e1a]/50 transition-colors">
                    <td className="py-4 px-4 font-semibold text-white font-heading">
                      <div>{svc.title}</div>
                      {svc.description && (
                        <div className="text-[11px] text-[#a8a095] font-normal truncate max-w-xs">
                          {svc.description}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#221e1a] text-[#fbbf24] border border-[#f59e0b]/20 font-medium text-[11px]">
                        <Tag className="w-3 h-3 text-[#f59e0b]" />
                        {svc.category?.name || 'Service Category'}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-bold text-[#5eead4] font-heading">
                      {formatCurrency(svc.price)}
                    </td>
                    <td className="py-4 px-4">
                      {svc.isActive ? (
                        <span className="inline-flex items-center gap-1 text-[#5eead4] font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#14b8a6]" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[#a8a095] font-semibold">
                          <XCircle className="w-3.5 h-3.5 text-[#6b6359]" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => openEditModal(svc)}
                        className="p-1.5 rounded-lg text-[#a8a095] hover:text-[#5eead4] hover:bg-[#221e1a] transition-colors cursor-pointer"
                        title="Edit Service"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setServiceToDelete(svc)}
                        className="p-1.5 rounded-lg text-[#a8a095] hover:text-red-400 hover:bg-[#221e1a] transition-colors cursor-pointer"
                        title="Delete Service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Service Modal */}
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
                {editingService ? 'Edit Listing' : 'New Service'}
              </span>
              <h2 className="text-xl font-bold font-heading text-white">
                {editingService ? 'Update Service Details' : 'Add Service Offering'}
              </h2>
            </div>

            {/* Profile Missing Warning Banner */}
            {profileMissingError && (
              <div className="bg-amber-950/60 border border-amber-800/60 p-4 rounded-xl space-y-2 text-xs text-amber-200">
                <div className="flex items-center gap-2 font-bold font-heading text-amber-400">
                  <AlertTriangle className="w-4 h-4" /> Profile Setup Required
                </div>
                <p className="text-[11px] text-amber-200/80 leading-relaxed">
                  You must complete your technician profile (hourly rate & location) before creating services.
                </p>
                <Link
                  href="/dashboard/technician/profile"
                  onClick={() => setIsModalOpen(false)}
                  className="inline-flex items-center gap-1 font-bold text-[#fbbf24] hover:underline"
                >
                  Go to Profile Setup <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              {/* Category Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#d4ceb8] font-heading block">
                  Service Category *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#12100e] border border-[#2d2722] text-xs text-white focus:border-[#fbbf24] focus:outline-none transition-colors"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#d4ceb8] font-heading block">
                  Service Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Emergency Pipe Leak Repair"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  minLength={3}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#12100e] border border-[#2d2722] text-xs text-white placeholder-[#6b6359] focus:border-[#fbbf24] focus:outline-none transition-colors"
                />
              </div>

              {/* Price Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#d4ceb8] font-heading block">
                  Service Price (USD) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="85.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#12100e] border border-[#2d2722] text-xs text-white placeholder-[#6b6359] focus:border-[#fbbf24] focus:outline-none transition-colors"
                />
              </div>

              {/* Description Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#d4ceb8] font-heading block">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Explain what is included in this service..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#12100e] border border-[#2d2722] text-xs text-white placeholder-[#6b6359] focus:border-[#fbbf24] focus:outline-none transition-colors"
                />
              </div>

              {/* Active Toggle (Edit mode only) */}
              {editingService && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#12100e] border border-[#2d2722]">
                  <span className="text-xs font-semibold text-[#d4ceb8]">
                    Offer Active on Marketplace
                  </span>
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 accent-[#fbbf24] rounded cursor-pointer"
                  />
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <NeonButton type="button" variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </NeonButton>
                <NeonButton
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  loading={createMutation.isPending || updateMutation.isPending}
                >
                  {editingService ? 'Update Service' : 'Save Service'}
                </NeonButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Confirmation Modal for Deletion */}
      {serviceToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-[#181512] border border-red-900/40 rounded-2xl p-6 shadow-2xl text-center space-y-5 overflow-hidden">
            <div className="w-12 h-12 rounded-full bg-red-950/60 border border-red-800/50 flex items-center justify-center text-red-400 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold font-heading text-white">Delete Service Listing?</h3>
              <p className="text-xs text-[#a8a095]">
                Are you sure you want to delete <strong className="text-white">&quot;{serviceToDelete.title}&quot;</strong>? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <NeonButton variant="ghost" size="sm" onClick={() => setServiceToDelete(null)}>
                Cancel
              </NeonButton>
              <NeonButton
                variant="danger"
                size="sm"
                onClick={handleDeleteConfirm}
                disabled={deleteMutation.isPending}
                loading={deleteMutation.isPending}
              >
                Delete
              </NeonButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
