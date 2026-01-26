import React from "react";
import { cn } from "@/lib/utils";

interface CalendarMarginProps extends React.HTMLAttributes<HTMLDivElement> {
  nearbyItemOnMonth?: boolean;
}

export default function CalendarMargin({
  nearbyItemOnMonth = true,
  className,
  ...props
}: CalendarMarginProps) {
  // nearbyItemOnMonth가 true면 현재 달 → 흰색 배경
  // nearbyItemOnMonth가 false면 이전/다음 달 → 회색 배경
  const bgColor = nearbyItemOnMonth ? "bg-white" : "bg-[#f3f4f6]";

  return (
    <div
      className={cn("h-[88px] flex-[0.03_0_0]", bgColor, className)}
      {...props}
    />
  );
}
