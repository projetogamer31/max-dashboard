interface StatusBadgeProps {
  ok: boolean;
  label?: string;
}

export default function StatusBadge({ ok, label }: StatusBadgeProps) {
  const text = label ?? (ok ? "Online" : "Offline");
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        ok ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-200"
      }`}
    >
      {text}
    </span>
  );
}
