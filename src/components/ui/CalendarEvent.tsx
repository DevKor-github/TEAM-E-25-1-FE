import React from "react";
import { cn } from "@/lib/utils";

export type CalendarEventType =
  | "강연"
  | "취업·창업"
  | "공모전"
  | "대회"
  | "박람회"
  | "설명회"
  | "교육"
  | "축제"
  | "...더보기";

export type CalendarEventState = "Enabled" | "Activated" | "Deactivated";

interface CalendarEventProps extends React.HTMLAttributes<HTMLDivElement> {
  eventTitle?: string;
  eventType?: CalendarEventType;
  state?: CalendarEventState;
}

// 이벤트 타입별 색상 매핑
const EVENT_COLOR_MAP: Record<
  Exclude<CalendarEventType, "...더보기">,
  {
    enabled: { bg: string; text: string };
    activated: { bg: string; text: string };
    deactivated: { bg: string; text: string };
  }
> = {
  강연: {
    enabled: { bg: "bg-[#eff6ff]", text: "text-[#2b7fff]" },
    activated: { bg: "bg-[#2b7fff]", text: "text-white" },
    deactivated: { bg: "bg-[#eff6ff]", text: "text-[#8ec5ff]" },
  },
  "취업·창업": {
    enabled: { bg: "bg-[#eff6ff]", text: "text-[#2b7fff]" },
    activated: { bg: "bg-[#2b7fff]", text: "text-white" },
    deactivated: { bg: "bg-[#eff6ff]", text: "text-[#8ec5ff]" },
  },
  공모전: {
    enabled: { bg: "bg-[#f9fafb]", text: "text-[#6a7282]" },
    activated: { bg: "bg-[#6a7282]", text: "text-white" },
    deactivated: { bg: "bg-[#f9fafb]", text: "text-[#d1d5dc]" },
  },
  대회: {
    enabled: { bg: "bg-[#f9fafb]", text: "text-[#6a7282]" },
    activated: { bg: "bg-[#6a7282]", text: "text-white" },
    deactivated: { bg: "bg-[#f9fafb]", text: "text-[#d1d5dc]" },
  },
  박람회: {
    enabled: { bg: "bg-[#f0fdfa]", text: "text-[#00bba7]" },
    activated: { bg: "bg-[#00bba7]", text: "text-white" },
    deactivated: { bg: "bg-[#f0fdfa]", text: "text-[#46ecd5]" },
  },
  설명회: {
    enabled: { bg: "bg-[#f5f3ff]", text: "text-[#8e51ff]" },
    activated: { bg: "bg-[#8e51ff]", text: "text-white" },
    deactivated: { bg: "bg-[#f5f3ff]", text: "text-[#c4b4ff]" },
  },
  교육: {
    enabled: { bg: "bg-[#f5f3ff]", text: "text-[#8e51ff]" },
    activated: { bg: "bg-[#8e51ff]", text: "text-white" },
    deactivated: { bg: "bg-[#f5f3ff]", text: "text-[#c4b4ff]" },
  },
  축제: {
    enabled: { bg: "bg-[#fff7ed]", text: "text-[#ff6900]" },
    activated: { bg: "bg-[#ff6900]", text: "text-white" },
    deactivated: { bg: "bg-[#fff7ed]", text: "text-[#ffb86a]" },
  },
};

const getEventStyles = (type: CalendarEventType, state: CalendarEventState) => {
  const isMore = type === "...더보기";

  if (isMore) {
    return {
      containerBg: "",
      textColor: state === "Deactivated" ? "text-[#d1d5dc]" : "text-[#6a7282]",
    };
  }

  const colorScheme = EVENT_COLOR_MAP[type];
  const stateKey = state.toLowerCase() as
    | "enabled"
    | "activated"
    | "deactivated";

  return {
    containerBg: colorScheme[stateKey].bg,
    textColor: colorScheme[stateKey].text,
  };
};

export default function CalendarEvent({
  eventTitle = "이벤트 타이틀",
  eventType = "강연",
  state = "Enabled",
  className,
  ...props
}: CalendarEventProps) {
  const styles = getEventStyles(eventType, state);
  const isMore = eventType === "...더보기";

  return (
    <div
      className={cn(
        "flex h-[16px] items-center justify-center rounded-[6px] px-[3px] py-0 font-pretendard",
        styles.containerBg,
        className,
      )}
      {...props}
    >
      <p
        className={cn(
          "flex-[1_0_0] overflow-hidden overflow-ellipsis whitespace-nowrap font-medium leading-none",
          isMore ? "text-center text-[10px]" : "text-[11px]",
          styles.textColor,
        )}
      >
        {eventTitle}
      </p>
    </div>
  );
}
