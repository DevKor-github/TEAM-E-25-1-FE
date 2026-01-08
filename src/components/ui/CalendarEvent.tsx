import React from "react";
import { cn } from "@/lib/utils";

export type CalendarEventType =
  | "강연"
  | "취업. 창업"
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


const getEventStyles = (type: CalendarEventType, state: CalendarEventState) => {
  // Define base colors for each group
  // Group 1: 강연, 취업. 창업 (Blue)
  // Group 2: 공모전, 대회 (Gray)
  // Group 3: 박람회 (Teal)
  // Group 4: 설명회, 교육 (Purple)
  // Group 5: 축제 (Orange)
  // Group 6: 더보기 (Mixed)

  const isMore = type === "...더보기";
  if (isMore) {
    if (state === "Deactivated") {
      return {
        containerBg: "",
        textColor: "text-[#d1d5dc]",
      };
    }
    return {
      containerBg: "",
      textColor: "text-[#6a7282]",
    };
  }

  const styles = {
    containerBg: "",
    textColor: "",
  };

  switch (type) {
    case "강연":
    case "취업. 창업": // Blue #2b7fff
      switch (state) {
        case "Activated":
          styles.containerBg = "bg-[#2b7fff]";
          styles.textColor = "text-white";
          break;
        case "Deactivated":
          styles.containerBg = "bg-[#eff6ff]";
          styles.textColor = "text-[#8ec5ff]";
          break;
        case "Enabled":
        default:
          styles.containerBg = "bg-[#eff6ff]";
          styles.textColor = "text-[#2b7fff]";
          break;
      }
      break;

    case "공모전":
    case "대회": // Gray #6a7282
      switch (state) {
        case "Activated":
          styles.containerBg = "bg-[#6a7282]";
          styles.textColor = "text-white";
          break;
        case "Deactivated":
          styles.containerBg = "bg-[#f9fafb]";
          styles.textColor = "text-[#d1d5dc]";
          break;
        case "Enabled":
        default:
          styles.containerBg = "bg-[#f9fafb]";
          styles.textColor = "text-[#6a7282]";
          break;
      }
      break;

    case "박람회": // Teal #00bba7
      switch (state) {
        case "Activated":
          styles.containerBg = "bg-[#00bba7]";
          styles.textColor = "text-white";
          break;
        case "Deactivated":
          styles.containerBg = "bg-[#f0fdfa]";
          styles.textColor = "text-[#46ecd5]";
          break;
        case "Enabled":
        default:
          styles.containerBg = "bg-[#f0fdfa]";
          styles.textColor = "text-[#00bba7]";
          break;
      }
      break;

    case "설명회":
    case "교육": // Purple #8e51ff
      switch (state) {
        case "Activated":
          styles.containerBg = "bg-[#8e51ff]";
          styles.textColor = "text-white";
          break;
        case "Deactivated":
          styles.containerBg = "bg-[#f5f3ff]";
          styles.textColor = "text-[#c4b4ff]";
          break;
        case "Enabled":
        default:
          styles.containerBg = "bg-[#f5f3ff]";
          styles.textColor = "text-[#8e51ff]";
          break;
      }
      break;

    case "축제": // Orange #ff6900
      switch (state) {
        case "Activated":
          styles.containerBg = "bg-[#ff6900]";
          styles.textColor = "text-white";
          break;
        case "Deactivated":
          styles.containerBg = "bg-[#fff7ed]";
          styles.textColor = "text-[#ffb86a]";
          break;
        case "Enabled":
        default:
          styles.containerBg = "bg-[#fff7ed]";
          styles.textColor = "text-[#ff6900]";
          break;
      }
      break;
  }
  return styles;
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
        "flex h-[16px] w-[100px] items-center justify-center rounded-[6px] px-[3px] py-0 font-pretendard",
        styles.containerBg,
        className
      )}
      {...props}
    >
      <p
        className={cn(
          "flex-[1_0_0] overflow-hidden overflow-ellipsis whitespace-nowrap text-[11px] font-medium leading-none",
          isMore ? "text-center text-[10px]" : "",
          styles.textColor
        )}
      >
        {isMore ? "+2개" : eventTitle}
      </p>
    </div>
  );
}
