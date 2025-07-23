import FilterButton from "./ui/FilterButton";
import Divider from "./ui/Divider";
import SegmentedControl from "./ui/SegmentedControl";
import dotIcon from "../assets/Dot.svg";

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
  return (
    <div className="w-full bg-white rounded-2xl p-0 flex flex-col gap-4">
      {/* 상단: 행사, 개수, dot, 필터/초기화 */}
      <div className="flex items-center justify-between pt-5">
        <span className="text-[23px] font-pretendard font-semibold text-black">{title}</span>
        <div className="flex items-center">
          <span className="text-[17px] font-pretendard font-medium text-gray-400 pr-2">
            {eventCount}개
          </span>
          <img src={dotIcon} alt="dot" className="w-1.5 h-1.5 mr-3" />
          <FilterButton 
            label={hasActiveFilters ? "초기화" : "필터"} 
            onClick={hasActiveFilters ? onReset : (onFilter || onReset)} 
          />
        </div>
      </div>
      
      {/* chips과 Divider: hasActiveFilters가 true일 때만 렌더링 */}
      {hasActiveFilters && (
        <>
          {/* chips: selectedChips가 있을 때만 렌더링 */}
          {selectedChips && selectedChips.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {selectedChips.map((chip, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-[6px] bg-sky-50 text-sky-500 text-[15px] font-pretendard font-medium"
                >
                  {chip}
                </span>
              ))}
            </div>
          )}
          {/* Divider */}
          <div>
            <Divider />
          </div>
        </>
      )}
      
      {/* SegmentedControl */}
      <div className="pb-5 flex justify-center">
        <SegmentedControl segments={segments} selected={selectedSegment} onChange={onSegmentChange} />
      </div>
    </div>
  );
}
