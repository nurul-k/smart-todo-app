import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getGoalTracker } from '@/actions/goal.actions';
import ProgressRing from '@/components/goals/ProgressRing';

export default async function Mission365Page() {
  const session = await auth();
  if (!session) redirect('/login');

  // First fetch data
  const result = await getGoalTracker();
  const stats = result.success ? result.stats : null;

//   if (!stats) {
//     return <p className="text-red-500">Failed to load stats</p>;
//   }

    if (!stats) {
    return (
        <p className="text-red-500">
        Failed to load stats: {result.error}
        </p>
    );
    }

  // Then calculate year progress
  const yearProgress = Math.round(
    (stats.daysPassed / (stats.daysPassed + stats.daysRemaining)) * 100
  );

  const treeStage =
    stats.productiveDays < 30
      ? '🌱 Seed Stage'
      : stats.productiveDays < 120
      ? '🌿 Growing'
      : stats.productiveDays < 240
      ? '🌳 Strong Tree'
      : '🌲 Legendary Tree';

  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900">
          🚀 Goal Tracker
        </h1>
        <p className="text-lg text-gray-600">
          Your yearly productivity overview
        </p>
      </section>

      {/* Progress Ring */}
      <div className="flex justify-center">
        <ProgressRing percentage={yearProgress} />
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Days Passed" value={stats.daysPassed} />
        <StatCard title="Days Remaining" value={stats.daysRemaining} />
        <StatCard title="Productive Days" value={stats.productiveDays} />
        <StatCard title="Missed Days" value={stats.missedDays} />
        <StatCard title="Productivity Rate" value={`${stats.productivityRate}%`} />
        <StatCard title="Active Goals" value={stats.activeGoals} />
        <StatCard title="Completed Goals" value={stats.completedGoals} />
      </div>

      {/* Tree Stage */}
      <div className="rounded-2xl border border-white/40 bg-white/40 backdrop-blur-xl p-10 text-center shadow-lg">
        <h2 className="text-2xl font-bold mb-4">🌳 Growth Stage</h2>
        <p className="text-3xl font-black">{treeStage}</p>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-white/40 bg-white/40 backdrop-blur-xl p-6 shadow-lg">
      <h3 className="text-sm font-bold text-gray-600 uppercase mb-2">
        {title}
      </h3>
      <p className="text-4xl font-black text-gray-900">{value}</p>
    </div>
  );
}