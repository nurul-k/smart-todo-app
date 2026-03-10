'use client';

import { useState } from 'react';
import { pauseGoal, resumeGoal, deleteGoal } from '@/actions/goal.actions';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation'

export default function GoalCard({ goal, onDelete, onUpdate }: any) {

  const router = useRouter();

  const [status, setStatus] = useState(goal.status);

  const handlePause = async () => {
    setStatus('PAUSED');
    await pauseGoal(goal._id);
    onUpdate({ ...goal, status: 'PAUSED' });
  };

  const handleResume = async () => {
    setStatus('ACTIVE');
    await resumeGoal(goal._id);
    onUpdate({ ...goal, status: 'ACTIVE' });
  };

  const handleDelete = async () => {
    if (confirm('Delete this goal?')) {
      onDelete(goal._id);
      await deleteGoal(goal._id);
    }
  };

  return (
    <div onClick={() => router.push(`/goals/${goal._id}`)}
     className="rounded-2xl border border-white/40 bg-white/40 backdrop-blur-xl p-6 shadow-lg cursor-pointer space-y-4">

      <div className="flex justify-between items-start">
        <h3 className="text-xl font-bold">{goal.title}</h3>

        <span className="text-xs px-3 py-1 rounded-full bg-green-500 text-white">
          {status}
        </span>
      </div>

      {goal.description && (
        <p className="text-sm text-gray-600">{goal.description}</p>
      )}

      <div className="flex gap-2">

        {status === 'ACTIVE' && (
          <Button size="sm" variant="secondary" onClick={handlePause}>
            Pause
          </Button>
        )}

        {status === 'PAUSED' && (
          <Button size="sm" variant="primary" onClick={handleResume}>
            Resume
          </Button>
        )}

        <Button size="sm" variant="danger" onClick={handleDelete}>
          Delete
        </Button>

      </div>

    </div>
  );
}