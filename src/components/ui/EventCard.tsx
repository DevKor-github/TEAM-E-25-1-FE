import React from "react";
import EventImage from "./EventImage";
import EventTypeIndicator, { EventType } from "./EventTypeIndicator";
import EventDateIndicator from "./EventDateIndicator";
import heartRed from "@/assets/heart_red500.svg";
import heartGray from "@/assets/heart_gray.svg";
import heartNon from "@/assets/heart_nothing.svg";

interface EventCardProps {
  title: string;
  date: string;
  tags: EventType[]; // EventType[]로 강제
  dday: number;
  isLiked: boolean;
  likeCount: number;
  imageUrl: string;
  org: string;
  period: string;
  location: string;
}

export default function EventCard({
  title,
  date,
  tags,
  dday,
  isLiked,
  likeCount,
  imageUrl,
  org,
  period,
  location,
}: EventCardProps) {
  return (
    <div className="flex flex-col w-[320px] rounded-2xl bg-white p-4 shadow-sm">
      <div className="relative mb-2">
        <img
          src={imageUrl}
          alt={title}
          className="rounded-xl w-full h-[120px] object-cover"
        />
        <button className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center">
          <img src={isLiked ? heartRed : heartNon} alt="like" className="w-7 h-7" />
        </button>
      </div>
      <div className="text-xs font-medium text-[#B0A8C6] mb-1 leading-[18px]">{org}</div>
      <div className="font-pretendard font-semibold text-[17px] leading-[24px] text-gray800 mb-1 overflow-hidden text-ellipsis whitespace-nowrap">{title}</div>
      <div className="font-pretendard text-[16px] leading-[22px] text-gray-500 font-normal mb-3">{date}</div>
      <div className="flex gap-2 items-center mb-2">
        {/* 여러 태그를 각각 렌더링 */}
        {(tags ?? []).map((tag) => (
          <EventTypeIndicator key={tag} type={tag} />
        ))}
        <EventDateIndicator dday={dday} />
        <div className="flex items-center gap-1 ml-auto min-w-[52px] pr-1">
          <img src={heartGray} alt="like-count" className="w-5 h-5" />
          <span className="font-pretendard text-sm font-body-3 text-gray-500">{likeCount > 999 ? '999+' : likeCount}</span>
        </div>
      </div>
    </div>
  );
}
