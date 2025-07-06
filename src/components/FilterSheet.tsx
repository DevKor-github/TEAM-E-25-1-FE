import React from "react";
import AllToggleButton from "./ui/AllToggleButton";
import ToggleButton from "./ui/ToggleButton";
import SegmentedControl from "./ui/SegmentedControl";
import { BottomButtonsCombo2 } from "./ui/bottomButtonsCombo";
import { EventType } from "./ui/EventTypeIndicator";

export type FilterState = {
  types: EventType[];
  includePast: boolean;
};

const ALL_TYPES: EventType[] = [
  "축제", "강연", "설명회", "박람회", "대회", "공모전"
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
    setFilterState(tempFilterState);
    onApply();
  };

  // 닫기 버튼 클릭 시 임시 상태 초기화
  const handleClose = () => {
    setTempFilterState(filterState); // 원래 상태로 되돌림
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-end justify-center z-50 p-[10px]">
      <div className="w-[375px] min-h-[132px] bg-white rounded-[24px] flex flex-col items-center">
        <div className="w-full flex flex-col items-center">
          <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mt-3 mb-4" />
          <div className="w-full px-5">
            <div className="font-bold text-[20px] leading-[28px] text-[var(--Grays-Gray-900)] font-pretendard mb-4 mt-1">필터 설정</div>
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
                  <SegmentedControl
                    segments={["지난 행사 포함", "지난 행사 제외"]}
                    selected={tempFilterState.includePast ? "지난 행사 포함" : "지난 행사 제외"}
                    onChange={(val: string) => setTempFilterState({ ...tempFilterState, includePast: val === "지난 행사 포함" })}
                  />
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
