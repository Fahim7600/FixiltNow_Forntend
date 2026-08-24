export default function TechnicianDashboardLoading() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto py-8 animate-pulse">
      <div className="h-10 bg-[#221e1a] rounded-xl w-1/3" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="h-28 bg-[#181512] rounded-2xl border border-[#2d2722]" />
        <div className="h-28 bg-[#181512] rounded-2xl border border-[#2d2722]" />
        <div className="h-28 bg-[#181512] rounded-2xl border border-[#2d2722]" />
      </div>
      <div className="h-64 bg-[#181512] rounded-2xl border border-[#2d2722]" />
    </div>
  );
}
