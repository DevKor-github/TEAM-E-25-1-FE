import { useState } from "react";
import clsx from "clsx";

interface ToggleButtonProps {
  label: string;
  defaultToggled?: boolean;
}

export default function ToggleButton({ label, defaultToggled = false }: ToggleButtonProps) {
  const [isToggled, setIsToggled] = useState(defaultToggled);

  return (
    <button
      onClick={() => setIsToggled((prev) => !prev)}
      className={clsx(
        "w-[120px] py-3 rounded-[12px] text-center font-pretendard text-[16px] font-medium leading-[22px]",
        isToggled
          ? "bg-sky50 text-sky-500"
          : "bg-gray-50 text-gray-500"
      )}
    >
      {label}
    </button>
  );
}
