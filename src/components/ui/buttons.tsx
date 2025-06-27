import React from "react";
import { cva, VariantProps } from "class-variance-authority";
import clsx from "clsx";
import shareIcon_gray700 from "../../assets/shareIcon_gray700.svg";
import shareIcon_gray300 from "../../assets/shareIcon_gray300.svg";
import HeartIcon from "../../assets/heartIcon.svg";
import chevronLeft from "../../assets/chevronLeft.svg";
import chevronRight from "../../assets/chevronRight.svg";

const buttonVariants = cva(
  "inline-flex justify-center items-center gap-2 rounded-[12px] font-medium font-pretendard text-[17px] leading-6 text-center transition-colors",
  {
    variants: {
      buttonType: {
        text: "",
        symbol: "w-12 h-12 p-3 gap-2 min-w-[48px] min-h-[48px]",
      },
      size: {
        lg: "px-4 py-3 min-h-[48px] text-body1",
        md: "px-3 py-2 text-body2",
        sm: "px-2 py-1.5 text-body2",
      },
      styleType: {
        brand: "",
        gray: "",
        destructive: "",
      },
      state: {
        enabled: "",
        hovered: "",
        focused: "",
        disabled: "",
        loading: "",
      },
    },
    compoundVariants: [
      { buttonType: "symbol", state: "loading", class: "px-4 py-3" },

      { size: "lg", state: "enabled", class: "min-w-[77px]" },
      { size: "lg", state: "hovered", class: "min-w-[77px]" },
      { size: "lg", state: "focused", class: "min-w-[77px]" },
      { size: "lg", state: "disabled", class: "min-w-[77px]" },
      { size: "lg", state: "loading", class: "min-w-[66px]" },

      { size: "md", state: "enabled", class: "min-w-[66px] min-h-[38px]" },
      { size: "md", state: "hovered", class: "min-w-[66px] min-h-[38px]" },
      { size: "md", state: "focused", class: "min-w-[66px] min-h-[38px]" },
      { size: "md", state: "disabled", class: "min-w-[66px] min-h-[38px]" },
      { size: "md", state: "loading", class: "min-w-[54px] min-h-[40px]" },

      // brand
      {
        styleType: "brand",
        state: "enabled",
        class: "bg-sky-500 text-white border-none",
      },
      {
        styleType: "brand",
        state: "hovered",
        class: "bg-sky-500 text-white border-none",
      },
      {
        styleType: "brand",
        state: "focused",
        class: "bg-sky-500 text-white shadow-[0_0_0_4px_#DEF3FF]",
      },
      {
        styleType: "brand",
        state: "disabled",
        class: "bg-sky-200 text-white border-none",
      },
      {
        styleType: "brand",
        state: "loading",
        class: "bg-sky-500 text-white border-none",
      },

      // gray
      {
        styleType: "gray",
        state: "enabled",
        class: "bg-gray-100 text-gray-900 border-none",
      },
      {
        styleType: "gray",
        state: "hovered",
        class: "bg-gray-200 text-gray-900 border-none",
      },
      {
        styleType: "gray",
        state: "focused",
        class: "bg-gray-100 text-gray-900 shadow-[0_0_0_4px_#D1D5DC]",
      },
      {
        styleType: "gray",
        state: "disabled",
        class: "bg-gray-100 text-gray-300 border-none",
      },
      {
        styleType: "gray",
        state: "loading",
        class: "bg-gray-100 text-gray-300 border-none",
      },

      // destructive
      {
        styleType: "destructive",
        state: "enabled",
        class: "bg-red-100 text-red-500 border-none",
      },
      {
        styleType: "destructive",
        state: "hovered",
        class: "bg-red-200 text-red-500 border-none",
      },
      {
        styleType: "destructive",
        state: "focused",
        class: "bg-red-100 text-red-500 shadow-[0_0_0_4px_#FCA5A5]",
      },
      {
        styleType: "destructive",
        state: "disabled",
        class: "bg-red-100 text-red-300 border-none",
      },
      {
        styleType: "destructive",
        state: "loading",
        class: "bg-red-100 text-red-300 border-none",
      },
    ],
  }
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    children?: React.ReactNode;
    iconType?: "share" | "heart" | "chevronLeft" | "chevronRight";
    iconAlt?: string;
    loading?: boolean;
  };

export const Button: React.FC<ButtonProps> = ({
  buttonType,
  size,
  styleType,
  children,
  className,
  iconType,
  iconAlt,
  disabled,
  loading = false,
  ...props
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  // state 결정 (초기값 enabled)
  let state: "enabled" | "hovered" | "focused" | "disabled" | "loading" =
    "enabled";
  if (loading) state = "loading";
  else if (disabled) state = "disabled";
  else if (isFocused) state = "focused";
  else if (isHovered) state = "hovered";

  // state이 loading일 때 styleType에 따라 점 색상 결정
  const dotColor =
    styleType === "gray"
      ? "bg-gray-300"
      : styleType === "destructive"
        ? "bg-red-300"
        : "bg-sky-100";

  // iconType과 state에 따라 아이콘 결정
  let symbolIcon: string | undefined;
  if (iconType === "share") {
    symbolIcon = state === "disabled" ? shareIcon_gray300 : shareIcon_gray700;
  } else if (iconType === "heart") {
    symbolIcon = HeartIcon;
  } else if (iconType === "chevronLeft") {
    symbolIcon = chevronLeft;
  } else if (iconType === "chevronRight") {
    symbolIcon = chevronRight;
  }

  return (
    <button
      className={clsx(
        buttonVariants({ buttonType, size, styleType, state }),
        className
      )}
      disabled={disabled || loading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center w-[34px] h-6 gap-2">
          <span className={`block w-[6px] h-[6px] rounded-full ${dotColor}`} />
          <span className={`block w-[6px] h-[6px] rounded-full ${dotColor}`} />
          <span className={`block w-[6px] h-[6px] rounded-full ${dotColor}`} />
        </span>
      ) : buttonType === "symbol" && symbolIcon ? (
        <img src={symbolIcon} alt={iconAlt ?? iconType ?? "icon"} />
      ) : (
        children
      )}
    </button>
  );
};
