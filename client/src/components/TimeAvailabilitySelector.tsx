import { Clock3 } from "lucide-react";

export const AVAILABLE_TIME_OPTIONS = [5, 10, 15, 20, 30, 45] as const;

export type AvailableTimeMinutes = (typeof AVAILABLE_TIME_OPTIONS)[number];

type TimeAvailabilitySelectorProps = {
  value: AvailableTimeMinutes | null;
  onChange: (minutes: AvailableTimeMinutes) => void;
};

const getLabel = (minutes: AvailableTimeMinutes) =>
  minutes === 45 ? "45+ min" : `${minutes} min`;

export function TimeAvailabilitySelector({
  value,
  onChange,
}: TimeAvailabilitySelectorProps) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-purple-100/85">
        <Clock3 size={16} className="text-cyan-300" />
        Quanto tempo você tem agora?
      </div>
      <div className="grid grid-cols-3 gap-2">
        {AVAILABLE_TIME_OPTIONS.map(minutes => {
          const selected = value === minutes;
          return (
            <button
              key={minutes}
              type="button"
              onClick={() => onChange(minutes)}
              aria-pressed={selected}
              className={`rounded-xl border px-2 py-3 text-sm font-semibold transition-all ${
                selected
                  ? "border-cyan-300/75 bg-cyan-400/20 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.25)]"
                  : "border-white/12 bg-black/25 text-purple-100/65 hover:border-purple-400/45 hover:bg-purple-500/10 hover:text-purple-100"
              }`}
            >
              {getLabel(minutes)}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-xs leading-5 text-white/40">
        45+ significa 45 minutos ou mais.
      </p>
    </div>
  );
}
