import React from "react";
import FilterButton from "./ui/FilterButton";
import Divider from "./ui/Divider";
import SegmentedControl from "./ui/SegmentedControl";
import dotIcon from "../assets/Dot.svg";

interface MobileHeaderSectionProps {
  eventCount: number;
  selectedChip?: string; // optional로 변경
  segments: string[];
  selectedSegment: string;
  onSegmentChange: (value: string) => void;
  onReset: () => void;
}

export default function MobileHeaderSection({
  eventCount,
  selectedChip,
  segments,
  selectedSegment,
  onSegmentChange,
  onReset,
}: MobileHeaderSectionProps) {
  return (
    <div className="w-full bg-white rounded-2xl p-5 flex flex-col gap-4">
      {/* 상단: 행사, 개수, dot, 초기화 */}
      <div className="flex items-center justify-between">
        <span className="text-[23px] font-pretendard font-semibold text-black">행사</span>
        <div className="flex items-center">
          <span className="text-[17px] font-pretendard font-medium text-gray-400 pr-2">{eventCount}개</span>
          <img src={dotIcon} alt="dot" className="w-1.5 h-1.5 mr-3" />
          <FilterButton label="필터" onClick={onReset} />
        </div>
      </div>
      {/* chip: selectedChip이 있을 때만 렌더링 */}
      {selectedChip && (
        <div className="flex gap-2">
          <span className="inline-flex items-center px-2 py-1 rounded-[6px] bg-blue-50 text-blue-500 text-[15px] font-pretendard font-medium">{selectedChip}</span>
        </div>
      )}
      {/* Divider */}
      <Divider />
      {/* SegmentedControl */}
      <SegmentedControl segments={segments} selected={selectedSegment} onChange={onSegmentChange} />
    </div>
  );
}
