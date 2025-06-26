import React from "react";

interface NumberingProps {
  children?: React.ReactNode;
}

const Numbering: React.FC<NumberingProps> = ({ children }) => {
  return (
    <span className="inline-flex items-center justify-center bg-gray-100 rounded-[6px] px-1 py-[2px]">
      <span className="font-pretendard font-medium text-[14px] leading-[20px] text-gray-600 text-center">
        {children}
      </span>
    </span>
  );
};

export default Numbering;
