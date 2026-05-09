interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  suffix?: string;
}

export function Slider({ label, value, min, max, step, onChange, suffix = "" }: SliderProps) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="flex items-center justify-between gap-3 text-lens-muted">
        <span>{label}</span>
        <span className="font-mono text-xs font-semibold text-lens-ink">
          {value.toFixed(step < 0.1 ? 2 : 1)}
          {suffix}
        </span>
      </span>
      <input
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-lens-primary"
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}
