import { useState } from "react";
import searchIcon_gray from "@/assets/searchIcon_gray.svg";
import searchIcon_sky from "@/assets/searchIcon_sky.svg";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export const SearchBar = ({ value, onChange }: SearchBarProps) => {
  const [isTyping, setIsTyping] = useState(false);

  const searchIcon = isTyping ? searchIcon_sky : searchIcon_gray;
  const borderColor = isTyping ? "border-sky-500" : "border-gray-200";
  const valueColor = isTyping ? "text-gray-500" : "text-gray-400";

  return (
    <div
      className={`flex w-full px-4 py-3 gap-3 border ${borderColor} rounded-full bg-gray-50`}
    >
      <img src={searchIcon} width={24} height={24} alt="search" />
      <input
        className={`w-full bg-gray-50 ${valueColor} text-body2 font-medium font-pretendard`}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsTyping(true)}
        onBlur={() => setIsTyping(false)}
        placeholder="행사를 검색해보세요"
      />
    </div>
  );
};
