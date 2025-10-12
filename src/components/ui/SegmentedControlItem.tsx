interface SegmentedControlItemProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

export default function SegmentedControlItem({
  label,
  isSelected,
  onClick,
}: SegmentedControlItemProps) {
  return (
    <button
      type="button"
      className={`
        flex-1 h-9 px-[12px] py-[8px]
        text-[17px] font-pretendard leading-[24px]
        flex items-center justify-center
        transition-colors duration-150
        focus-visible:outline-none focus-visible:ring-0
        ${isSelected
          ? "bg-sky-50 text-sky-500 font-medium shadow-[0_2px_8px_0_rgba(3,0,40,0.04)] rounded-[10px]"
          : "bg-transparent text-[var(--Grays-Gray-500)] hover:bg-[var(--Grays-Gray-100)] font-normal rounded-[10px]"
        }
      `}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
