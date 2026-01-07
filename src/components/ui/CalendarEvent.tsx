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

const typeMap: Record<string, string> = {
  강연: "강",
  "취업. 창업": "취",
  공모전: "공",
  대회: "대",
  박람회: "박",
  설명회: "설",
  교육: "교",
  축제: "축",
  "...더보기": "+2개", // The code showed +2개 for "more"
};

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
        badgeBg: "", // No badge for more? Code shows conditional rendering
        labelColor: "text-[#d1d5dc]",
      };
    }
    return {
      containerBg: "",
      badgeBg: "",
      labelColor: "text-[#6a7282]",
    };
  }

  const styles = {
    containerBg: "",
    badgeBg: "",
    labelColor: "",
  };

  switch (type) {
    case "강연":
    case "취업. 창업": // Blue #2b7fff
      switch (state) {
        case "Activated":
          styles.containerBg = "bg-[#2b7fff]";
          styles.badgeBg = "bg-[rgba(255,255,255,0.2)]";
          styles.labelColor = "text-white";
          break;
        case "Deactivated":
          styles.containerBg = "bg-[#eff6ff]";
          styles.badgeBg = "bg-[#8ec5ff]";
          styles.labelColor = "text-[#8ec5ff]";
          break;
        case "Enabled":
        default:
          styles.containerBg = "bg-[#eff6ff]";
          styles.badgeBg = "bg-[#2b7fff]";
          styles.labelColor = "text-[#2b7fff]";
          break;
      }
      break;

    case "공모전":
    case "대회": // Gray #6a7282
      switch (state) {
        case "Activated":
          styles.containerBg = "bg-[#6a7282]";
          styles.badgeBg = "bg-[rgba(255,255,255,0.2)]"; // Assuming consistent pattern
          styles.labelColor = "text-white";
          break;
        case "Deactivated":
          styles.containerBg = "bg-[#f9fafb]";
          styles.badgeBg = "bg-[#d1d5dc]";
          styles.labelColor = "text-[#d1d5dc]";
          break;
        case "Enabled":
        default:
          styles.containerBg = "bg-[#f9fafb]";
          styles.badgeBg = "bg-[#6a7282]";
          styles.labelColor = "text-[#6a7282]";
          break;
      }
      break;

    case "박람회": // Teal #00bba7
      switch (state) {
        case "Activated":
          styles.containerBg = "bg-[#00bba7]";
          styles.badgeBg = "bg-[rgba(255,255,255,0.2)]";
          styles.labelColor = "text-white";
          break;
        case "Deactivated":
          styles.containerBg = "bg-[#f0fdfa]";
          styles.badgeBg = "bg-[#46ecd5]";
          styles.labelColor = "text-[#46ecd5]";
          break;
        case "Enabled":
        default:
          styles.containerBg = "bg-[#f0fdfa]";
          styles.badgeBg = "bg-[#00bba7]";
          styles.labelColor = "text-[#00bba7]";
          break;
      }
      break;

    case "설명회":
    case "교육": // Purple #8e51ff
      switch (state) {
        case "Activated":
          styles.containerBg = "bg-[#8e51ff]";
          styles.badgeBg = "bg-[rgba(255,255,255,0.2)]";
          styles.labelColor = "text-white";
          break;
        case "Deactivated":
          styles.containerBg = "bg-[#f5f3ff]";
          styles.badgeBg = "bg-[#c4b4ff]";
          styles.labelColor = "text-[#c4b4ff]";
          break;
        case "Enabled":
        default:
          styles.containerBg = "bg-[#f5f3ff]";
          styles.badgeBg = "bg-[#8e51ff]";
          styles.labelColor = "text-[#8e51ff]";
          break;
      }
      break;

    case "축제": // Orange #ff6900
      switch (state) {
        case "Activated":
          styles.containerBg = "bg-[#ff6900]";
          styles.badgeBg = "bg-[rgba(255,255,255,0.2)]";
          styles.labelColor = "text-white";
          break;
        case "Deactivated":
          styles.containerBg = "bg-[#fff7ed]";
          styles.badgeBg = "bg-[#ffb86a]";
          styles.labelColor = "text-[#ffb86a]";
          break;
        case "Enabled":
        default:
          styles.containerBg = "bg-[#fff7ed]";
          styles.badgeBg = "bg-[#ff6900]";
          styles.labelColor = "text-[#ff6900]";
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
        "flex h-[16px] w-[100px] items-center justify-center gap-[3px] rounded-[7px] py-0 pl-px pr-[4px] font-pretendard",
        styles.containerBg,
        className
      )}
      {...props}
    >
      {!isMore && (
        <div
          className={cn(
            "flex size-[14px] shrink-0 flex-col items-center justify-center rounded-[6px]",
            styles.badgeBg
          )}
        >
          <span className="text-[9px] font-semibold leading-[13px] text-white">
            {typeMap[eventType] || typeMap["강연"]}
          </span>
        </div>
      )}
      <p
        className={cn(
          "flex-[1_0_0] overflow-hidden overflow-ellipsis whitespace-nowrap text-[11px] font-medium leading-[16px]",
          isMore ? "text-center text-[10px]" : "",
          styles.labelColor
        )}
      >
        {isMore ? "+2개" : eventTitle}
      </p>
    </div>
  );
}
