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

export default function ArticleListPage() {
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

  // API: 게시글 목록 조회
  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await api.get("/articles", {
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
      console.error("게시글 목록 조회 실패:", error);
      alert("게시글 목록을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // API: 스크랩 토글
  const handleToggleScrap = async (id: string) => {
    try {
      const article = articleList.find(a => a.id === id);
      if (!article) return;

      if (article.isLiked) {
        await api.delete(`/scrap/${id}`);
      } else {
        await api.post(`/scrap/${id}`);
      }

      // 서버에서 최신 데이터를 다시 가져와서 동기화
      await fetchArticles();
    } catch (error: any) {
      if (error.response?.status === 401) {
        navigate("/login");
      } else if (error.response?.status === 404) {
        alert("해당 게시글이 존재하지 않습니다.");
      } else if (error.response?.status === 409) {
        alert("이미 스크랩한 게시글입니다.");
      } else {
        console.error("스크랩 처리 실패:", error);
        alert("스크랩 처리 중 오류가 발생했습니다.");
      }
    }
  };

  // 게시글 목록 조회 (페이지 로드 시, 필터 변경 시)
  React.useEffect(() => {
    fetchArticles();
  }, [selectedSegment, filterState]);

  // 스크랩 페이지로 이동 핸들러
  const handleGoToScrapPage = () => {
    navigate("/scrap");
  };

  // 필터 버튼 클릭
  const handleOpenFilter = () => setFilterSheetOpen(true);
  const handleCloseFilter = () => setFilterSheetOpen(false);
  const handleApplyFilter = () => setFilterSheetOpen(false);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center bg-white">
        <div className="w-full max-w-[375px] px-[20px] box-border">
          <HeaderFrame onClickScrap={handleGoToScrapPage} />
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
        <HeaderFrame onClickScrap={handleGoToScrapPage} />
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
              <div className="text-gray-500">표시할 게시글이 없습니다.</div>
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
