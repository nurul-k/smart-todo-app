'use client';

import { useEffect, useState } from "react";
import { getGoalTimeline, getGoalDayLogs } from "@/actions/goal.actions";
import DayPopup from "./DayPopup";

interface Props {
  goalId: string;
}

export default function TimelineGrid({ goalId }: Props) {

  const [days, setDays] = useState<string[]>([]);
  const [logs, setLogs] = useState<any>({});
  const [openDay, setOpenDay] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true);
  

  useEffect(() => {
    async function load() {

      const timeline = await getGoalTimeline(goalId);
      const dayLogs = await getGoalDayLogs(goalId);

      if (timeline.success) {
        setDays(timeline.days);
      }

      if (dayLogs.success) {

        const map: any = {};

        dayLogs.logs.forEach((log: any) => {
          const key = new Date(log.date).toISOString().split("T")[0];
          map[key] = log;
        });

        setLogs(map);
      }

    }

    load();

  }, [goalId]);

  function getColor(day: string) {

  const today = new Date().toISOString().split("T")[0];
  const log = logs[day];

  // if log exists use its color
  if (log) {

    if (log.category === "productive") return "bg-green-500";
    if (log.category === "neutral") return "bg-yellow-400";
    if (log.category === "wasted") return "bg-red-500";
    if (log.category === "vacation") return "bg-blue-400";

  }

  // past days without data → mark as wasted
  if (day < today) {
    return "bg-red-500";
  }

  // future days empty
  return "border border-gray-400";

}

  function handleClick(day: string) {

    const today = new Date().toISOString().split("T")[0];

    if (day < today) {
        alert("Past day cannot be edited");
        return;
    }

    setOpenDay(day);

    }

    const updateDayLog = (day: string, category: string, note?: string) => {
    setLogs((prev: any) => ({
        ...prev,
        [day]: {
        date: day,
        category,
        note,
        },
    }));
    };

  return (

    <div className="space-y-6">

      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer"
        >
        <h2 className="text-xl font-bold">
            Timeline
        </h2>

        <span className="text-sm text-gray-500">
            {isOpen ? "▲" : "▼"}
        </span>
        </div>

      {isOpen && (
        <div className="grid grid-cols-14 gap-2 animate-fade-in">

        {days.map((day, i) => (

          <div
            key={i}
            onClick={() => handleClick(day)}
            className={`w-6 h-6 rounded-full cursor-pointer transition ${getColor(day)}`}
            title={day}
          />

        ))}

      </div>
      )}

      {openDay && (
        <DayPopup
        goalId={goalId}
        selectedDay={openDay}
        onClose={() => setOpenDay(null)}
        onSave={updateDayLog}
        />
        )}

    </div>

  );
}