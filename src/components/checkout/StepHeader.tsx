interface StepHeaderProps {
  n: number;
  title: string;
  active: boolean;
  done: boolean;
  onEdit?: () => void;
}

export default function StepHeader({ n, title, active, done, onEdit }: StepHeaderProps) {
  const lit = active || done;
  return (
    <div className="flex items-center gap-3">
      <span
        className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
          lit ? "bg-sauce text-white" : "bg-gray-200 text-gray-500"
        }`}
      >
        {done ? "✓" : n}
      </span>
      <h2 className={`font-bold ${lit ? "text-ink" : "text-gray-400"}`}>{title}</h2>
      {done && onEdit && (
        <button type="button" onClick={onEdit} className="ml-auto text-sm font-semibold text-sauce">
          Edit
        </button>
      )}
    </div>
  );
}