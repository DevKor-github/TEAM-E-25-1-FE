import { useState } from "react";
import HeaderFrame from "@/components/HeaderFrame";
import CalendarItem from "@/components/ui/CalendarItem";
import CalendarEvent from "@/components/ui/CalendarEvent";
import CalendarMargin from "@/components/ui/CalendarMargin";
import CalendarMonthSheet from "@/components/CalendarMonthSheet";
import { cn } from "@/lib/utils";
import triangleIcon from "@/assets/triangleIcon.svg";

export type DeactivatedItemType = "Both Enabled" | "Left Only" | "Right Only";

interface CalendarGridRowProps extends React.HTMLAttributes<HTMLDivElement> {
  deactivatedItem?: DeactivatedItemType;
}

export default function CalendarPage({
  className,
  deactivatedItem = "Both Enabled",
  ...props
}: CalendarGridRowProps) {
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
  const [calendarMonthSheetOpen, setCalendarMonthSheetOpen] = useState(false);

  // 현재 년/월로 캘린더 기본 년/월 설정
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);

  const handleMonthSelect = (year: number, month: number) => {
    setCurrentYear(year);
    setCurrentMonth(month);
  };

  return (
    // 바깥 프레임
    <div className="w-full min-h-screen bg-gray-100">
      {/* 중앙 컨텐츠 프레임 */}
      <div className="w-full max-w-[460px] mx-auto bg-white min-h-screen">
        <HeaderFrame />

        <div className="flex flex-col w-full border-b border-gray-100 pt-5 pb-3 gap-4">
          <div className="flex w-full px-5 gap-2.5">
            <div className="gap-1 font-semibold text-title3 text-gray-800 font-pretendard">
              {currentYear}년 {currentMonth}월
            </div>
            <img
              src={triangleIcon}
              width={24}
              height={24}
              alt="triangle icon"
              className="cursor-pointer"
              onClick={() => setCalendarMonthSheetOpen(true)}
            />
          </div>

          <div className="flex w-full">
            <CalendarMargin className="w-[2px] h-[18px]" />
            {weekDays.map((day) => (
              <div className="w-full px-[2px] gap-2.5 text-center font-medium text-tiny2 text-gray-700 font-pretendard">
                {day}
              </div>
            ))}
            <CalendarMargin className="w-[2px] h-[18px]" />
          </div>
        </div>

        <div
          className={cn(
            "flex w-full bg-white items-center justify-center",
            className
          )}
          {...props}
        >
          <CalendarMargin nearbyItemOnMonth={deactivatedItem !== "Left Only"} />
          <CalendarItem
            date="1"
            events="None"
            state={deactivatedItem === "Left Only" ? "Deactivated" : "Enabled"}
          />
          <CalendarItem
            date="2"
            events="1"
            state={deactivatedItem === "Left Only" ? "Deactivated" : "Enabled"}
          />
          <CalendarItem date="3" events="2" state="Enabled" />
          <CalendarItem date="4" events="3" state="Enabled" />
          <CalendarItem
            date="5"
            events="4+"
            state={deactivatedItem === "Right Only" ? "Deactivated" : "Enabled"}
          />
          <CalendarItem
            date="6"
            events="None"
            state={deactivatedItem === "Right Only" ? "Deactivated" : "Enabled"}
          />
          <CalendarItem
            date="7"
            events="None"
            state={deactivatedItem === "Right Only" ? "Deactivated" : "Enabled"}
          />
          <CalendarMargin
            nearbyItemOnMonth={deactivatedItem !== "Right Only"}
          />
        </div>

        {calendarMonthSheetOpen && (
          <CalendarMonthSheet
            open={calendarMonthSheetOpen}
            onClose={() => setCalendarMonthSheetOpen(false)}
            currentYear={currentYear}
            currentMonth={currentMonth}
            onSelect={handleMonthSelect}
          />
        )}
      </div>
    </div>
  );
}
