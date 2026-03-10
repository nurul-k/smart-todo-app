'use client';

import { useState } from 'react';
import { pauseGoal, resumeGoal, deleteGoal } from '@/actions/goal.actions';
import Button from '@/components/ui/Button';

interface GoalCardProps {
  goal: any;
  onDelete: (id: string) => void;
  onUpdate: (goal: any) => void;
}

export default function GoalCard({ goal, onDelete, onUpdate }: GoalCardProps) {
  const [status, setStatus] = useState(goal.status);

  const handlePause = async () => {
    setStatus('PAUSED'); // instant UI update
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
      onDelete(goal._id); // remove instantly
      await deleteGoal(goal._id);
    }
  };

  const statusColor =
    status === 'ACTIVE'
      ? 'bg-green-500'
      : status === 'PAUSED'
      ? 'bg-yellow-500'
      : 'bg-blue-500';

  return (
    <div className="rounded-2xl border border-white/40 bg-white/40 backdrop-blur-xl p-6 shadow-lg space-y-4">

      <div className="flex justify-between items-start">
        <h3 className="text-xl font-bold">{goal.title}</h3>

        <span
          className={`text-xs px-3 py-1 rounded-full text-white ${statusColor}`}
        >
          {status}
        </span>
      </div>

      {goal.description && (
        <p className="text-sm text-gray-600">{goal.description}</p>
      )}

      <div className="text-sm text-gray-600 space-y-1">
        <p>📅 Start: {new Date(goal.startDate).toLocaleDateString()}</p>
        <p>⏳ End: {new Date(goal.endDate).toLocaleDateString()}</p>
      </div>

      <div className="flex gap-2 flex-wrap">

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