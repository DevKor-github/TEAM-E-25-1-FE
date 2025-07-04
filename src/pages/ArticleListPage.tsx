import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import HeaderFrame from "../components/HeaderFrame";
import MobileHeaderSection from "../components/MobileHeaderSection";
import EventCard from "../components/ui/EventCard";
import { EventType } from "../components/ui/EventTypeIndicator";

// Article 타입: 백엔드 스웨거 기준
export type Article = {
  id: string;
  title: string;
  organization: string;
  thumbnailPath: string;
  scrapCount: number;
  viewCount: number;
  tags: EventType[];
  description: string;
  location: string;
  startAt: string;
  endAt: string;
  imagePaths: string[];
  registrationUrl: string;
  isLiked: boolean; // 스크랩 여부 추가
};

// mockEvents: Article 타입 더미 데이터
const mockEvents: Article[] = [
  {
    id: "1",
    title: "벤처투자 1:1 전문 멘토링",
    organization: "dcamp officehour",
    thumbnailPath: "/event_thumbnail_image.png",
    scrapCount: 1000,
    viewCount: 0,
    tags: ["설명회"],
    description: "벤처투자 전문가와 1:1 멘토링 기회!",
    location: "온라인 접수",
    startAt: "2025-07-05T00:00:00Z",
    endAt: "2025-07-10T23:59:59Z",
    imagePaths: ["/event_thumbnail_image.png"],
    registrationUrl: "",
    isLiked: false,
  },
  // ...더미 데이터 추가 가능
];

// 더미2
const articles: Article[] = [
  {
    id: "21231423423",
    title: "채용박람회",
    organization: "고려대학교",
    thumbnailPath: "https://example.com/thumbnail.jpg",
    scrapCount: 10,
    viewCount: 100,
    tags: ["박람회", "설명회"], // 배열로 변경
    description: "게시글 설명",
    location: "고려대학교",
    startAt: "2023-10-01T00:00:00Z",
    endAt: "2023-10-31T23:59:59Z",
    imagePaths: [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
    ],
    registrationUrl: "https://example.com/register",
    isLiked: false,
  },
  ...mockEvents,
];

export default function ArticleListPage() {
  const [selectedSegment, setSelectedSegment] = React.useState("많이 본");
  const segments = ["많이 본", "많이 찜한", "임박한"];

  // articles를 useState로 관리
  const [articleList, setArticleList] = React.useState(articles);
  const location = useLocation();
  const navigate = useNavigate();

  // 쿼리스트링으로 스크랩 필터 상태 결정
  const params = new URLSearchParams(location.search);
  const showScrapOnly = params.get("scrapOnly") === "1";

  // 상단 하트 클릭 핸들러
  const handleScrapIconClick = () => {
    if (showScrapOnly) {
      params.delete("scrapOnly");
      navigate({ search: params.toString() });
    } else {
      params.set("scrapOnly", "1");
      navigate({ search: params.toString() });
    }
  };

  // 필터링된 리스트
  const filteredList = showScrapOnly
    ? articleList.filter((a) => a.isLiked)
    : articleList;

  // 스크랩 토글 핸들러
  const handleToggleScrap = (id: string) => {
    setArticleList((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              isLiked: !a.isLiked,
              scrapCount: a.isLiked ? a.scrapCount - 1 : a.scrapCount + 1,
            }
          : a
      )
    );
  };

  return (
    <div className="w-[375px] mx-auto bg-white px-[20px] min-h-screen">
      <HeaderFrame onClickScrap={handleScrapIconClick} />
      {/* 상단 하트 버튼은 HeaderFrame에서 처리됨 */}
      <MobileHeaderSection
        eventCount={filteredList.length}
        segments={segments}
        selectedSegment={selectedSegment}
        onSegmentChange={setSelectedSegment}
        onReset={() => {}}
      />
      <div className="flex flex-col gap-4 mt-4">
        {filteredList.map((article) => (
          <Link key={article.id} to={`/article/${article.id}`} style={{ textDecoration: 'none' }}>
            <EventCard {...article} onToggleScrap={() => handleToggleScrap(article.id)} />
          </Link>
        ))}
      </div>
    </div>
  );
}
