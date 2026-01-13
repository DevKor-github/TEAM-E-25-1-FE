import { useEffect, useRef } from "react";
import Grabber from "@/components/ui/grabber";
import checkIcon_sky500 from "@/assets/checkicon_sky500.svg";

interface CalendarMonthSheetProps {
  open: boolean;
  onClose: () => void;
  currentYear: number;
  currentMonth: number;
  onSelect: (year: number, month: number) => void;
}

export default function CalendarMonthSheet({
  open,
  onClose,
  currentYear,
  currentMonth,
  onSelect,
}: CalendarMonthSheetProps) {
  const selectedButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open && selectedButtonRef.current) {
      // 모달이 열리면 currentYear, currentMonth 버튼 위치로 스크롤
      selectedButtonRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [open]);

  if (!open) return null;

  // 2025년 1월 ~ 2026년 12월 생성
  const months = [];
  for (let year = 2025; year <= 2026; year++) {
    for (let month = 1; month <= 12; month++) {
      months.push({ year, month });
    }
  }

  const handleMonthClick = (year: number, month: number) => {
    onSelect(year, month);
    onClose();
  };

  return (
    <div
      className="fixed p-2.5 flex flex-col justify-end gap-2.5  inset-0 bg-black bg-opacity-30 z-50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[440px] max-h-[440px] mx-auto p-2.5 bg-white rounded-[24px] flex flex-col items-end"
        onClick={(e) => e.stopPropagation()}
      >
        <Grabber onClick={onClose} />
        <div className="flex flex-col w-full pt-2 pb-4 px-5 gap-1">
          <div className="w-full text-gray-900 text-title4 font-bold font-pretendard">
            월 선택하기
          </div>
        </div>

        {/* 월 선택 버튼들 */}
        <div className="flex flex-col w-full px-1 pb-5 overflow-y-auto">
          {months.map(({ year, month }) => {
            const isSelected = year === currentYear && month === currentMonth;
            return (
              <button
                key={`${year}-${month}`}
                ref={isSelected ? selectedButtonRef : null}
                className="flex w-full items-center justify-between rounded-[12px] px-4 py-3 gap-2 hover:bg-gray-50 transition-colors"
                onClick={() => handleMonthClick(year, month)}
              >
                <div className="text-body1 font-medium font-pretendard text-gray-700">
                  {year}년 {month}월
                </div>
                {isSelected && (
                  <img
                    src={checkIcon_sky500}
                    width={24}
                    height={24}
                    alt="selected"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
