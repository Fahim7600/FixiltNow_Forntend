import Link from 'next/link';
import { Wrench, ShieldCheck, Zap } from 'lucide-react';
import NeonButton from '@/components/ui/NeonButton';

export default function Home() {
  return (
    <div className="relative overflow-hidden min-h-[calc(100vh-160px)] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-20 text-center">
      {/* Background Accent Ambient Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#f59e0b]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#14b8a6]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#221e1a] border border-[#f59e0b]/30 text-xs font-semibold text-[#fbbf24] shadow-[0_0_15px_rgba(245,158,11,0.2)]">
          <Zap className="w-3.5 h-3.5 fill-[#fbbf24]" />
          Instant Home Repairs & Service Marketplace
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-heading text-white leading-tight">
          Expert Technicians, <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-[#b45309] via-[#f59e0b] to-[#fbbf24] bg-clip-text text-transparent">
            Sparked & Delivered
          </span>{' '}
          to Your Door
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-[#a8a095] max-w-2xl mx-auto leading-relaxed">
          FixItNow connects homeowners with certified, background-checked pros for electrical, plumbing, HVAC, and emergency repairs.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/services">
            <NeonButton variant="primary" size="lg" icon={<Wrench className="w-5 h-5" />}>
              Explore Services
            </NeonButton>
          </Link>
          <Link href="/auth/register">
            <NeonButton variant="secondary" size="lg" icon={<ShieldCheck className="w-5 h-5" />}>
              Become a Technician
            </NeonButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
