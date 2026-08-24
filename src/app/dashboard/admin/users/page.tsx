'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  Users,
  Search,
  Filter,
  Ban,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Shield,
  UserCheck,
  Wrench,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import NeonButton from '@/components/ui/NeonButton';
import { useAdminUsers, useUpdateUserStatus } from '@/hooks/useAdmin';
import { AdminUser } from '@/types/admin';

export default function AdminUsersPage() {
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const limit = 10;

  const { data, isLoading, error, refetch } = useAdminUsers({
    role: roleFilter || undefined,
    status: statusFilter || undefined,
    page,
    limit,
  });

  const updateStatusMutation = useUpdateUserStatus();
  const [userToToggle, setUserToToggle] = useState<AdminUser | null>(null);

  const rawUsers = data?.items || data?.results || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || Math.ceil(total / limit) || 1;

  // Client-side search filtering of current page items
  const filteredUsers = rawUsers.filter((u) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      u.name?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term)
    );
  });

  const handleToggleStatus = async () => {
    if (!userToToggle) return;
    const nextStatus = userToToggle.status === 'BANNED' ? 'ACTIVE' : 'BANNED';

    try {
      await updateStatusMutation.mutateAsync({ id: userToToggle.id, status: nextStatus });
      toast.success(
        `User ${userToToggle.name} has been ${nextStatus === 'BANNED' ? 'banned' : 'unbanned'}.`
      );
      setUserToToggle(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update user status');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1 border-b border-[#2d2722] pb-6">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-[#5eead4]" />
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
            User Administration
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-[#a8a095]">
          Manage registered customer, technician, and admin accounts across the platform.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#181512] border border-[#2d2722] p-4 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#a8a095] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#12100e] border border-[#2d2722] text-xs text-white placeholder-[#6b6359] focus:border-[#5eead4] focus:outline-none transition-colors"
          />
        </div>

        {/* Role & Status Dropdowns */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-[#fbbf24]" />
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 rounded-xl bg-[#12100e] border border-[#2d2722] text-xs text-white focus:border-[#fbbf24] focus:outline-none transition-colors"
            >
              <option value="">All Roles</option>
              <option value="CUSTOMER">Customer</option>
              <option value="TECHNICIAN">Technician</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-xl bg-[#12100e] border border-[#2d2722] text-xs text-white focus:border-[#fbbf24] focus:outline-none transition-colors"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="BANNED">Banned</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <div className="bg-[#181512] border border-[#2d2722] rounded-2xl p-6 space-y-4 animate-pulse">
          <div className="h-12 bg-[#221e1a] rounded-xl" />
          <div className="h-12 bg-[#221e1a] rounded-xl" />
          <div className="h-12 bg-[#221e1a] rounded-xl" />
        </div>
      ) : error ? (
        <div className="bg-[#181512] border border-red-900/40 p-8 rounded-2xl text-center space-y-3">
          <AlertTriangle className="w-8 h-8 text-red-400 mx-auto" />
          <p className="text-sm font-semibold text-white">Unable to load platform users</p>
          <p className="text-xs text-[#a8a095]">
            {error instanceof Error ? error.message : 'Error fetching user list.'}
          </p>
          <NeonButton variant="primary" size="sm" onClick={() => refetch()} icon={<RotateCcw className="w-3.5 h-3.5" />}>
            Try Again
          </NeonButton>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-[#181512] border border-[#2d2722] p-12 rounded-2xl text-center text-[#a8a095]">
          No user accounts found matching your filters.
        </div>
      ) : (
        <div className="bg-[#181512] border border-[#2d2722] rounded-2xl overflow-hidden shadow-lg space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#d4ceb8]">
              <thead className="bg-[#12100e] text-[#a8a095] uppercase tracking-wider font-heading font-semibold border-b border-[#2d2722]">
                <tr>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Joined Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2d2722]/60">
                {filteredUsers.map((user) => {
                  const isBanned = user.status === 'BANNED';
                  const joinedDate = new Date(user.createdAt).toLocaleDateString();

                  return (
                    <tr key={user.id} className="hover:bg-[#221e1a]/50 transition-colors">
                      <td className="py-4 px-4 font-semibold text-white font-heading">
                        {user.name}
                      </td>
                      <td className="py-4 px-4 text-[#a8a095]">{user.email}</td>
                      <td className="py-4 px-4">
                        {user.role === 'ADMIN' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-950/60 text-[#fbbf24] border border-amber-800/60 font-semibold text-[11px]">
                            <Shield className="w-3 h-3 text-[#fbbf24]" /> ADMIN
                          </span>
                        )}
                        {user.role === 'TECHNICIAN' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-950/60 text-[#5eead4] border border-teal-800/60 font-semibold text-[11px]">
                            <Wrench className="w-3 h-3 text-[#5eead4]" /> TECHNICIAN
                          </span>
                        )}
                        {user.role === 'CUSTOMER' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#221e1a] text-[#d4ceb8] border border-[#2d2722] font-semibold text-[11px]">
                            <UserCheck className="w-3 h-3 text-[#a8a095]" /> CUSTOMER
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {isBanned ? (
                          <span className="inline-flex items-center gap-1 text-red-400 font-semibold">
                            <Ban className="w-3.5 h-3.5 text-red-500" /> Banned
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[#5eead4] font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#14b8a6]" /> Active
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-[#a8a095] whitespace-nowrap">
                        {joinedDate}
                      </td>
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        {user.role === 'ADMIN' ? (
                          <span className="text-[11px] text-[#6b6359] italic">Protected</span>
                        ) : (
                          <NeonButton
                            variant={isBanned ? 'secondary' : 'danger'}
                            size="sm"
                            onClick={() => setUserToToggle(user)}
                          >
                            {isBanned ? 'Unban Account' : 'Ban User'}
                          </NeonButton>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="p-4 border-t border-[#2d2722] flex items-center justify-between text-xs text-[#a8a095]">
            <span>
              Showing Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({total} total users)
            </span>
            <div className="flex items-center gap-2">
              <NeonButton
                variant="ghost"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                icon={<ChevronLeft className="w-3.5 h-3.5" />}
              >
                Previous
              </NeonButton>
              <NeonButton
                variant="ghost"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                icon={<ChevronRight className="w-3.5 h-3.5" />}
              >
                Next
              </NeonButton>
            </div>
          </div>
        </div>
      )}

      {/* Custom Ban / Unban Confirmation Modal */}
      {userToToggle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-[#181512] border border-[#2d2722] rounded-2xl p-6 shadow-2xl text-center space-y-5 overflow-hidden">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${
              userToToggle.status === 'BANNED'
                ? 'bg-teal-950/60 border border-teal-800/50 text-[#5eead4]'
                : 'bg-red-950/60 border border-red-800/50 text-red-400'
            }`}>
              <Ban className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold font-heading text-white">
                {userToToggle.status === 'BANNED' ? 'Unban Account?' : 'Ban User Account?'}
              </h3>
              <p className="text-xs text-[#a8a095]">
                {userToToggle.status === 'BANNED'
                  ? `Are you sure you want to restore active status for user "${userToToggle.name}"?`
                  : `Are you sure you want to ban user "${userToToggle.name}"? Banned users are prevented from signing in.`}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <NeonButton variant="ghost" size="sm" onClick={() => setUserToToggle(null)}>
                Cancel
              </NeonButton>
              <NeonButton
                variant={userToToggle.status === 'BANNED' ? 'primary' : 'danger'}
                size="sm"
                onClick={handleToggleStatus}
                disabled={updateStatusMutation.isPending}
                loading={updateStatusMutation.isPending}
              >
                {userToToggle.status === 'BANNED' ? 'Confirm Unban' : 'Confirm Ban'}
              </NeonButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
