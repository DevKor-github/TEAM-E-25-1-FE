import React, { useState } from "react";
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

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    if (onTabChange) onTabChange(tabId);
  };

  return (
    <div className="inline-flex items-center border-b border-gray-200 bg-white">
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
