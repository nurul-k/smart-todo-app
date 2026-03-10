'use client';

import { useState } from 'react';
import GoalCard from './GoalCard';

export default function GoalsList({ initialGoals }: any) {
  const [goals, setGoals] = useState(initialGoals);

  const handleDelete = (id: string) => {
    setGoals((prev: any[]) => prev.filter((g) => g._id !== id));
  };

  const handleUpdate = (updatedGoal: any) => {
    setGoals((prev: any[]) =>
      prev.map((g) => (g._id === updatedGoal._id ? updatedGoal : g))
    );
  };

  if (goals.length === 0) {
    return (
      <div className="rounded-2xl border border-white/40 bg-white/40 backdrop-blur-xl p-12 text-center">
        <p className="text-lg text-gray-600 font-medium">
          No goals created yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {goals.map((goal: any) => (
        <GoalCard
          key={goal._id}
          goal={goal}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      ))}
    </div>
  );
}