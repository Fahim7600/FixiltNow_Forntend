'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, User as UserIcon, Wrench, Shield, LogIn, LogOut, Loader2 } from 'lucide-react';
import Logo from './Logo';
import NeonButton from '../ui/NeonButton';
import { useAuth } from '@/lib/auth-context';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    router.push('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/dashboard/customer';
    switch (user.role) {
      case 'TECHNICIAN':
        return '/dashboard/technician';
      case 'ADMIN':
        return '/dashboard/admin';
      default:
        return '/dashboard/customer';
    }
  };

  const getDashboardLabel = () => {
    if (!user) return 'Dashboard';
    switch (user.role) {
      case 'TECHNICIAN':
        return 'Tech Portal';
      case 'ADMIN':
        return 'Admin Panel';
      default:
        return 'My Dashboard';
    }
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    ...(isAuthenticated ? [{ href: getDashboardPath(), label: getDashboardLabel() }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#12100e]/85 backdrop-blur-md border-b border-[#2d2722]/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Left: Logo */}
        <Logo size="md" />

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  relative px-4 py-2 text-sm font-medium transition-colors duration-200 font-heading rounded-lg
                  ${isActive ? 'text-[#fbbf24] bg-[#221e1a]' : 'text-[#d4ceb8] hover:text-[#fbbf24] hover:bg-[#181512]'}
                `}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-[#b45309] via-[#f59e0b] to-[#fbbf24] rounded-full shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions / Real Auth State */}
        <div className="hidden md:flex items-center gap-3">
          {isLoading ? (
            <div className="flex items-center justify-center w-24 h-9">
              <Loader2 className="w-4 h-4 animate-spin text-[#f59e0b]" />
            </div>
          ) : isAuthenticated && user ? (
            <div className="flex items-center gap-3 pl-2 border-l border-[#2d2722]">
              {/* Role Badge */}
              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-[#221e1a] text-[#f59e0b] border border-[#f59e0b]/30">
                {user.role === 'ADMIN' ? (
                  <Shield className="w-3 h-3 text-[#f87171]" />
                ) : user.role === 'TECHNICIAN' ? (
                  <Wrench className="w-3 h-3 text-[#5eead4]" />
                ) : (
                  <UserIcon className="w-3 h-3 text-[#fbbf24]" />
                )}
                <span className="capitalize">{user.role.toLowerCase()}</span>
              </span>

              {/* User Avatar & Name */}
              <Link
                href={getDashboardPath()}
                className="group flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#221e1a] transition-all duration-200"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#b45309] to-[#f59e0b] flex items-center justify-center text-white font-bold text-xs shadow-[0_0_10px_rgba(245,158,11,0.3)] group-hover:shadow-[0_0_15px_rgba(251,191,36,0.5)] transition-all">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-sm font-medium text-[#f5f2eb] max-w-[120px] truncate">
                  {user.name}
                </span>
              </Link>

              {/* Logout Button */}
              <NeonButton
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                icon={<LogOut className="w-3.5 h-3.5" />}
                title="Logout"
              >
                Logout
              </NeonButton>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login">
                <NeonButton variant="ghost" size="sm" icon={<LogIn className="w-3.5 h-3.5" />}>
                  Login
                </NeonButton>
              </Link>
              <Link href="/auth/register">
                <NeonButton variant="primary" size="sm">
                  Register
                </NeonButton>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[#d4ceb8] hover:text-[#fbbf24] hover:bg-[#221e1a] transition-colors focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#2d2722] bg-[#12100e]/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3 transition-all">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    px-4 py-2.5 rounded-lg text-base font-medium font-heading transition-colors
                    ${isActive ? 'text-[#fbbf24] bg-[#221e1a] border-l-2 border-[#f59e0b]' : 'text-[#d4ceb8] hover:text-white hover:bg-[#181512]'}
                  `}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-[#2d2722] flex flex-col gap-2">
            {isAuthenticated && user ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between px-2 py-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#b45309] to-[#f59e0b] flex items-center justify-center text-white font-bold text-xs">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white truncate max-w-[160px]">{user.name}</span>
                      <span className="text-xs text-[#a8a095] truncate max-w-[160px]">{user.email}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-[#221e1a] text-[#f59e0b] capitalize border border-[#f59e0b]/30">
                    {user.role.toLowerCase()}
                  </span>
                </div>

                <NeonButton variant="ghost" size="sm" onClick={handleLogout} className="w-full justify-center text-red-400 hover:text-red-300">
                  <LogOut className="w-3.5 h-3.5 mr-1" />
                  Logout
                </NeonButton>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
                  <NeonButton variant="ghost" size="sm" className="w-full justify-center">
                    Login
                  </NeonButton>
                </Link>
                <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)} className="w-full">
                  <NeonButton variant="primary" size="sm" className="w-full justify-center">
                    Register
                  </NeonButton>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
