'use client';

import { useEffect, useState } from "react";

interface Props {
  startDate: string;
}

export default function ElapsedTimer({ startDate }: Props) {

  const [time, setTime] = useState("");

  useEffect(() => {

    function updateTimer() {

      const start = new Date(startDate);
      const now = new Date();

      const diff = now.getTime() - start.getTime();

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);

      setTime(`${days} days ${hours} hours ${minutes} minutes`);

    }

    updateTimer();

    const interval = setInterval(updateTimer, 60000);

    return () => clearInterval(interval);

  }, [startDate]);

  return (

    <div className="rounded-2xl border border-white/40 bg-white/40 backdrop-blur-xl p-6 shadow-lg">

      <h2 className="text-xl font-bold mb-2">
        ⏱ Time Elapsed
      </h2>

      <p className="text-2xl font-semibold text-gray-800">
        {time}
      </p>

    </div>

  );

}