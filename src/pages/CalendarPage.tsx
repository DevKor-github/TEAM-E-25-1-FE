import { useState } from "react";
import HeaderFrame from "@/components/HeaderFrame";
import { Button } from "@/components/ui/buttons";
import CalendarGridRow from "@/components/ui/CalendarGridRow";
import CalendarMargin from "@/components/ui/CalendarMargin";
import CalendarMonthSheet from "@/components/CalendarMonthSheet";
import triangleIcon from "@/assets/triangleIcon.svg";
import emptyFileIcon from "@/assets/emptyFileIcon.svg";

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
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // 현재 년/월로 캘린더 기본 년/월 설정
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);

  const handleMonthSelect = (year: number, month: number) => {
    setCurrentYear(year);
    setCurrentMonth(month);
    setSelectedDate(null); // 년/월 변경 시 선택 초기화
  };

  const handleDateClick = (date: string, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return; // 현재 월이 아니면 클릭 무시
    setSelectedDate(date);
  };

  // 달력 데이터 생성 함수
  const generateCalendarData = () => {
    const firstDay = new Date(currentYear, currentMonth - 1, 1);
    const lastDay = new Date(currentYear, currentMonth, 0);
    const prevMonthLastDay = new Date(currentYear, currentMonth - 1, 0);

    const firstDayOfWeek = firstDay.getDay(); // 0 (일) ~ 6 (토)
    const lastDate = lastDay.getDate();
    const prevMonthLastDate = prevMonthLastDay.getDate();

    const calendarDays: Array<{
      date: string;
      state: "Enabled" | "Deactivated";
      isCurrentMonth: boolean;
    }> = [];

    // 이전 달 날짜들 (Deactivated)
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      calendarDays.push({
        date: String(prevMonthLastDate - i),
        state: "Deactivated",
        isCurrentMonth: false,
      });
    }

    // 현재 달 날짜들 (Enabled)
    for (let date = 1; date <= lastDate; date++) {
      calendarDays.push({
        date: String(date),
        state: "Enabled",
        isCurrentMonth: true,
      });
    }

    // 다음 달 날짜들 (Deactivated) - 6주(42일)를 채우기 위해
    const remainingDays = 42 - calendarDays.length;
    for (let date = 1; date <= remainingDays; date++) {
      calendarDays.push({
        date: String(date),
        state: "Deactivated",
        isCurrentMonth: false,
      });
    }

    // 7일씩 6주로 나누기
    const weeks: (typeof calendarDays)[] = [];
    for (let i = 0; i < 6; i++) {
      weeks.push(calendarDays.slice(i * 7, (i + 1) * 7));
    }

    return weeks;
  };

  const calendarWeeks = generateCalendarData();

  // 선택된 날짜가 속한 주 찾기
  const selectedWeek = selectedDate
    ? calendarWeeks.find((week) =>
        week.some((day) => day.date === selectedDate && day.isCurrentMonth)
      )
    : null;

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
            <CalendarMargin className="h-[18px] flex-[0.03_0_0]" />
            {weekDays.map((day, index) => (
              <div
                key={index}
                className="flex-1 min-w-0 px-[2px] gap-2.5 text-center font-medium text-tiny2 text-gray-700 font-pretendard"
              >
                {day}
              </div>
            ))}
            <CalendarMargin className="h-[18px] flex-[0.03_0_0]" />
          </div>
        </div>

        <div className="flex flex-col w-full overflow-y-auto">
          {selectedDate && selectedWeek ? (
            // 특정 날짜가 선택되면 해당 주만 표시
            <CalendarGridRow
              weekData={selectedWeek}
              selectedDate={selectedDate}
              onDateClick={handleDateClick}
            />
          ) : (
            // 특정 날짜가 선택되지 않으면 전체 캘린더 표시
            calendarWeeks.map((week, weekIndex) => (
              <CalendarGridRow
                key={weekIndex}
                weekData={week}
                selectedDate={selectedDate}
                onDateClick={handleDateClick}
              />
            ))
          )}
        </div>

        {selectedDate && (
          <>
            <div className="flex w-full gap-5 px-5 pt-5 pb-2 items-center justify-between">
              <div className="w-full text-title4 font-semibold text-gray-800 font-pretendard">
                {currentMonth}월 {selectedDate}일 행사
              </div>
              <Button
                styleType="gray"
                size="md"
                className="min-w-fit whitespace-nowrap text-body2 text-gray-700"
                onClick={() => setSelectedDate(null)}
              >
                캘린더로 돌아가기
              </Button>
            </div>

            {/* 해당 날짜에 행사가 없는 경우 */}
            <div className="flex flex-col w-full gap-3 items-center px-5 py-10">
              <img
                src={emptyFileIcon}
                alt="search-result-empty"
                className="w-10 h-10"
              />
              <div className="text-center text-body2 text-gray-500 font-pretendard">
                {currentMonth}월 {selectedDate}일에는 행사가 없어요.
                <br />
                다른 날짜를 선택해주세요.
              </div>
            </div>

            {/* 해당 날짜에 행사가 있을 때 리스트 표시 */}
          </>
        )}

        {!selectedDate && (
          <div className="pt-5 pb-12 font-semibold text-title4 text-gray-800 font-pretendard text-center">
            날짜를 탭하고 <br />
            행사를 찾아보세요
          </div>
        )}

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
