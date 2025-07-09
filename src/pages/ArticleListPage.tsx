import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import HeaderFrame from "../components/HeaderFrame";
import MobileHeaderSection from "../components/MobileHeaderSection";
import EventCard from "../components/ui/EventCard";
import { EventType } from "../components/ui/EventTypeIndicator";
import FilterSheet, { FilterState } from "../components/FilterSheet";

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
  scrapUsers: string[]; // 스크랩한 사용자 ID 배열 추가
};

// mockEvents: Article 타입 더미 데이터1
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
    scrapUsers: ["user1", "user2", "user3"], // 스크랩한 사용자들
  },
  // ...더미 데이터 추가 가능
];

// 더미2
const articles: Article[] = [
  {
    id: "2",
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
    scrapUsers: ["user4", "user5"], // 스크랩한 사용자들
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

  // 필터 상태
  const [filterSheetOpen, setFilterSheetOpen] = React.useState(false);
  const [filterState, setFilterState] = React.useState<FilterState>({
    types: [],
    includePast: true,
  });

  // 임박한 정렬: 종료된 행사 제외
  const getSortedList = (list: Article[]) => {
    switch (selectedSegment) {
      case "많이 본":
        return [...list].sort((a, b) => b.viewCount - a.viewCount);
      case "많이 찜한":
        return [...list].sort((a, b) => b.scrapCount - a.scrapCount);
      case "임박한": {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return [...list]
          .filter((a) => {
            const end = new Date(a.endAt);
            end.setHours(0, 0, 0, 0);
            return end.getTime() >= now.getTime(); // 종료된 행사 제외
          })
          .sort((a, b) => {
            const aStart = new Date(a.startAt).getTime();
            const bStart = new Date(b.startAt).getTime();
            return aStart - bStart;
          });
      }
      default:
        return list;
    }
  };

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

  // 필터 버튼 클릭
  const handleOpenFilter = () => setFilterSheetOpen(true);
  const handleCloseFilter = () => setFilterSheetOpen(false);
  const handleApplyFilter = () => setFilterSheetOpen(false);

  // 필터링
  const applyFilter = (list: Article[]) => {
    let filtered = list;
    if (filterState.types.length > 0) {
      filtered = filtered.filter((a) =>
        a.tags.some((t) => filterState.types.includes(t))
      );
    }
    if (!filterState.includePast) {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      filtered = filtered.filter((a) => {
        const end = new Date(a.endAt);
        end.setHours(0, 0, 0, 0);
        return end.getTime() >= now.getTime();
      });
    }
    return filtered;
  };

  // 필터링 및 정렬된 리스트
  const filteredList = showScrapOnly
    ? articleList.filter((a) => a.isLiked)
    : articleList;
  const filterAppliedList = applyFilter(filteredList);
  const sortedList = getSortedList(filterAppliedList);

  // 스크랩 토글 핸들러
  const handleToggleScrap = (id: string) => {
    const currentUserId = "currentUser"; // 실제로는 인증된 사용자 ID를 사용해야 함
    
    setArticleList((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              isLiked: !a.isLiked,
              scrapCount: a.isLiked ? a.scrapCount - 1 : a.scrapCount + 1,
              scrapUsers: a.isLiked
                ? a.scrapUsers.filter((userId) => userId !== currentUserId) // 스크랩 취소시 배열에서 제거
                : [...a.scrapUsers, currentUserId], // 스크랩시 배열에 추가
            }
          : a
      )
    );
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-white">
      <div className="w-full max-w-[375px] px-[20px] box-border">
        <HeaderFrame onClickScrap={handleScrapIconClick} />
        {/* 필터 버튼 */}
        <MobileHeaderSection
          eventCount={sortedList.length}
          segments={segments}
          selectedSegment={selectedSegment}
          onSegmentChange={setSelectedSegment}
          onReset={() => {
            setFilterState({ types: [], includePast: true });
          }}
          onFilter={handleOpenFilter}
        />
        <FilterSheet
          open={filterSheetOpen}
          onClose={handleCloseFilter}
          filterState={filterState}
          setFilterState={setFilterState}
          onApply={handleApplyFilter}
        />
        <div className="flex flex-col gap-4 mt-4 w-full">
          {sortedList.map((article) => (
            <Link
              key={article.id}
              to={`/article/${article.id}`}
              style={{ textDecoration: "none" }}
              className="w-full"
            >
              <EventCard
                {...article}
                onToggleScrap={() => handleToggleScrap(article.id)}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
