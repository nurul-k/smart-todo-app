'use client';

import { useEffect, useState } from "react";
import { getGoalHeatmap } from "@/actions/goal.actions";

interface Props {
  goalId: string;
}

export default function MonthlyHeatmap({ goalId }: Props) {

  const [days, setDays] = useState<any[]>([]);

  useEffect(() => {

    async function load() {

      const res = await getGoalHeatmap(goalId);

      if (res.success) {
        setDays(res.days);
      }

    }

    load();

  }, [goalId]);

  function getColor(category: string | null) {

    if (category === "productive") return "bg-green-500";
    if (category === "neutral") return "bg-yellow-400";
    if (category === "wasted") return "bg-red-500";
    if (category === "vacation") return "bg-blue-400";

    return "bg-gray-200";

  }

  return (

    <div className="space-y-4">

      <h2 className="text-xl font-bold">
        📅 Monthly Activity
      </h2>

      <div className="grid grid-cols-7 gap-2">

        {days.map((day, i) => (

          <div
            key={i}
            title={day.date}
            className={`w-6 h-6 rounded ${getColor(day.category)}`}
          />

        ))}

      </div>

    </div>

  );

}