import React from "react";
import AllToggleButton from "./ui/AllToggleButton";
import ToggleButton from "./ui/ToggleButton";
import { BottomButtonsCombo2 } from "./ui/bottomButtonsCombo";
import { EventType } from "./ui/EventTypeIndicator";

export type FilterState = {
  types: EventType[];
  includePast: boolean;
  hasExplicitDateFilter?: boolean; // 사용자가 명시적으로 날짜 필터를 설정했는지 여부
};

const ALL_TYPES: EventType[] = [
  "축제", "강연", "설명회", "박람회", "대회", "공모전", "교육", "취업·창업"
];

interface FilterSheetProps {
  open: boolean;
  onClose: () => void;
  filterState: FilterState;
  setFilterState: (state: FilterState) => void;
  onApply: () => void;
}

export default function FilterSheet({ open, onClose, filterState, setFilterState, onApply }: FilterSheetProps) {
  if (!open) return null;

  // 임시 필터 상태 (FilterSheet 내부에서만 사용)
  const [tempFilterState, setTempFilterState] = React.useState<FilterState>(filterState);

  // FilterSheet가 열릴 때마다 현재 필터 상태를 임시 상태로 복사
  React.useEffect(() => {
    if (open) {
      setTempFilterState(filterState);
    }
  }, [open, filterState]);

  // FilterSheet가 열렸을 때 body 스크롤 방지
  React.useEffect(() => {
    // open 상태와 관계없이 컴포넌트가 마운트되면 스크롤을 막고, 언마운트 시 해제
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden"; // html 태그에도 적용
    
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []); // 의존성 배열 비움 (마운트 시 실행)

  const toggleType = (type: EventType) => {
    setTempFilterState({
      ...tempFilterState, 
      types: tempFilterState.types.includes(type)
        ? tempFilterState.types.filter((t) => t !== type)
        : [...tempFilterState.types, type],
    });
  };

  const toggleAll = () => {
    setTempFilterState({
      ...tempFilterState,
      types: tempFilterState.types.length === ALL_TYPES.length ? [] : ALL_TYPES,
    });
  };

  // 저장하기 버튼 클릭 시 실제 필터 상태에 적용
  const handleApply = () => {
    // 저장하기를 누르면 항상 명시적으로 필터를 설정한 것으로 처리
    setFilterState({
      ...tempFilterState,
      hasExplicitDateFilter: true
    });
    onApply();
  };

  // 닫기 버튼 클릭 시 임시 상태 초기화
  const handleClose = () => {
    setTempFilterState(filterState); // 원래 상태로 되돌림
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-end justify-center z-50 p-[10px]  overflow-hidden">
      <div className="w-[375px] min-h-[132px] bg-white rounded-[24px] flex flex-col items-center">
        <div className="w-full flex flex-col items-center">
          {/* <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mt-3 mb-4" /> */} {/*grabber 삭제*/}
          <div className="w-full px-5">
            <div className="font-bold text-[20px] leading-[28px] text-[var(--Grays-Gray-900)] font-pretendard mb-4 mt-8">필터 설정</div>
            <div className="mb-5 w-full">
              <div className="font-medium text-[14px] leading-[20px] text-[var(--Grays-Gray-400,#99A1B3)] font-pretendard mb-2">행사종류</div>
              <div className="flex justify-center mb-3">
                <AllToggleButton
                  label="모두 선택하기"
                  checked={tempFilterState.types.length === ALL_TYPES.length}
                  onClick={toggleAll}
                />
              </div>
              <div className="flex justify-center">
                <div className="w-[315px] grid grid-cols-2 gap-[8px]">
                  {ALL_TYPES.map((type) => (
                    <ToggleButton
                      key={type}
                      label={type}
                      checked={tempFilterState.types.includes(type)}
                      onClick={() => toggleType(type)}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="mb-5 w-full">
              <div className="font-medium text-[14px] leading-[20px] text-[var(--Grays-Gray-400,#99A1B3)] font-pretendard mb-2">행사일정</div>
              <div className="flex justify-center">
                <div className="w-[315px]">
                  <div className="flex p-[2px] bg-gray-50 rounded-[12px] w-full" style={{ minHeight: 40 }}>
                    <button
                      type="button"
                      className={`flex-1 px-[12px] py-[8px] text-[17px] font-pretendard leading-[24px] flex items-center justify-center transition-colors duration-150 rounded-[10px] focus-visible:outline-none focus-visible:ring-0 ${
                        tempFilterState.includePast
                          ? "bg-sky-50 text-sky-500 font-medium shadow-none"
                          : "bg-gray-50 text-[var(--Grays-Gray-500)] hover:bg-[var(--Grays-Gray-100)] font-normal"
                      }`}
                      onClick={() => setTempFilterState({ ...tempFilterState, includePast: true, hasExplicitDateFilter: true })}
                    >
                      지난 행사 포함
                    </button>
                    <button
                      type="button"
                      className={`flex-1 px-[12px] py-[8px] text-[17px] font-pretendard leading-[24px] flex items-center justify-center transition-colors duration-150 rounded-[10px] focus-visible:outline-none focus-visible:ring-0 ${
                        !tempFilterState.includePast
                          ? "bg-sky-50 text-sky-500 font-medium shadow-none"
                          : "bg-gray-50 text-[var(--Grays-Gray-500)] hover:bg-[var(--Grays-Gray-100)] font-normal"
                      }`}
                      onClick={() => setTempFilterState({ ...tempFilterState, includePast: false, hasExplicitDateFilter: true })}
                    >
                      지난 행사 제외
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex justify-center">
              <BottomButtonsCombo2
                leftLabel="닫기"
                rightLabel="저장하기"
                onLeftClick={handleClose}
                onRightClick={handleApply}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
