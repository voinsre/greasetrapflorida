export default function ServicePills({ services }: { services: string[] }) {
  if (!services.length) return null;

  const visible = services.slice(0, 3);
  const remaining = services.length - 3;

  return (
    <div className="flex flex-wrap gap-1.5">
      {visible.map((s) => (
        <span
          key={s}
          className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full"
        >
          {s}
        </span>
      ))}
      {remaining > 0 && (
        <span className="text-xs text-gray-400 px-1 py-1">
          +{remaining} more
        </span>
      )}
    </div>
  );
}
