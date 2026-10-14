import { Users, Clock, HelpCircle, CheckCircle2, TrendingUp } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  subtext: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
}

function StatCard({ label, value, subtext, icon, color, bg }: StatCardProps) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-card transition-all hover:shadow-lift">
      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-ink-900 font-display">{value}</p>
      <p className="text-sm font-medium text-ink-600">{label}</p>
      <p className={`mt-1 text-xs font-medium ${color}`}>{subtext}</p>
    </div>
  );
}

export function AnalyticsStats() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard
        label="Total Students"
        value="32"
        subtext="+3 this week"
        icon={<Users className="text-sky2-500" size={20} />}
        color="text-brand-500"
        bg="bg-sky2-50"
      />
      <StatCard
        label="Avg Engagement"
        value="2h 14m"
        subtext="↑ 12% vs last week"
        icon={<Clock className="text-accent-500" size={20} />}
        color="text-brand-500"
        bg="bg-accent-50"
      />
      <StatCard
        label="Doubts Asked"
        value="87"
        subtext="Across all students"
        icon={<HelpCircle className="text-coral-500" size={20} />}
        color="text-ink-400"
        bg="bg-coral-50/50"
      />
      <StatCard
        label="Resolution Rate"
        value="78%"
        subtext="↑ 5% improvement"
        icon={<CheckCircle2 className="text-brand-500" size={20} />}
        color="text-brand-500"
        bg="bg-brand-50"
      />
    </div>
  );
}
