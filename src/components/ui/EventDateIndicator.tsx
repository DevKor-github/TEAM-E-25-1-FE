import React from "react";
import liveIndicator from "@/assets/live_Indicator_sky500.svg";

export type EventType = "강연" | "공모전" | "대회" | "박람회" | "설명회" | "축제";

type DateStatus = "upcoming" | "imminent" | "ongoing" | "ended";

interface EventDateIndicatorProps {
  dday?: number;
  status?: DateStatus;
  className?: string;
}

export default function EventDateIndicator({ dday, status, className = "" }: EventDateIndicatorProps) {
  // dday 값에 따라 status 자동 판별
  let computedStatus: DateStatus = "upcoming";
  if (typeof dday === "number") {
    if (dday < 0) {
      computedStatus = "ended";
    } else if (dday === 0) {
      computedStatus = "ongoing";
    } else if (dday <= 7) {
      computedStatus = "imminent";
    } else {
      computedStatus = "upcoming";
    }
  }
  const finalStatus = status || computedStatus;

  const getStatusStyles = (status: DateStatus) => {
    switch (status) {
      case "upcoming":
        return "bg-gray-50 text-gray-500"; // 일반 (D-117)      
      case "imminent":
        return "bg-sky-50 text-sky-500 border border-sky-100"; // 임박 (D-7, D-3)
      case "ongoing":
        return "bg-sky-50 text-sky-500 border border-sky-100"; // 행사중
      case "ended":
        return "bg-gray-50 text-gray-500"; // 종료
      default:
        return "bg-gray-50 text-gray-500";
    }
  };

  const getDateText = () => {
    if (finalStatus === "ongoing") return "행사중";
    if (finalStatus === "ended") return "종료";
    if (dday === 1) return "내일 시작";
    if (dday === 0) return "오늘 시작";
    return `D-${dday}`;
  };

  return (
    <div
      style={{ fontSize: "15px", borderRadius: "8px" }}
      className={`inline-flex items-center justify-center px-[6px] py-[2px] font-medium leading-[22px] whitespace-nowrap ${getStatusStyles(finalStatus)} ${className}`}
    >
      {finalStatus === "ongoing" ? (
        <div className="inline-flex items-center gap-[6px]">
          <span>{getDateText()}</span>
          <img 
            src={liveIndicator} 
            alt="진행중"
            className="w-[6px] h-[6px]"
          />
        </div>
      ) : (
        getDateText()
      )}
    </div>
  );
}
