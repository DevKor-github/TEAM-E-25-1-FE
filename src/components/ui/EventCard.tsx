import React from "react";
import EventTypeIndicator, { EventType } from "./EventTypeIndicator";
import EventDateIndicator from "./EventDateIndicator";
import heartRed from "@/assets/heart_red500.svg";
import heartGray from "@/assets/heart_gray.svg";
import heartNon from "@/assets/heart_nothing.svg";

// Article 타입: 백엔드 스웨거 기준
export type Article = {
  id: string;
  title: string;
  organization: string;
  thumbnailPath: string;
  scrapCount: number;
  viewCount: number;
  tags: string;
  description: string;
  location: string;
  startAt: string;
  endAt: string;
  imagePaths: string[];
  registrationUrl: string;
};

export default function EventCard(article: Article) {
  // dday 계산
  const today = new Date();
  const end = new Date(article.endAt);
  const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  // tags 변환 (빈 문자열 방지)
  const tags = article.tags ? article.tags.split(',').map(tag => tag.trim()) as EventType[] : [];
  // date, period
  const date = `${article.startAt.split('T')[0]} ~ ${article.endAt.split('T')[0]}`;
  // isLiked, likeCount 등은 임시 처리
  const isLiked = false;
  const likeCount = article.scrapCount;
  const imageUrl = article.thumbnailPath;
  const org = article.organization;

  return (
    <div className="flex flex-col w-full rounded-2xl bg-white p-4 shadow-sm">
      <div className="relative mb-2">
        <img
          src={imageUrl}
          alt={article.title}
          className="rounded-xl w-full h-[120px] object-cover"
        />
        <button className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center">
          <img src={isLiked ? heartRed : heartNon} alt="like" className="w-7 h-7" />
        </button>
      </div>
      <div className="text-xs font-medium text-[#B0A8C6] mb-1 leading-[18px]">{org}</div>
      <div className="font-pretendard font-semibold text-[17px] leading-[24px] text-gray800 mb-1 overflow-hidden text-ellipsis whitespace-nowrap">{article.title}</div>
      <div className="font-pretendard text-[16px] leading-[22px] text-gray-500 font-normal mb-3">{date}</div>
      <div className="flex gap-2 items-center mb-2">
        {tags.map((tag) => (
          <EventTypeIndicator key={tag} type={tag} />
        ))}
        <EventDateIndicator dday={diff} />
        <div className="flex items-center gap-1 ml-auto min-w-[52px] pr-1">
          <img src={heartGray} alt="like-count" className="w-5 h-5" />
          <span className="font-pretendard text-sm font-body-3 text-gray-500">{likeCount > 999 ? '999+' : likeCount}</span>
        </div>
      </div>
    </div>
  );
}
