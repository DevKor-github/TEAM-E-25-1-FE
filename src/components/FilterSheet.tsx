import React from "react";
import AllToggleButton from "./ui/AllToggleButton";
import ToggleButton from "./ui/ToggleButton";
import SegmentedControl from "./ui/SegmentedControl";
import { BottomButtonsCombo2 } from "./ui/bottomButtonsCombo";
import { EventType } from "./ui/EventTypeIndicator";
import BottomSheet from "./ui/bottomSheet";

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

  const toggleType = (type: EventType) => {
    setFilterState({
      ...filterState,
      types: filterState.types.includes(type)
        ? filterState.types.filter((t) => t !== type)
        : [...filterState.types, type],
    });
  };

  const toggleAll = () => {
    setFilterState({
      ...filterState,
      types: filterState.types.length === ALL_TYPES.length ? [] : ALL_TYPES,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-end z-50">
      <div className="w-[375px] min-h-[132px] bg-white rounded-[24px] mx-auto flex flex-col items-center">
        <div className="w-full flex flex-col items-center">
          <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mt-3 mb-4" />
          <div className="w-full px-5">
            <div className="font-bold text-[20px] leading-[28px] text-[var(--Grays-Gray-900)] font-pretendard mb-4 mt-1">필터 설정</div>
            <div className="mb-5 w-full">
              <div className="font-medium text-[14px] leading-[20px] text-[var(--Grays-Gray-400)] font-pretendard mb-2">행사종류</div>
              <AllToggleButton
                label="전체 선택"
                checked={filterState.types.length === ALL_TYPES.length}
                onClick={toggleAll}
              />
              <div className="grid grid-cols-2 gap-2 mt-2">
                {ALL_TYPES.map((type) => (
                  <ToggleButton
                    key={type}
                    label={type}
                    checked={filterState.types.includes(type)}
                    onClick={() => toggleType(type)}
                  />
                ))}
              </div>
            </div>
            <div className="mb-5 w-full">
              <div className="font-medium text-[14px] leading-[20px] text-[var(--Grays-Gray-400,#99A1B3)] font-pretendard mb-2">행사일정</div>
              <SegmentedControl
                segments={["지난 행사 포함", "지난 행사 제외"]}
                selected={filterState.includePast ? "지난 행사 포함" : "지난 행사 제외"}
                onChange={(val: string) => setFilterState({ ...filterState, includePast: val === "지난 행사 포함" })}
                fullWidth
              />
            </div>
            <div className="w-full flex justify-center">
              <BottomButtonsCombo2
                leftLabel="닫기"
                rightLabel="저장하기"
                onLeftClick={onClose}
                onRightClick={onApply}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
