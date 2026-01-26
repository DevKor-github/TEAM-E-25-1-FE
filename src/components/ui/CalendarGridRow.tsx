import React, { useMemo } from "react";
import CalendarItem from "./CalendarItem";
import CalendarMargin from "./CalendarMargin";
import { cn } from "@/lib/utils";
import { CalendarItemEventCount } from "./CalendarItem";

interface Article {
  id: string;
  title: string;
  tags: string[];
}

interface DayData {
  date: string;
  state: "Enabled" | "Deactivated";
  isCurrentMonth: boolean;
  eventCount: CalendarItemEventCount;
  articles: Article[];
  year: number;
  month: number;
}

interface CalendarGridRowProps extends React.HTMLAttributes<HTMLDivElement> {
  weekData: DayData[];
  selectedDate?: string | null;
  onDateClick?: (date: string, isCurrentMonth: boolean) => void;
  currentYear: number;
  currentMonth: number;
  isFullCalendarView?: boolean;
}

// 오늘 날짜 계산 (컴포넌트 외부로 이동하여 매 렌더링마다 재생성 방지)
const getToday = () => {
  const today = new Date();
  return {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    date: today.getDate(),
  };
};

// 날짜 상태 결정 함수
const getItemState = (
  day: DayData,
  selectedDate: string | null | undefined,
  isFullCalendarView: boolean,
  today: ReturnType<typeof getToday>,
): "Enabled" | "Activated" | "Deactivated" => {
  const isSelected = selectedDate === day.date && day.isCurrentMonth;
  const isToday =
    day.year === today.year &&
    day.month === today.month &&
    parseInt(day.date) === today.date;

  // 선택된 날짜가 최우선
  if (isSelected) return "Activated";

  // 전체 캘린더 보기에서 오늘 날짜
  if (isFullCalendarView && isToday && day.isCurrentMonth) return "Activated";

  // 기본 상태
  return day.state;
};

export default function CalendarGridRow({
  className,
  weekData,
  selectedDate,
  onDateClick,
  currentYear,
  currentMonth,
  isFullCalendarView = true,
  ...props
}: CalendarGridRowProps) {
  const firstDayInMonth = weekData[0]?.isCurrentMonth ?? false;
  const lastDayInMonth = weekData[6]?.isCurrentMonth ?? false;

  // 오늘 날짜를 메모이제이션 (하루에 한 번만 계산)
  const today = useMemo(() => getToday(), []);

  return (
    <div
      className={cn(
        "flex w-full items-start justify-start bg-white",
        className,
      )}
      {...props}
    >
      <CalendarMargin nearbyItemOnMonth={firstDayInMonth} />

      {weekData.map((day, index) => {
        const itemState = getItemState(
          day,
          selectedDate ?? null,
          isFullCalendarView,
          today,
        );

        return (
          <CalendarItem
            key={`${day.year}-${day.month}-${day.date}-${index}`}
            className="flex-1 min-w-0"
            date={day.date}
            events={day.eventCount}
            articles={day.articles}
            state={itemState}
            onClick={() => onDateClick?.(day.date, day.isCurrentMonth)}
          />
        );
      })}

      <CalendarMargin nearbyItemOnMonth={lastDayInMonth} />
    </div>
  );
}
