export default function Logo({
  className = 'w-8 h-8',
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Outer circle */}
      <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="3" />
      {/* Droplet/swirl shape */}
      <path
        d="M32 14C32 14 20 28 20 36C20 42.627 25.373 48 32 48C38.627 48 44 42.627 44 36C44 28 32 14 32 14Z"
        fill="currentColor"
        fillOpacity="0.15"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Inner swirl */}
      <path
        d="M28 36C28 33.8 30 30 32 27C34 30 36 33.8 36 36C36 38.2 34.2 40 32 40C29.8 40 28 38.2 28 36Z"
        fill="currentColor"
        fillOpacity="0.4"
      />
    </svg>
  );
}
