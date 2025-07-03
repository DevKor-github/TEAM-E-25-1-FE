import React, { useState, useRef } from "react";
import Numbering from "./numbering";

interface Tab {
  label: string;
  id: string;
  numbering?: React.ReactNode;
}

interface TabbedControlProps {
  tabs: Tab[];
  onTabChange?: (tabId: string) => void;
}

const TabbedControl: React.FC<TabbedControlProps> = ({ tabs, onTabChange }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id);

  // 마우스 드래그 가로 스크롤 관련 상태
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    if (onTabChange) onTabChange(tabId);
  };

  // 마우스 드래그로 탭 스크롤
  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (scrollRef.current?.offsetLeft ?? 0);
    scrollLeft.current = scrollRef.current?.scrollLeft ?? 0;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX.current;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const onMouseUp = () => {
    isDragging.current = false;
  };

  const onMouseLeave = () => {
    isDragging.current = false;
  };

  return (
    <div
      ref={scrollRef}
      className="inline-flex items-center border-b border-gray-200 bg-white w-full overflow-x-auto whitespace-nowrap cursor-grab scrollbar-hide"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      style={{ userSelect: isDragging.current ? "none" : "auto" }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const hasNumbering = !!tab.numbering;
        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`flex items-center bg-white h-10 px-3 py-2 text-center text-[17px] leading-6 font-pretendard
              ${hasNumbering ? "gap-2" : ""}
              ${
                isActive
                  ? "border-b-2 border-gray-700 font-medium text-gray-900"
                  : "border-b border-gray-200 font-normal text-gray-500"
              }
              transition-colors duration-150`}
          >
            {tab.label}
            {hasNumbering && <Numbering>{tab.numbering}</Numbering>}
          </button>
        );
      })}
    </div>
  );
};

export default TabbedControl;
