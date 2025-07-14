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
  tags: string[];
  description: string;
  location: string;
  startAt: string;
  endAt: string;
  imagePaths: string[];
  registrationUrl: string;
  isScrapped?: boolean;
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

  // 이미지 URL 처리 함수 (EventCard에서 이동)
  const processImageUrl = (path: string) => {
    console.log(`ScrapPage 썸네일 경로 처리: "${path}"`);
    
    if (!path) {
      console.log("썸네일 경로가 비어있음, 기본 이미지 사용");
      return "/eventThumbnail.png";
    }
    
    // 백엔드 URL을 그대로 사용 (상세페이지와 동일한 방식)
    console.log(`최종 이미지 URL: "${path}"`);
    return path;
  };

  // API: 스크랩한 게시글 목록 조회
  const fetchScrapedArticles = async () => {
    try {
      setLoading(true);
      // 스크랩 목록은 파라미터 없이 조회 
      const response = await api.get("/scrap");
      console.log("스크랩 API 응답:", response.data);
      
      // API 응답 구조에 따라 배열 추출
      const articles = Array.isArray(response.data) ? response.data : (response.data.articles || response.data.data || []);
      console.log("추출된 스크랩 articles:", articles);
      
      // 각 게시글의 썸네일 경로 확인 및 처리
      articles.forEach((article: any, index: number) => {
        console.log(`스크랩 게시글 ${index + 1}: ID=${article.id}, 제목="${article.title}", 썸네일="${article.thumbnailPath}"`);
      });
      
      // 이미지 URL 전처리
      const articlesWithProcessedImages = articles.map((article: any) => ({
        ...article,
        thumbnailPath: processImageUrl(article.thumbnailPath)
      }));
      
      // 필터링 적용
      let filteredArticles = [...articlesWithProcessedImages];
      
      // 타입 필터링
      if (filterState.types.length > 0) {
        filteredArticles = filteredArticles.filter(article => 
          filterState.types.some(type => article.tags.includes(type))
        );
      }
      
      // 종료된 행사 포함/제외 필터링
      if (!filterState.includePast) {
        const now = new Date();
        filteredArticles = filteredArticles.filter(article => 
          new Date(article.endAt) >= now
        );
      }
      
      // 클라이언트에서 정렬 처리
      if (selectedSegment === "많이 본") {
        filteredArticles.sort((a, b) => b.viewCount - a.viewCount);
      } else if (selectedSegment === "많이 찜한") {
        filteredArticles.sort((a, b) => b.scrapCount - a.scrapCount);
      } else if (selectedSegment === "임박한") {
        filteredArticles.sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
      }
      
      setArticleList(filteredArticles);
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

  // 게시글 목록 조회 (페이지 로드 시, 정렬 및 필터 변경 시)
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
        {/* 필터 및 정렬 기능 */}
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
                className="mt-4 px-4 py-2 bg-sky-500 font-pretendard text-white rounded-lg"
              >
                홈으로 돌아가기
              </button>
            </div>
          ) : (
            articleList.map((article) => {
              console.log(`렌더링할 스크랩 게시글: ${article.id} - ${article.title} - 썸네일: ${article.thumbnailPath}`);
              return (
                <div
                  key={article.id}
                  className="w-full cursor-pointer"
                  onClick={() => {
                    console.log(`스크랩 페이지에서 게시글 div 클릭: ${article.id} - 제목: ${article.title}`);
                    console.log(`이동할 경로: /article/${article.id}`);
                    navigate(`/article/${article.id}`);
                  }}
                >
                  <EventCard
                    {...article}
                    isScrapped={true} // 스크랩 페이지의 모든 게시글은 스크랩된 상태
                    fallbackImage="/eventThumbnail.png" // 기본 이미지 경로 전달
                    onToggleScrap={() => {
                      console.log(`하트 클릭: ${article.id}`);
                      handleToggleScrap(article.id);
                    }}
                  />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
