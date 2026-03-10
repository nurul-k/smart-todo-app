'use client';

interface HeatmapProps {
  productiveDays: string[]; // array of date strings
}

export default function CalendarHeatmap({
  productiveDays,
}: HeatmapProps) {
  const year = new Date().getFullYear();
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);

  const days: Date[] = [];
  for (
    let d = new Date(start);
    d <= end;
    d.setDate(d.getDate() + 1)
  ) {
    days.push(new Date(d));
  }

  return (
    <div className="overflow-x-auto">
      <div className="grid grid-cols-7 gap-1 min-w-full">
        {days.map((day, idx) => {
          const dateStr = day.toDateString();
          const isProductive = productiveDays.includes(dateStr);

          return (
            <div
              key={idx}
              className={`w-4 h-4 rounded-sm ${
                isProductive
                  ? 'bg-green-500'
                  : 'bg-gray-200'
              }`}
              title={dateStr}
            />
          );
        })}
      </div>
    </div>
  );
}