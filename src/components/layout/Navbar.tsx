'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, User as UserIcon, Wrench, Shield, LogIn } from 'lucide-react';
import Logo from './Logo';
import NeonButton from '../ui/NeonButton';

export interface NavbarProps {
  isLoggedIn?: boolean;
  role?: 'customer' | 'technician' | 'admin';
  userEmail?: string;
}

export default function Navbar({
  isLoggedIn = false,
  role = 'customer',
  userEmail = 'user@fixitnow.com',
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const getDashboardPath = () => {
    switch (role) {
      case 'technician':
        return '/dashboard/technician';
      case 'admin':
        return '/dashboard/admin';
      default:
        return '/dashboard/customer';
    }
  };

  const getDashboardLabel = () => {
    switch (role) {
      case 'technician':
        return 'Tech Portal';
      case 'admin':
        return 'Admin Panel';
      default:
        return 'My Dashboard';
    }
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    ...(isLoggedIn ? [{ href: getDashboardPath(), label: getDashboardLabel() }] : []),
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

        {/* Right: Actions / Auth State */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <div className="flex items-center gap-3 pl-2 border-l border-[#2d2722]">
              {/* Role Badge */}
              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-[#221e1a] text-[#f59e0b] border border-[#f59e0b]/30">
                {role === 'admin' ? (
                  <Shield className="w-3 h-3 text-[#f87171]" />
                ) : role === 'technician' ? (
                  <Wrench className="w-3 h-3 text-[#5eead4]" />
                ) : (
                  <UserIcon className="w-3 h-3 text-[#fbbf24]" />
                )}
                <span className="capitalize">{role}</span>
              </span>

              {/* User Avatar Placeholder */}
              <Link
                href={getDashboardPath()}
                className="group flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#221e1a] transition-all duration-200"
              >
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#b45309] to-[#f59e0b] flex items-center justify-center text-white font-bold text-sm shadow-[0_0_10px_rgba(245,158,11,0.3)] group-hover:shadow-[0_0_15px_rgba(251,191,36,0.5)] transition-all">
                  {userEmail.charAt(0).toUpperCase()}
                </div>
              </Link>
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
            {isLoggedIn ? (
              <div className="flex items-center justify-between px-2 py-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#b45309] to-[#f59e0b] flex items-center justify-center text-white font-bold text-xs">
                    {userEmail.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-[#d4ceb8] truncate max-w-[160px]">{userEmail}</span>
                </div>
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-[#221e1a] text-[#f59e0b] capitalize border border-[#f59e0b]/30">
                  {role}
                </span>
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
