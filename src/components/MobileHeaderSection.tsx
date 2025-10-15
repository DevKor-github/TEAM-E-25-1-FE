import { useState } from "react";
import FilterButton from "@/components/ui/FilterButton";
import Divider from "@/components/ui/Divider";
import SegmentedControl from "@/components/ui/SegmentedControl";
import { SearchBar } from "@/components/ui/SearchBar";
import dotIcon from "@/assets/Dot.svg";

interface MobileHeaderSectionProps {
  eventCount: number;
  selectedChips?: string[]; // 여러 칩을 배열로 받음
  segments: string[];
  selectedSegment: string;
  onSegmentChange: (value: string) => void;
  onReset: () => void;
  onFilter?: () => void;
  title?: string; // 제목을 prop으로 받을 수 있도록 추가
  hasActiveFilters?: boolean; // 활성화된 필터가 있는지 여부
}

export default function MobileHeaderSection({
  eventCount,
  selectedChips,
  segments,
  selectedSegment,
  onSegmentChange,
  onReset,
  onFilter,
  title = "행사", // 기본값을 "행사"로 설정
  hasActiveFilters = false,
}: MobileHeaderSectionProps) {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="w-full bg-white rounded-2xl p-0 flex flex-col gap-2">
      {/* 상단: 행사, 개수, dot, 필터 */}
      <div className="flex items-center justify-between pt-5">
        <span className="text-[23px] font-pretendard font-semibold text-black">
          {title}
        </span>
        <div className="flex items-center">
          <span className="text-[17px] font-pretendard font-medium text-gray-400 pr-2">
            {eventCount}개
          </span>
          <img src={dotIcon} alt="dot" className="w-1.5 h-1.5 mr-3" />
          <FilterButton label="필터" onClick={onFilter || onReset} />
        </div>
      </div>

      {/* chips과 초기화 버튼: hasActiveFilters가 true일 때만 렌더링 */}
      {hasActiveFilters && (
        <>
          {/* chips와 초기화 버튼 */}
          <div className="flex items-center justify-between gap-2">
            {/* chips: selectedChips가 있을 때만 렌더링 */}
            <div className="flex gap-2 flex-wrap flex-1">
              {selectedChips &&
                selectedChips.length > 0 &&
                selectedChips.map((chip, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-[6px] bg-sky-50 text-sky-500 text-[15px] font-pretendard font-medium"
                  >
                    {chip}
                  </span>
                ))}
            </div>
            {/* 초기화 버튼 */}
            <FilterButton label="초기화" onClick={onReset} />
          </div>
          {/* Divider */}
          <div>
            <Divider />
          </div>
        </>
      )}

      <SegmentedControl
        segments={segments}
        selected={selectedSegment}
        onChange={onSegmentChange}
      />

      <Divider />

      <SearchBar value={searchValue} onChange={setSearchValue} />
    </div>
  );
}
