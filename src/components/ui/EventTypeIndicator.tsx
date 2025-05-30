import React from "react";

export type EventType = "강연" | "공모전" | "대회" | "박람회" | "설명회" | "축제";

interface EventTypeIndicatorProps {
  types: EventType[];
  className?: string;
}

export default function EventTypeIndicator({ types, className = "" }: EventTypeIndicatorProps) {
  const getTypeStyles = (type: EventType) => {
    switch (type) {
      case "강연":
        return "bg-blue-50 text-blue-500";      case "공모전":
        return "bg-gray-50 text-gray-500";
      case "대회":
        return "bg-gray-50 text-gray-500";
      case "박람회":
        return "bg-green-50 text-green-500";
      case "설명회":
        return "bg-[#F5F0FF] text-[#8E51FF]";
      case "축제":
        return "bg-[#FFF7ED] text-[#FF6900]";
      default:
        return "bg-blue-50 text-blue-500";
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {types.map((type) => (
        <div
          key={type}
          className={`inline-flex items-center justify-center rounded-[8px] px-[6px] py-[2px] text-[15px] font-medium leading-[22px] whitespace-nowrap ${getTypeStyles(type)}`}
        >
          {type}
        </div>
      ))}
    </div>
  );
}
