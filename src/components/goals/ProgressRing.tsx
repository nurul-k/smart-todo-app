'use client';

import { useEffect, useState } from 'react';

interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}

export default function ProgressRing({
  percentage,
  size = 160,
  strokeWidth = 12,
}: ProgressRingProps) {
  const [progress, setProgress] = useState(0);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setProgress(percentage);
    }, 200);
    return () => clearTimeout(timeout);
  }, [percentage]);

  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size}>
        {/* Background */}
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress */}
        <circle
          stroke="url(#gradient)"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
        <defs>
          <linearGradient id="gradient">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>

        {/* Text */}
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="text-xl font-bold fill-gray-900"
        >
          {progress}%
        </text>
      </svg>
      <p className="text-sm text-gray-500 mt-3">Year Completion</p>
    </div>
  );
}