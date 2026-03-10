"use client";

import { useState } from "react";
import { saveGoalDayLog } from "@/actions/goal.actions";
import Button from "@/components/ui/Button";
import { getGoalDayLogs } from "@/actions/goal.actions";
import { useEffect } from "react";

interface Props {
  goalId: string;
  selectedDay: string;
  onClose: () => void;
  onSave: (day: string, category: string, note?: string) => void;
}

export default function DayPopup({
  goalId,
  selectedDay,
  onClose,
  onSave,
}: Props) {
  const today = new Date().toISOString().split("T")[0];

  const isFuture = selectedDay > today;

  const [category, setCategory] = useState<string | null>(null);
  const [note, setNote] = useState("");

  async function handleSave() {
    if (!category) {
      alert("Please select a category");
      return;
    }

    await saveGoalDayLog(goalId, selectedDay, category as any, note);

    onSave(selectedDay, category as string, note);

    onClose();
  }

  useEffect(() => {
    async function load() {
      const res = await getGoalDayLogs(goalId);

      if (!res.success) return;

      const existing = res.logs.find(
        (log: any) =>
          new Date(log.date).toISOString().split("T")[0] === selectedDay,
      );

      if (existing) {
        setCategory(existing.category);
        setNote(existing.note || "");
      }
    }

    load();
  }, [goalId, selectedDay]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[350px] space-y-4">
        <h3 className="text-lg font-bold">{selectedDay}</h3>

        <div className="space-y-2">
          {!isFuture && (
            <>
              <button
                onClick={() => setCategory("productive")}
                className={`w-full text-left px-3 py-2 rounded ${
                  category === "productive"
                    ? "bg-green-200"
                    : "hover:bg-gray-100"
                }`}
              >
                🟢 Productive
              </button>

              <button
                onClick={() => setCategory("neutral")}
                className={`w-full text-left px-3 py-2 rounded ${
                  category === "neutral" ? "bg-yellow-200" : "hover:bg-gray-100"
                }`}
              >
                🟡 Neutral
              </button>

              <button
                onClick={() => setCategory("wasted")}
                className={`w-full text-left px-3 py-2 rounded ${
                  category === "wasted" ? "bg-red-200" : "hover:bg-gray-100"
                }`}
              >
                🔴 Wasted
              </button>

              <button
                onClick={() => setCategory("vacation")}
                className={`w-full text-left px-3 py-2 rounded ${
                  category === "vacation" ? "bg-blue-200" : "hover:bg-gray-100"
                }`}
              >
                🔵 Vacation
              </button>
            </>
          )}

          {isFuture && (
            <>
              <button
                onClick={() => setCategory("vacation")}
                className={`w-full text-left px-3 py-2 rounded ${
                  category === "vacation" ? "bg-blue-200" : "hover:bg-gray-100"
                }`}
              >
                🔵 Vacation
              </button>

              <button
                onClick={() => setCategory("clear")}
                className={`w-full text-left px-3 py-2 rounded ${
                  category === "clear" ? "bg-gray-200" : "hover:bg-gray-100"
                }`}
              >
                Clear
              </button>
            </>
          )}
        </div>

        {!isFuture && (
          <textarea
            placeholder="Add a note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full border rounded p-2 text-sm"
          />
        )}

        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
