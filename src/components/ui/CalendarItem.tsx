import React from "react";
import CalendarEvent, { CalendarEventType } from "./CalendarEvent";
import { cn } from "@/lib/utils";

export type CalendarItemEventCount = "None" | "1" | "2" | "3" | "4+";
export type CalendarItemState = "Enabled" | "Activated" | "Deactivated";

interface Article {
  id: string;
  title: string;
  tags: string[];
}

interface CalendarItemProps extends React.HTMLAttributes<HTMLDivElement> {
  date?: string;
  events?: CalendarItemEventCount;
  articles?: Article[];
  state?: CalendarItemState;
}

// tags 배열의 첫 번째 태그를 CalendarEventType으로 매핑
const mapTagToEventType = (tag: string): CalendarEventType => {
  const tagMap: Record<string, CalendarEventType> = {
    강연: "강연",
    취업·창업: "취업·창업",
    공모전: "공모전",
    대회: "대회",
    박람회: "박람회",
    설명회: "설명회",
    교육: "교육",
    축제: "축제",
  };

  return tagMap[tag] || "강연";
};

export default function CalendarItem({
  date = "17",
  events = "None",
  articles = [],
  state = "Enabled",
  className,
  ...props
}: CalendarItemProps) {
  const isDeactivated = state === "Deactivated";
  const isActivated = state === "Activated";
  const hasEvents = events !== "None";

  const containerStyle = cn(
    "flex flex-col items-center justify-center gap-[4px] p-[2px] relative",
    {
      "bg-[#f3f4f6]": isDeactivated,
      "bg-white border border-[rgba(3,7,18,0.05)] border-solid rounded-[9px] shadow-[0px_4px_20px_0px_rgba(3,7,18,0.1)]":
        isActivated,
      "bg-white rounded-[9px] cursor-pointer": !isDeactivated && !isActivated,
    },
  );

  const dateTextStyle = cn(
    "text-[17px] leading-[24px] text-center w-full whitespace-pre-wrap font-pretendard font-normal",
    isDeactivated ? "text-[#99a1af]" : "text-[#6a7282]",
  );

  // CalendarEvent의 state 결정
  const eventState = isDeactivated
    ? "Deactivated"
    : isActivated
      ? "Activated"
      : "Enabled";

  // 표시할 행사 결정
  const displayArticles = articles.slice(0, 3);
  const remainingCount = Math.max(0, articles.length - 2);

  const renderEvent = (article: Article, index: number) => (
    <CalendarEvent
      key={index}
      className="w-full h-[16px]"
      state={eventState}
      eventType={mapTagToEventType(article.tags[0])}
      eventTitle={article.title}
    />
  );

  // 이벤트 개수에 따른 렌더링
  const renderEvents = () => {
    if (events === "None") return null;

    if (events === "1" && displayArticles[0]) {
      return (
        <CalendarEvent
          className="w-full"
          state={eventState}
          eventType={mapTagToEventType(displayArticles[0].tags[0])}
          eventTitle={displayArticles[0].title}
        />
      );
    }

    if (events === "2" || events === "3") {
      return displayArticles.map((article, index) =>
        renderEvent(article, index),
      );
    }

    if (events === "4+") {
      return (
        <>
          {displayArticles
            .slice(0, 2)
            .map((article, index) => renderEvent(article, index))}
          <CalendarEvent
            className="w-full h-[16px]"
            state={eventState}
            eventType="...더보기"
            eventTitle={`+${remainingCount}개`}
          />
        </>
      );
    }

    return null;
  };

  return (
    <div className={cn(containerStyle, className)} {...props}>
      <p className={dateTextStyle}>{date}</p>

      <div
        className={cn(
          "flex w-full shrink-0 flex-col items-center relative h-[56px]",
          hasEvents ? "gap-[4px]" : "justify-center",
        )}
      >
        {renderEvents()}
      </div>
    </div>
  );
}
