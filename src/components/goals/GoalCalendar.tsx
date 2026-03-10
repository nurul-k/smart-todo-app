'use client';

import { useEffect, useState } from 'react';
import { updateGoalDay, getGoalDays } from '@/actions/goal.actions';

export default function GoalCalendar({ startDate, endDate, goalId }: any) {

  const start = new Date(startDate);
  const end = new Date(endDate);

  const days: Date[] = [];
  let current = new Date(start);

  while (current <= end) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  const [logs, setLogs] = useState<any>({});

  useEffect(() => {
    async function load() {
      const res = await getGoalDays(goalId);
      if (res.success) {
        const map: any = {};
        res.days.forEach((d: any) => {
          map[new Date(d.date).toISOString().split('T')[0]] = d.status;
        });
        setLogs(map);
      }
    }

    load();
  }, [goalId]);

  const toggleDay = async (date: Date) => {
    const key = date.toISOString().split('T')[0];

    const current = logs[key];

    let next = 'productive';

    if (current === 'productive') next = 'neutral';
    else if (current === 'neutral') next = 'wasted';
    else if (current === 'wasted') next = 'productive';

    setLogs({ ...logs, [key]: next });

    await updateGoalDay(goalId, date.toISOString(), next);
  };

  const color = (status: string) => {
    if (status === 'productive') return 'bg-green-500';
    if (status === 'neutral') return 'bg-yellow-400';
    if (status === 'wasted') return 'bg-red-500';
    return 'border border-gray-400';
  };

  return (
    <div>

      <h2 className="text-xl font-bold mb-6">Daily Tracker</h2>

      <div className="grid grid-cols-14 gap-2">

        {days.map((day, i) => {

          const status = logs[day.toISOString().split('T')[0]];

          return (
            <div
              key={i}
              onClick={() => toggleDay(day)}
              className={`w-6 h-6 rounded-full cursor-pointer transition ${color(status)}`}
              title={day.toDateString()}
            />
          );

        })}

      </div>
    </div>
  );
}