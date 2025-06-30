import React from "react";
import FilterButton from "./ui/FilterButton";
import Divider from "./ui/Divider";
import SegmentedControl from "./ui/SegmentedControl";
import dotIcon from "../assets/Dot.svg";

interface MobileHeaderSectionProps {
  eventCount: number;
  selectedChip: string; // 예: "강연 외 1개"
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
    <div className="w-full max-w-[375px] mx-auto bg-white rounded-2xl p-5 flex flex-col gap-4">
      {/* 상단: 행사, 개수, dot, 초기화 */}
      <div className="flex items-center justify-between">
        <span className="text-[23px] font-pretendard font-semibold text-black">행사</span>
        <div className="flex items-center">
          <span className="text-[17px] font-pretendard font-medium text-gray-400 pr-2">{eventCount}개</span>
          <img src={dotIcon} alt="dot" className="w-1.5 h-1.5 mr-3" />
          <FilterButton label="초기화" onClick={onReset} />
        </div>
      </div>
      {/* chip */}
      <div className="flex gap-2">
        <span className="inline-flex items-center px-2 py-1 rounded-[6px] bg-blue-50 text-blue-500 text-[15px] font-pretendard font-medium">{selectedChip}</span>
      </div>
      {/* Divider */}
      <Divider />
      {/* SegmentedControl */}
      <SegmentedControl segments={segments} selected={selectedSegment} onChange={onSegmentChange} />
    </div>
  );
}
