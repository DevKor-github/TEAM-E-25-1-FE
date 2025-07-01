import React from "react";
import HeaderFrame from "../components/HeaderFrame";
import MobileHeaderSection from "../components/MobileHeaderSection";
import EventCard from "../components/ui/EventCard";
import { EventType } from "../components/ui/EventTypeIndicator";

// 임시 데이터 예시
type Event = {
  id: number;
  title: string;
  date: string;
  tags: EventType[];
  dday: number;
  isLiked: boolean;
  likeCount: number;
  imageUrl: string;
  org: string;
  period: string;
  location: string;
};

const mockEvents: Event[] = [
  {
    id: 1,
    title: "벤처투자 1:1 전문 멘토링",
    date: "25.04.24(목) ~ 25.05.15(목) 온라인 접수",
    tags: ["설명회", "행사중" as EventType],
    dday: 3,
    isLiked: false,
    likeCount: 999,
    imageUrl: "/event_thumbnail_image.png",
    org: "dcamp officehour",
    period: "25.04.24(목) ~ 25.05.15(목)",
    location: "온라인 접수",
  },
  // ...더미 데이터 추가 가능
];

export default function ArticleListPage() {
  const [selectedSegment, setSelectedSegment] = React.useState("많이 본");
  const segments = ["많이 본", "많이 찜한", "임박한"];

  return (
    <div className="w-full min-h-screen bg-[#F5F5F7] flex flex-col items-center">
      <HeaderFrame />
      <div className="w-full max-w-[375px] px-2">
        <MobileHeaderSection
          eventCount={mockEvents.length}
          selectedChip={"필터 없음"}
          segments={segments}
          selectedSegment={selectedSegment}
          onSegmentChange={setSelectedSegment}
          onReset={() => {}}
        />
        <div className="flex flex-col gap-4 mt-4">
          {mockEvents.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      </div>
    </div>
  );
}
