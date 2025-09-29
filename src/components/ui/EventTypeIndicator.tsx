const allowedTagTypes = [
  "강연",
  "공모전",
  "대회",
  "박람회",
  "설명회",
  "축제",
  "교육",
  "취업·창업",
] as const; // 배열의 값을 변하지 않는 고정값(리터럴)으로 지정

type AllowedTagType = (typeof allowedTagTypes)[number]; // "강연" | "공모전" | "대회" | "박람회" | "설명회" | "축제"

// Export the type for use in other components
export type EventType = AllowedTagType;

interface EventTypeIndicatorProps {
  type: string;
  className?: string;
}

export default function EventTypeIndicator({
  type,
  className = "",
}: EventTypeIndicatorProps) {
  // 허용된 태그 타입이 아니면 null 반환
  if (!allowedTagTypes.includes(type as AllowedTagType)) {
    return null;
  }

  const getTypeStyles = (type: AllowedTagType) => {
    switch (type) {
      case "강연":
        return "bg-blue-50 text-blue-500";
      case "공모전":
        return "bg-gray-50 text-gray-500";
      case "대회":
        return "bg-gray-50 text-gray-500";
      case "박람회":
        return "bg-green-50 text-green-500";
      case "설명회":
        return "bg-[#F5F0FF] text-[#8E51FF]";
      case "축제":
        return "bg-[#FFF7ED] text-[#FF6900]";
      case "교육":
        return "bg-[#F5F0FF] text-[#8E51FF]"; 
      case "취업·창업":
        return "bg-blue-50 text-blue-500"; 
      default:
        return "bg-blue-50 text-blue-500";
    }
  };

  return (
    <div
      className={`font-pretendard font-medium text-[15px] inline-flex items-center justify-center rounded-[8px] px-[6px] py-[2px] body3 whitespace-nowrap ${getTypeStyles(
        type as AllowedTagType
      )} ${className}`}
    >
      {type}
    </div>
  );
}