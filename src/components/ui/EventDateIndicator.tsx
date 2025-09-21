import liveIndicator from "@/assets/live_Indicator_sky500.svg";

type DateStatus = "upcoming" | "imminent" | "critical" | "ongoing" | "ended";

interface EventDateIndicatorProps {
  startAt: string;
  endAt: string;
  isRegistration?: boolean;
  className?: string;
}

export default function EventDateIndicator({
  startAt,
  endAt,
  isRegistration = false,
  className = "",
}: EventDateIndicatorProps) {
  // diff, status 계산
  let diff: number | undefined = undefined;
  let status: "upcoming" | "imminent" | "critical" | "ongoing" | "ended" =
    "upcoming";

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(startAt);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endAt);
    end.setHours(23, 59, 59, 999); // 종료일의 마지막 시간

    // status 계산 - startAt과 endAt 모두 고려
    const todayTime = today.getTime();
    const startTime = start.getTime();
    const endTime = end.getTime();

    if (!isRegistration) {
      // 행사 시작일 기준
      diff = Math.ceil(
        (start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
    } else {
      // 신청 마감일 기준
      diff = Math.floor(
        (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
    }

    if (endTime < todayTime) {
      status = "ended"; // 종료일이 지난 경우만 종료
    } else if (
      !isRegistration &&
      startTime <= todayTime &&
      endTime >= todayTime
    ) {
      status = "ongoing"; // 시작일과 종료일 사이에 현재 날짜가 있는 경우 진행중
    } else if (diff === 0) {
      status = "ongoing"; // 시작일이 오늘인 경우 진행중
    } else if (diff <= 3) {
      status = "critical"; // 매우 임박 (3일 이내, 경계선 있음)
    } else if (diff <= 7) {
      status = "imminent"; // 임박 (7일 이내, 경계선 없음)
    } else {
      status = "upcoming"; // 일반
    }
  } catch (e) {
    console.warn("Invalid date:", { startAt, endAt });
    diff = undefined;
  }

  const getStatusStyles = (status: DateStatus) => {
    switch (status) {
      case "upcoming":
        return "bg-gray-50 text-gray-500"; // 일반 (D-117)
      case "imminent":
        return "bg-sky-50 text-sky-500"; // 임박 (D-7~D-4, 경계선 없음)
      case "critical":
        return "bg-sky-50 text-sky-500 border-2 border-sky-100"; // 매우 임박 (D-3~D-1, 경계선 있음)
      case "ongoing":
        return "bg-sky-50 text-sky-500 border-2 border-sky-100"; // 행사중
      case "ended":
        return "bg-gray-50 text-gray-500"; // 종료
      default:
        return "bg-gray-50 text-gray-500";
    }
  };

  const getDateText = () => {
    if (typeof diff !== "number") return "";
    if (status === "ended") return "종료";

    if (isRegistration) {
      if (status === "ongoing") return "신청 D-DAY";
      return `신청 D-${diff}`;
    } else {
      if (status === "ongoing") return "행사중";
      if (diff === 1) return "내일 시작";
      return `D-${diff}`;
    }
  };

  return (
    <div
      style={{ fontSize: "15px", borderRadius: "8px" }}
      className={`inline-flex items-center justify-center px-[6px] py-[2px] font-pretendard font-medium text-[15px] leading-[22px] whitespace-nowrap ${getStatusStyles(status)} ${className}`}
    >
      {status === "ongoing" ? (
        <div className="inline-flex items-center gap-[6px]">
          <span>{getDateText()}</span>
          <img src={liveIndicator} alt="진행중" className="w-[6px] h-[6px]" />
        </div>
      ) : (
        getDateText()
      )}
    </div>
  );
}
