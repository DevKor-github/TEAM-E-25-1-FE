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

  // API 중복 호출 방지를 위한 ref
  const fetchingRef = React.useRef(false);

  // 필터 상태
  const [filterSheetOpen, setFilterSheetOpen] = React.useState(false);
  const [filterState, setFilterState] = React.useState<FilterState>({
    types: [],
    includePast: false, // 기본값을 '지난행사제외'로 변경
    hasExplicitDateFilter: false,
  });

  // API: 스크랩한 게시글 목록 조회
  const fetchScrapedArticles = React.useCallback(async () => {
    // 중복 호출 방지
    if (fetchingRef.current) {
      return;
    }

    fetchingRef.current = true;
    
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
      fetchingRef.current = false; // 완료 후 플래그 리셋
    }
  }, [
    selectedSegment, 
    filterState.types.join(','), // 배열을 문자열로 변환하여 안정적인 의존성 생성
    filterState.includePast, 
    filterState.hasExplicitDateFilter, 
    navigate
  ]);

  // API: 스크랩 토글 (스크랩 해제만 가능)
  const handleToggleScrap = async (id: string) => {
    try {
      const article = articleList.find((a) => a.id === id);
      if (!article) return;

      const newScrapStatus = !article.isScrapped;
      const newScrapCount = article.isScrapped
        ? article.scrapCount - 1
        : article.scrapCount + 1;

      // 즉시 UI 업데이트 
      setArticleList((prev) =>
        prev.map((a) =>
          a.id === id
            ? { ...a, isScrapped: newScrapStatus, scrapCount: newScrapCount }
            : a
        )
      );

      // API 호출
      if (article.isScrapped) {
        await api.delete(`/scrap/${id}`);
        // 스크랩 해제 시에는 즉시 목록에서 제거하지 않음 (UI에서만 하트 상태 변경)
      } else {
        await api.post(`/scrap/${id}`);
      }
    } catch (error: any) {
      // 오류 발생 시 원래 상태로 되돌리기
      setArticleList((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
                ...a,
                isScrapped: !a.isScrapped,
                scrapCount: a.isScrapped ? a.scrapCount + 1 : a.scrapCount - 1,
              }
            : a
        )
      );

      if (error.response?.status === 401) {
        navigate("/login");
      } else if (error.response?.status === 404) {
        alert("해당 게시글이 존재하지 않습니다.");
      } else if (error.response?.status === 409) {
        alert("이미 스크랩한 게시글입니다.");
      } else {
        alert("스크랩 처리 중 오류가 발생했습니다.");
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
  const handleApplyFilter = () => {
    setFilterSheetOpen(false);
  };

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
              setFilterState({
                types: [],
                includePast: false, // 리셋할 때도 '지난행사제외'로
                hasExplicitDateFilter: false,
              });
            }}
            onFilter={handleOpenFilter}
            hasActiveFilters={
              filterState.types.length > 0 || filterState.hasExplicitDateFilter
            }
            selectedChips={(() => {
              const chips: string[] = [];

              // 행사 종류 칩
              if (filterState.types.length > 0) {
                if (filterState.types.length === 1) {
                  chips.push(filterState.types[0]);
                } else {
                  chips.push(
                    `${filterState.types[0]} 외 ${filterState.types.length - 1}개`
                  );
                }
              }

              // 행사 일정 칩 (사용자가 명시적으로 설정했을 때만)
              if (filterState.hasExplicitDateFilter) {
                chips.push(
                  filterState.includePast ? "지난 행사 포함" : "지난 행사 제외"
                );
              }

              return chips;
            })()}
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
