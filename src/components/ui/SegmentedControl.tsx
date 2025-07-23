
import SegmentedControlItem from "./SegmentedControlItem";

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
      className="flex p-[2px] bg-gray-50 rounded-[12px] w-full"
      style={{ minHeight: 40 }}
    >
      {segments.map((label) => (
        <SegmentedControlItem
          key={label}
          label={label}
          isSelected={selected === label}
          onClick={() => onChange(label)}
        />
      ))}
    </div>
  );
}
