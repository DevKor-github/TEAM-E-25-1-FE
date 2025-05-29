import { useState } from "react";
import clsx from "clsx";
import checkIconGray from "@/assets/checkicon_gray400.svg";
import checkIconSky from "@/assets/checkicon_sky500.svg";

interface AllToggleButtonProps {
  label: string;
  defaultToggled?: boolean;
}

export default function AllToggleButton({ label, defaultToggled = false }: AllToggleButtonProps) {
  const [isToggled, setIsToggled] = useState(defaultToggled);

  return (
    <button
      onClick={() => setIsToggled((prev) => !prev)}      className={clsx(
        "flex items-center gap-2 rounded-[12px] px-4 py-3 w-[315px]",
        isToggled
          ? "bg-white border border-sky-300"
          : "bg-gray-50 border border-transparent"
      )}
    >      <img
        src={isToggled ? checkIconSky : checkIconGray}
        alt="check"
        className="w-5 h-5"
      />
      <span
        className={clsx(
          "font-pretendard text-[17px] font-medium leading-[24px]",
          isToggled ? "text-gray-700" : "text-gray-500"
        )}
      >
        {label}
      </span>
    </button>
  );
}
