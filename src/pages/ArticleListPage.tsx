import React from "react";
import { useNavigate } from "react-router-dom";
import HeaderFrame from "../components/HeaderFrame";
import MobileHeaderSection from "../components/MobileHeaderSection";
import EventCard from "../components/ui/EventCard";
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
  tags: string[]; // 백엔드에서 string 배열로 오는 것으로 보임
  description: string;
  location: string;
  startAt: string;
  endAt: string;
  imagePaths: string[];
  registrationUrl: string;
  isScrapped?: boolean; // 스크랩 여부 
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

  // 이미지 URL 처리 함수 (EventCard에서 이동)
  const processImageUrl = (path: string) => {
    if (!path) return "/eventThumbnail.png";
    return path; // 백엔드 URL을 그대로 사용
  };

  // API: 게시글 목록 조회
  const fetchArticles = async () => {
    try {
      setLoading(true);
      
      // 1. 게시글 목록 조회
      const response = await api.get("/article", {
        params: {
          tags: filterState.types.length > 0 ? filterState.types : undefined,
          isFinished: filterState.includePast ? undefined : false,
          sortBy: selectedSegment === "많이 본" ? "viewCount" : 
                 selectedSegment === "많이 찜한" ? "scrapCount" : "createdAt",
          page: 1,
          limit: 50, // 한 번에 가져올 게시글 수
        }
      });
      
      const articles = Array.isArray(response.data) ? response.data : [];
      console.log("게시글 목록 API 응답:", articles);
      
      // 2. 스크랩 목록 조회 (로그인된 경우에만)
      let scrapIds: string[] = [];
      try {
        const scrapResponse = await api.get("/scrap");
        const scrapList = Array.isArray(scrapResponse.data) 
          ? scrapResponse.data 
          : (scrapResponse.data.articles || scrapResponse.data.data || []);
        scrapIds = scrapList.map((item: any) => item.id);
        console.log("스크랩 ID 목록:", scrapIds);
      } catch (scrapError) {
        // 스크랩 목록 조회 실패 시 (비로그인 등) 빈 배열로 처리
        console.log("스크랩 목록 조회 실패:", scrapError);
      }
      
      // 3. 각 게시글에 isScrapped 상태 및 이미지 URL 처리
      const articlesWithScrapStatus = articles.map((article: Article) => ({
        ...article,
        isScrapped: scrapIds.includes(article.id),
        thumbnailPath: processImageUrl(article.thumbnailPath)
      }));
      
      console.log("스크랩 상태가 추가된 게시글 목록:", articlesWithScrapStatus);
      setArticleList(articlesWithScrapStatus);
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

      const newScrapStatus = !article.isScrapped;
      const newScrapCount = article.isScrapped ? article.scrapCount - 1 : article.scrapCount + 1;

      // 즉시 UI 업데이트 (Optimistic Update)
      setArticleList(prev => 
        prev.map(a => 
          a.id === id 
            ? { ...a, isScrapped: newScrapStatus, scrapCount: newScrapCount }
            : a
        )
      );

      console.log(`스크랩 토글: ${id}, 새 상태: ${newScrapStatus}`);

      // API 호출
      if (article.isScrapped) {
        await api.delete(`/scrap/${id}`);
        console.log(`스크랩 해제 성공: ${id}`);
      } else {
        await api.post(`/scrap/${id}`);
        console.log(`스크랩 추가 성공: ${id}`);
      }
    } catch (error: any) {
      // 오류 발생 시 원래 상태로 되돌리기
      setArticleList(prev => 
        prev.map(a => 
          a.id === id 
            ? { ...a, isScrapped: !a.isScrapped, scrapCount: a.isScrapped ? a.scrapCount + 1 : a.scrapCount - 1 }
            : a
        )
      );

      console.error(`스크랩 토글 실패: ${id}`, error);

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
              <div
                key={article.id}
                className="w-full cursor-pointer"
                onClick={() => {
                  console.log(`목록 페이지에서 게시글 div 클릭: ${article.id}, 스크랩 상태: ${article.isScrapped}`);
                  navigate(`/article/${article.id}`);
                }}
              >
                <EventCard
                  {...article}
                  fallbackImage="/eventThumbnail.png" // 기본 이미지 경로 전달
                  onToggleScrap={() => handleToggleScrap(article.id)}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
