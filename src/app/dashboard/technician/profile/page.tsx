'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  UserCheck,
  Award,
  DollarSign,
  MapPin,
  FileText,
  Plus,
  X,
  Sparkles,
  Info,
  Check,
} from 'lucide-react';
import NeonButton from '@/components/ui/NeonButton';
import { useMyProfile, useUpsertProfile } from '@/hooks/useTechnicianProfile';

export default function TechnicianProfileSetupPage() {
  const { data: profile, isLoading } = useMyProfile();
  const upsertMutation = useUpsertProfile();

  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [experienceYears, setExperienceYears] = useState<number>(0);
  const [hourlyRate, setHourlyRate] = useState<string>('');
  const [location, setLocation] = useState('');

  const [errors, setErrors] = useState<{ hourlyRate?: string; experienceYears?: string }>({});

  useEffect(() => {
    if (profile) {
      setBio(profile.bio || '');
      setSkills(Array.isArray(profile.skills) ? profile.skills : []);
      setExperienceYears(profile.experienceYears || 0);
      setHourlyRate(profile.hourlyRate ? String(profile.hourlyRate) : '');
      setLocation(profile.location || '');
    }
  }, [profile]);

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    if (skills.includes(trimmed)) {
      toast.info('Skill already added');
      setSkillInput('');
      return;
    }
    setSkills([...skills, trimmed]);
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const rateNum = parseFloat(hourlyRate);
    if (isNaN(rateNum) || rateNum <= 0) {
      setErrors((prev) => ({ ...prev, hourlyRate: 'Hourly rate must be a positive number greater than 0' }));
      toast.error('Hourly rate must be greater than 0');
      return;
    }

    if (experienceYears < 0) {
      setErrors((prev) => ({ ...prev, experienceYears: 'Experience years cannot be negative' }));
      return;
    }

    try {
      await upsertMutation.mutateAsync({
        bio: bio.trim() || undefined,
        skills,
        experienceYears,
        hourlyRate: rateNum,
        location: location.trim() || undefined,
      });

      toast.success('Technician profile saved successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save profile');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto py-12 space-y-6 animate-pulse">
        <div className="h-10 bg-[#221e1a] rounded-xl w-1/3" />
        <div className="h-64 bg-[#181512] rounded-2xl border border-[#2d2722]" />
      </div>
    );
  }

  const isFirstTime = !profile;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-1 border-b border-[#2d2722] pb-6">
        <div className="flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-[#5eead4]" />
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
            Technician Profile Settings
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-[#a8a095]">
          Manage your bio, skills, hourly rate, and location to attract customers.
        </p>
      </div>

      {/* First-time Setup Hint Banner */}
      {isFirstTime && (
        <div className="bg-[#0f1716] border border-[#14b8a6]/40 p-4 rounded-2xl flex items-start gap-3 text-xs text-[#5eead4]">
          <Info className="w-5 h-5 text-[#5eead4] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold font-heading text-white block">
              Complete Your Profile
            </span>
            <p className="text-[#a8a095]">
              Welcome! Please complete your technician profile below with your hourly rate and skills before creating service listings.
            </p>
          </div>
        </div>
      )}

      {/* Profile Form Card */}
      <div className="bg-[#181512] border border-[#2d2722] p-6 sm:p-8 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0f766e] via-[#14b8a6] to-[#5eead4]" />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hourly Rate & Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#d4ceb8] font-heading flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-[#fbbf24]" /> Hourly Rate (USD) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="45.00"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                required
                className={`w-full px-3.5 py-2.5 rounded-xl bg-[#12100e] border ${
                  errors.hourlyRate ? 'border-red-500' : 'border-[#2d2722]'
                } text-xs text-white placeholder-[#6b6359] focus:border-[#fbbf24] focus:outline-none transition-colors`}
              />
              {errors.hourlyRate && (
                <p className="text-[11px] text-red-400">{errors.hourlyRate}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#d4ceb8] font-heading flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#f59e0b]" /> Experience (Years)
              </label>
              <input
                type="number"
                min="0"
                placeholder="5"
                value={experienceYears}
                onChange={(e) => setExperienceYears(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#12100e] border border-[#2d2722] text-xs text-white placeholder-[#6b6359] focus:border-[#fbbf24] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#d4ceb8] font-heading flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#14b8a6]" /> Primary Service Location / City
            </label>
            <input
              type="text"
              placeholder="e.g. Austin, TX or Brooklyn, NY"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#12100e] border border-[#2d2722] text-xs text-white placeholder-[#6b6359] focus:border-[#fbbf24] focus:outline-none transition-colors"
            />
          </div>

          {/* Skills Tag Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#d4ceb8] font-heading flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#5eead4]" /> Skills & Specializations
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type skill (e.g. Electrical, Plumbing) & press Enter"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#12100e] border border-[#2d2722] text-xs text-white placeholder-[#6b6359] focus:border-[#fbbf24] focus:outline-none transition-colors"
              />
              <NeonButton type="button" variant="secondary" size="sm" onClick={handleAddSkill} icon={<Plus className="w-3.5 h-3.5" />}>
                Add
              </NeonButton>
            </div>

            {/* Skills Pills */}
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-[#221e1a] text-[#5eead4] border border-[#14b8a6]/30"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-red-400 cursor-pointer transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Bio */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#d4ceb8] font-heading flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#a8a095]" /> Professional Bio
            </label>
            <textarea
              rows={4}
              placeholder="Describe your background, expertise, equipment, and service philosophy..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#12100e] border border-[#2d2722] text-xs text-white placeholder-[#6b6359] focus:border-[#fbbf24] focus:outline-none transition-colors"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex justify-end">
            <NeonButton
              type="submit"
              variant="primary"
              size="md"
              disabled={upsertMutation.isPending}
              loading={upsertMutation.isPending}
              icon={<Check className="w-4 h-4" />}
            >
              Save Profile
            </NeonButton>
          </div>
        </form>
      </div>
    </div>
  );
}
