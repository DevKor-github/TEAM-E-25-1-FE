import React from "react";
import Grabber from "@/components/ui/grabber";

interface BottomSheetProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  title,
  description,
  children,
}) => (
  <div className="w-[355px] min-h-[132px] bg-white rounded-2xl">
    <Grabber />
    {/* header */}
    <div className="w-[355px] min-h-[84px] pt-2 pr-5 pl-5 gap-1">
      {title && (
        <div className="w-[315px] min-h-[28px] text-gray-900 text-title4 font-bold font-pretendard tracking-normal">
          {title}
        </div>
      )}
      {description && (
        <div className="w-[315px] min-h-[44px] text-gray-500 text-body2 font-normal font-pretendard tracking-normal">
          {description}
        </div>
      )}
    </div>
    <div>{children}</div>
  </div>
);

export default BottomSheet;
