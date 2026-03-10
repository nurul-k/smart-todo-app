import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getGoalById } from '@/actions/goal.actions';
//import GoalCalendar from '@/components/goals/GoalCalendar';
import { getGoalYearProgress } from '@/actions/goal.actions';
//import YearProgressRing from '@/components/goals/YearProgressRing';
import TimelineGrid from "@/components/goals/TimelineGrid";
import ElapsedTimer from "@/components/goals/ElapsedTimer";
import StreakCounter from "@/components/goals/StreakCounter";
import MonthlyHeatmap from "@/components/goals/MonthlyHeatmap";

export default async function GoalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  // ✅ Next.js 16 fix
  const { id } = await params;

  const result = await getGoalById(id);

  if (!result.success || !result.goal) {
    return <p className="text-red-500">Goal not found</p>;
  }

  const goal = result.goal;

  const progress = await getGoalYearProgress(id);

  return (
    <div className="space-y-10">

      <div>
        <h1 className="text-4xl font-black">{goal.title}</h1>
        <p className="text-gray-600">{goal.description}</p>
      </div>
      <ElapsedTimer startDate={goal.startDate} />
      {/* <YearProgressRing percent={progress.percent} /> */}
      <MonthlyHeatmap goalId={goal._id} />
      <StreakCounter goalId={goal._id} />
      <TimelineGrid goalId={id} />

      {/* <GoalCalendar
        startDate={goal.startDate}
        endDate={goal.endDate}
      /> */}
    </div>
  );
}