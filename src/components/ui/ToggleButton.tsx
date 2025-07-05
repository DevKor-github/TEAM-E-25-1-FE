import clsx from "clsx";

interface ToggleButtonProps {
  label: string;
  checked: boolean;
  onClick: () => void;
  children?: React.ReactNode;
}

export default function ToggleButton({ label, checked, onClick, children }: ToggleButtonProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "w-[150px] py-3 rounded-[12px] text-center font-pretendard text-[16px] font-medium leading-[22px]",
        checked
          ? "bg-sky-50 text-sky-500"
          : "bg-gray-50 text-gray-500"
      )}
    >
      {children || label}
    </button>
  );
}
