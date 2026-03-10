export default function YearProgressRing({ percent }: any) {

  const radius = 70;
  const circumference = 2 * Math.PI * radius;

  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg width="200" height="200">

      <circle
        cx="100"
        cy="100"
        r={radius}
        stroke="#eee"
        strokeWidth="10"
        fill="none"
      />

      <circle
        cx="100"
        cy="100"
        r={radius}
        stroke="green"
        strokeWidth="10"
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 100 100)"
      />

      <text x="50%" y="50%" textAnchor="middle" dy=".3em">
        {percent}%
      </text>

    </svg>
  );
}