'use client';

import { useEffect, useState } from "react";
import { getGoalStreak } from "@/actions/goal.actions";

interface Props {
  goalId: string;
}

export default function StreakCounter({ goalId }: Props) {

  const [current, setCurrent] = useState(0);
  const [best, setBest] = useState(0);

  useEffect(() => {

    async function load() {

      const res = await getGoalStreak(goalId);

      if (res.success) {
        setCurrent(res.currentStreak);
        setBest(res.bestStreak);
      }

    }

    load();

  }, [goalId]);

  return (

    <div className="grid grid-cols-2 gap-4">

      <div className="rounded-xl bg-orange-50 p-4 text-center">

        <p className="text-sm text-gray-600">
          🔥 Current Streak
        </p>

        <p className="text-2xl font-bold">
          {current} days
        </p>

      </div>

      <div className="rounded-xl bg-yellow-50 p-4 text-center">

        <p className="text-sm text-gray-600">
          🏆 Best Streak
        </p>

        <p className="text-2xl font-bold">
          {best} days
        </p>

      </div>

    </div>

  );

}