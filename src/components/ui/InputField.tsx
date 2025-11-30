import { useState } from "react";
import { cva, VariantProps } from "class-variance-authority";
import clsx from "clsx";
import searchIcon_gray from "@/assets/searchIcon_gray.svg";
import inputClearIcon from "@/assets/inputClearIcon.svg";

const inputVariants = cva(
  "flex p-3 gap-2 border-2 rounded-[12px] bg-white text-body1 font-normal font-pretendard transition-colors",
  {
    variants: {
      state: {
        enabled: "border-gray-200",
        hovered: "border-sky-100",
        focused: "border-sky-300",
        errored: "border-red-300",
      },
    },
    defaultVariants: {
      state: "enabled",
    },
  }
);

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> &
  VariantProps<typeof inputVariants> & {
    state?: "enabled" | "hovered" | "focused" | "errored";
    value: string;
    onValueChange: (value: string) => void;
  };

export const InputField: React.FC<InputFieldProps> = ({
  className,
  placeholder = "검색어를 입력하세요...",
  state: stateProp,
  value,
  onValueChange,
  onKeyDown,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = Boolean(value && value.length > 0);

  // state 결정 (초기값 enabled)
  let state: "enabled" | "hovered" | "focused" | "errored";
  if (isFocused) state = "focused";
  else if (isHovered) state = "hovered";

  // errored 판단 (외부 aria/data prop으로 제어 가능)
  const isErrored =
    stateProp === "errored" ||
    (props as any)["aria-invalid"] === "true" ||
    (props as any)["data-errored"] === true;

  // 실제로 사용할 state 계산: 외부 stateProp 우선, 아니면 내부 상태로 결정
  const computedState: "enabled" | "hovered" | "focused" | "errored" =
    stateProp ??
    (isErrored
      ? "errored"
      : isFocused
        ? "focused"
        : isHovered
          ? "hovered"
          : "enabled");

  const classes = clsx(
    inputVariants({
      state: computedState,
    }),
    className
  );

  return (
    <div
      className={classes}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img src={searchIcon_gray} width={20} height={20} alt="search" />
      <input
        className={clsx(
          "flex w-full bg-transparent outline-none text-body1 font-normal font-pretendard",
          { "text-gray-300": !hasValue, "text-gray-600": hasValue }
        )}
        placeholder={placeholder}
        value={value}
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        onChange={(e) => onValueChange(e.target.value)}
        onKeyDown={onKeyDown}
        {...props}
      />
      {hasValue ? (
        <button
          type="button"
          aria-label="input-clear"
          onClick={() => onValueChange("")}
          className="shrink-0"
        >
          <img src={inputClearIcon} width={24} height={24} alt="input-clear" />
        </button>
      ) : null}
    </div>
  );
};
