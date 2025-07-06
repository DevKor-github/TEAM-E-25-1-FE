interface SegmentedControlProps {
  segments: string[];
  selected: string;
  onChange: (value: string) => void;
}

export default function SegmentedControl({
  segments,
  selected,
  onChange,
}: SegmentedControlProps) {
  return (
    <div
      className="flex gap-[10px] p-[2px] bg-[var(--Grays-Gray-50)] rounded-[12px] w-fit"
      style={{ minHeight: 40 }}
    >
      {segments.map((label) => {
        const isSelected = selected === label;

        return (
          <button
            key={label}
            type="button"
            className={`
              w-[99px] h-10 px-[12px] py-[8px]
              text-body2 font-pretendard
              flex items-center justify-center
              transition-colors duration-150
              focus-visible:outline-none focus-visible:ring-0
              ${
                isSelected
                  ? "bg-[var(--Grays-White)] text-[var(--Grays-Gray-700)] font-bold shadow-[0_2px_8px_0_rgba(3,0,40,0.04)]"
                  : "bg-transparent text-[var(--Grays-Gray-500)] hover:bg-[var(--Grays-Gray-100)] font-normal"
              }
            `}
            style={{
              borderRadius: 12,
            }}
            onClick={() => onChange(label)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
