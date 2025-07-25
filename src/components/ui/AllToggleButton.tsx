import clsx from "clsx";
import checkIconGray from "@/assets/checkicon_gray400.svg";
import checkIconSky from "@/assets/checkicon_sky500.svg";

interface AllToggleButtonProps {
  label: string;
  checked: boolean;
  onClick: () => void;
}

export default function AllToggleButton({ label, checked, onClick }: AllToggleButtonProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex items-center gap-2 rounded-[12px] px-4 py-3 w-[315px]",
        checked
          ? "bg-white border border-sky-300"
          : "bg-gray-50 border border-gray-200"
      )}
    >
      <img
        src={checked ? checkIconSky : checkIconGray}
        alt="check"
        className="w-5 h-5"
      />
      <span
        className={clsx(
          "font-pretendard text-[17px] font-medium leading-[24px]",
          "text-gray-700"
        )}
      >
        {label}
      </span>
    </button>
  );
}
