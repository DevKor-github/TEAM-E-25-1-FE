import React from "react";
import { useNavigate } from "react-router-dom";
import HeaderFrame from "../components/HeaderFrame";
import MobileHeaderSection from "../components/MobileHeaderSection";
import EventCard from "../components/ui/EventCard";
import FilterSheet, { FilterState } from "../components/FilterSheet";
import { api } from "../lib/axios";


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
    includePast: false, // 기본값을 '지난행사제외'로 변경
  });

  // API: 스크랩한 게시글 목록 조회
  const fetchScrapedArticles = React.useCallback(async () => {
    try {
      setLoading(true);
      
      // 1. 스크랩 목록 조회
      const response = await api.get("/scrap");

      // API 응답 구조에 따라 배열 추출
      const scrapList = Array.isArray(response.data)
        ? response.data
        : response.data.articles || response.data.data || [];

      if (scrapList.length === 0) {
        setArticleList([]);
        return;
      }

      // 2. 각 스크랩된 게시글의 상세 정보 가져오기
      const articlePromises = scrapList.map(async (scrapItem: any) => {
        try {
          const articleId = scrapItem.articleId || scrapItem.id;
          const detailResponse = await api.get(`/article/${articleId}`);
          return {
            ...detailResponse.data,
            id: articleId,
            isScrapped: true,
          };
        } catch (error) {
          console.error(`게시글 ${scrapItem.articleId} 상세 정보 조회 실패:`, error);
          // 상세 정보 조회 실패 시 스크랩 목록의 기본 정보 사용
          return {
            ...scrapItem,
            id: scrapItem.articleId || scrapItem.id,
            startAt: "", // 날짜 정보가 없을 경우 빈 문자열
            endAt: "",
            description: "",
            location: "",
            imagePaths: [],
            registrationUrl: "",
            isScrapped: true,
          };
        }
      });

      const articlesWithDetails = await Promise.all(articlePromises);

      // 필터링 적용
      let filteredArticles = [...articlesWithDetails];

      // 타입 필터링
      if (filterState.types.length > 0) {
        filteredArticles = filteredArticles.filter((article) =>
          filterState.types.some((type) => article.tags.includes(type))
        );
      }

      // 종료된 행사 포함/제외 필터링
      if (!filterState.includePast) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        filteredArticles = filteredArticles.filter((article) => {
          try {
            const endDate = new Date(article.endAt);
            endDate.setHours(23, 59, 59, 999); // 해당 일의 마지막 시간
            return endDate >= today; // 종료일이 오늘 이후인 행사만
          } catch (e) {
            return true; // 날짜 파싱 실패 시 포함
          }
        });
      }

      // 클라이언트에서 정렬 처리
      if (selectedSegment === "많이 본") {
        filteredArticles.sort((a, b) => b.viewCount - a.viewCount);
      } else if (selectedSegment === "많이 찜한") {
        filteredArticles.sort((a, b) => b.scrapCount - a.scrapCount);
      } else if (selectedSegment === "임박한") {
        filteredArticles.sort(
          (a, b) =>
            new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
        );
      }

      setArticleList(filteredArticles);
    } catch (err: any) {
      if (err.response?.status === 401) {
        navigate("/login", { replace: true });
      } else {
        console.error("스크랩 게시글 목록 조회 실패:", err);
        alert("스크랩한 게시글 목록을 불러오는 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  }, [selectedSegment, filterState, navigate]);

  // API: 스크랩 토글 (스크랩 해제만 가능)
  const handleToggleScrap = async (id: string) => {
    try {
      // UI 즉시 업데이트 (Optimistic Update)
      setArticleList(prev => 
        prev.map(article => 
          article.id === id 
            ? { ...article, isScrapped: false, scrapCount: article.scrapCount - 1 }
            : article
        )
      );

      await api.delete(`/scrap/${id}`);

      // 성공 시 목록에서 해당 아이템 제거 (스크랩 페이지이므로)
      setArticleList(prev => prev.filter(article => article.id !== id));
    } catch (error: any) {
      // 실패 시 원래 상태로 되돌리기
      setArticleList(prev => 
        prev.map(article => 
          article.id === id 
            ? { ...article, isScrapped: true, scrapCount: article.scrapCount + 1 }
            : article
        )
      );

      if (error.response?.status === 401) {
        navigate("/login");
      } else if (error.response?.status === 404) {
        alert("해당 게시글이 존재하지 않습니다.");
      } else {
        alert("스크랩 해제 중 오류가 발생했습니다.");
      }
    }
  };

  // 게시글 목록 조회 (페이지 로드 시, 정렬 및 필터 변경 시)
  React.useEffect(() => {
    fetchScrapedArticles();
  }, [fetchScrapedArticles]);

  // 필터 버튼 클릭
  const handleOpenFilter = () => setFilterSheetOpen(true);
  const handleCloseFilter = () => setFilterSheetOpen(false);
  const handleApplyFilter = () => setFilterSheetOpen(false);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-100">
        <div className="w-full max-w-[460px] mx-auto bg-white min-h-screen">
          <HeaderFrame />
          <div className="flex flex-col items-center px-5">
            <div className="flex items-center justify-center py-8">
              <div className="text-lg text-gray-500">로딩 중...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    // 바깥 프레임
    <div className="w-full min-h-screen bg-gray-100">
      {/* 중앙 컨텐츠 프레임 */}
      <div className="w-full max-w-[460px] mx-auto bg-white min-h-screen">
        <HeaderFrame />
        <div className="flex flex-col px-5">
          {/* 필터 및 정렬 기능 */}
          <MobileHeaderSection
            title="찜한 행사"
            eventCount={articleList.length}
            segments={segments}
            selectedSegment={selectedSegment}
            onSegmentChange={setSelectedSegment}
            onReset={() => {
              setFilterState({ types: [], includePast: false }); // 리셋할 때도 '지난행사제외'로
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
          <div className="flex flex-col gap-4 mt-4 w-full items-center">
          {articleList.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500">스크랩한 게시글이 없습니다.</div>
              <button
                onClick={() => navigate("/")}
                className="mt-4 px-4 py-2 bg-sky-500 font-pretendard text-white rounded-lg"
              >
                홈으로 돌아가기
              </button>
            </div>
          ) : (
            articleList.map((article) => (
              <EventCard
                key={article.id}
                {...article}
                isScrapped={article.isScrapped !== false} // 동적으로 처리, 기본값은 true (스크랩 페이지이므로)
                onCardClick={() => {
                  if (article.id) {
                    navigate(`/event/${article.id}`);
                  }
                }}
                onToggleScrap={() => {
                  handleToggleScrap(article.id);
                }}
              />
            ))
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
