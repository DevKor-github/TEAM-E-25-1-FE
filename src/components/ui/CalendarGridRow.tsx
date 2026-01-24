import React from "react";
import CalendarItem from "./CalendarItem";
import CalendarMargin from "./CalendarMargin";
import { cn } from "@/lib/utils";

interface DayData {
  date: string;
  state: "Enabled" | "Deactivated";
  isCurrentMonth: boolean;
}

interface CalendarGridRowProps extends React.HTMLAttributes<HTMLDivElement> {
  weekData: DayData[];
  selectedDate?: string | null;
  onDateClick?: (date: string, isCurrentMonth: boolean) => void;
}

export default function CalendarGridRow({
  className,
  weekData,
  selectedDate,
  onDateClick,
  ...props
}: CalendarGridRowProps) {
  // 주의 첫 번째(일요일)와 마지막(토요일) 날짜가 현재 월인지 확인
  const firstDayInMonth = weekData[0]?.isCurrentMonth ?? false;
  const lastDayInMonth = weekData[6]?.isCurrentMonth ?? false;

  return (
    <div
      className={cn(
        "flex w-full bg-white items-start justify-start",
        className
      )}
      {...props}
    >
      <CalendarMargin nearbyItemOnMonth={firstDayInMonth} />

      {weekData.map((day, index) => {
        const isSelected = selectedDate === day.date && day.isCurrentMonth;
        return (
          <CalendarItem
            key={index}
            className="flex-1 min-w-0"
            date={day.date}
            events="None"
            state={isSelected ? "Activated" : day.state}
            onClick={() => onDateClick?.(day.date, day.isCurrentMonth)}
          />
        );
      })}

      <CalendarMargin nearbyItemOnMonth={lastDayInMonth} />
    </div>
  );
}
