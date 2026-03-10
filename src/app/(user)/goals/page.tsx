import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getUserGoals } from '@/actions/goal.actions';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import GoalsList from '@/components/goals/GoalsList';

export default async function GoalsPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const result = await getUserGoals();
  const goals = result.success ? result.goals : [];

  return (
    <div className="space-y-12 sm:space-y-14">

      {/* Header */}
      <section className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900">
            🎯 Goals
          </h1>
          <p className="text-lg text-gray-600">
            Plan your long-term growth and track progress
          </p>
        </div>

        <Link href="/goals/new">
          <Button variant="primary" size="md">
            + Set New Goal
          </Button>
        </Link>
      </section>

      <GoalsList initialGoals={goals} />

    </div>
  );
}