import liveIndicator from "@/assets/live_Indicator_sky500.svg";

export type EventType =
  | "강연"
  | "공모전"
  | "대회"
  | "박람회"
  | "설명회"
  | "축제";

type DateStatus = "upcoming" | "imminent" | "ongoing" | "ended";

interface EventDateIndicatorProps {
  dday?: number;
  status?: DateStatus;
  className?: string;
}

export default function EventDateIndicator({
  dday,
  status = "upcoming",
  className = "",
}: EventDateIndicatorProps) {
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
    if (typeof dday !== "number") return "";
    if (status === "ongoing" || dday === 0) return "행사중";
    if (status === "ended" || dday < 0) return "종료";
    if (dday === 1) return "내일 시작";
    return `D-${dday}`;
  };

  return (
    <div
      style={{ fontSize: "15px", borderRadius: "8px" }}
      className={`inline-flex items-center justify-center px-[6px] py-[2px] font-medium leading-[22px] whitespace-nowrap ${getStatusStyles(status)} ${className}`}
    >
      {status === "ongoing" ? (
        <div className="inline-flex items-center gap-[6px]">
          <span>{getDateText()}</span>
          <img src={liveIndicator} alt="행사중" className="w-[6px] h-[6px]" />
        </div>
      ) : (
        getDateText()
      )}
    </div>
  );
}
