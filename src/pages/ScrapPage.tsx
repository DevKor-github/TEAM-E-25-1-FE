import React from "react";
import { Link, useNavigate } from "react-router-dom";
import HeaderFrame from "../components/HeaderFrame";
import MobileHeaderSection from "../components/MobileHeaderSection";
import EventCard from "../components/ui/EventCard";
import { EventType } from "../components/ui/EventTypeIndicator";
import FilterSheet, { FilterState } from "../components/FilterSheet";
import { api } from "../lib/axios";

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

export default function ScrapPage() {
  const [selectedSegment, setSelectedSegment] = React.useState("많이 본");
  const segments = ["많이 본", "많이 찜한", "임박한"];

  // articles를 useState로 관리
  const [articleList, setArticleList] = React.useState<Article[]>([]);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  // 필터 상태
  const [filterSheetOpen, setFilterSheetOpen] = React.useState(false);
  const [filterState, setFilterState] = React.useState<FilterState>({
    types: [],
    includePast: true,
  });

  // API: 스크랩한 게시글 목록 조회
  const fetchScrapedArticles = async () => {
    try {
      setLoading(true);
      const response = await api.get("/scrap", {
        params: {
          sort: selectedSegment === "많이 본" ? "viewCount" : 
                selectedSegment === "많이 찜한" ? "scrapCount" : "startAt",
          order: selectedSegment === "임박한" ? "asc" : "desc",
          types: filterState.types.length > 0 ? filterState.types.join(",") : undefined,
          includePast: filterState.includePast,
        }
      });
      // 백엔드 응답이 배열인지 객체인지에 따라 조정
      setArticleList(Array.isArray(response.data) ? response.data : response.data.articles || []);
    } catch (error) {
      console.error("스크랩 게시글 목록 조회 실패:", error);
      alert("스크랩한 게시글 목록을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // API: 스크랩 토글 (스크랩 해제만 가능)
  const handleToggleScrap = async (id: string) => {
    try {
      await api.delete(`/scrap/${id}`);

      // 스크랩 해제 후 목록 다시 조회
      await fetchScrapedArticles();
    } catch (error: any) {
      if (error.response?.status === 401) {
        navigate("/login");
      } else if (error.response?.status === 404) {
        alert("해당 게시글이 존재하지 않습니다.");
      } else {
        console.error("스크랩 해제 실패:", error);
        alert("스크랩 해제 중 오류가 발생했습니다.");
      }
    }
  };

  // 게시글 목록 조회 (페이지 로드 시, 필터 변경 시)
  React.useEffect(() => {
    fetchScrapedArticles();
  }, [selectedSegment, filterState]);

  // 홈으로 돌아가기 핸들러
  const handleBackToHome = () => {
    navigate("/");
  };

  // 필터 버튼 클릭
  const handleOpenFilter = () => setFilterSheetOpen(true);
  const handleCloseFilter = () => setFilterSheetOpen(false);
  const handleApplyFilter = () => setFilterSheetOpen(false);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center bg-white">
        <div className="w-full max-w-[375px] px-[20px] box-border">
          <HeaderFrame onClickScrap={handleBackToHome} />
          <div className="flex items-center justify-center py-8">
            <div className="text-lg text-gray-500">로딩 중...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-white">
      <div className="w-full max-w-[375px] px-[20px] box-border">
        <HeaderFrame onClickScrap={handleBackToHome} />
        {/* 필터 버튼 */}
        <MobileHeaderSection
          eventCount={articleList.length}
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
          {articleList.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500">스크랩한 게시글이 없습니다.</div>
              <button
                onClick={handleBackToHome}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                홈으로 돌아가기
              </button>
            </div>
          ) : (
            articleList.map((article) => (
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}
