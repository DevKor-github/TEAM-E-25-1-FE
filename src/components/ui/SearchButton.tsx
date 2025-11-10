import { useState } from "react";
import searchIcon_gray from "@/assets/searchIcon_gray.svg";
import searchIcon_sky300 from "@/assets/searchIcon_sky300.svg";

export const SearchButton = () => {
  const [isHovered, setIsHovered] = useState(false);

  const searchIcon = isHovered ? searchIcon_sky300 : searchIcon_gray;
  const backGroundColor = isHovered ? "bg-sky-50" : "bg-gray-50";
  const borderColor = isHovered ? "border-sky-200" : "border-gray-200";
  const valueColor = isHovered ? "text-sky-400" : "text-gray-400";

  return (
    <button
      type="button"
      aria-label="검색"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      className={`flex pl-3 pr-4 py-2 gap-2 rounded-full border ${borderColor} ${backGroundColor}`}
    >
      <img src={searchIcon} width={20} height={20} alt="search" />
      <span
        className={`${backGroundColor} ${valueColor} text-body2 font-medium font-pretendard`}
      >
        행사 검색
      </span>
    </button>
  );
};
