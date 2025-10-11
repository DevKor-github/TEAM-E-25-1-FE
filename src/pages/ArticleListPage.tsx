import React from "react";
import { useNavigate } from "react-router-dom";
import HeaderFrame from "../components/HeaderFrame";
import MobileHeaderSection from "../components/MobileHeaderSection";
import EventCard from "../components/ui/EventCard";
import FilterSheet, { FilterState } from "../components/FilterSheet";
import { api } from "../lib/axios";
import {
  trackEventListViewed,
  trackScrapToggled,
  trackAttemptedScrap,
} from "@/amplitude/track";

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
  registrationStartAt?: string;
  registrationEndAt?: string;
  imagePaths: string[];
  registrationUrl: string;
  isScrapped?: boolean;
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
    includePast: false, // 기본값을 '지난행사제외'로 변경
    hasExplicitDateFilter: false,
  });

  // API: 게시글 목록 조회
  const fetchArticles = async () => {
    try {
      setLoading(true);

      // 1. 게시글 목록 조회
      const apiParams = {
        tags:
          filterState.types.length > 0
            ? filterState.types.join(",")
            : undefined,
        isFinished: filterState.includePast ? undefined : false,
        sortBy:
          selectedSegment === "많이 본"
            ? "viewCount"
            : selectedSegment === "많이 찜한"
              ? "scrapCount"
              : "registrationEndAt",
        page: 1,
        limit: 10,
      };

      const response = await api.get("/article", {
        params: apiParams,
      });

      const articles = Array.isArray(response.data) ? response.data : [];

      // 2. 스크랩 목록 조회 (백엔드에서 isScrapped를 제공하지 않는 경우에만)
      let scrapIds: string[] = [];
      const backendProvidesScrapStatus =
        articles.length > 0 && "isScrapped" in articles[0];

      // 로그인 상태 확인
      const authStorage = localStorage.getItem("user-auth-storage");
      const isLoggedIn = authStorage
        ? JSON.parse(authStorage).state?.isLoggedIn
        : false;

      if (!backendProvidesScrapStatus && isLoggedIn) {
        try {
          const scrapResponse = await api.get("/scrap");
          const scrapList = Array.isArray(scrapResponse.data)
            ? scrapResponse.data
            : scrapResponse.data.articles || scrapResponse.data.data || [];
          scrapIds = scrapList.map((item: any) => item.articleId);
        } catch (scrapError) {
          // 스크랩 목록 조회 실패 시 빈 배열로 처리
        }
      }

      // 3. 각 게시글에 isScrapped 상태 처리
      const articlesWithScrapStatus = articles.map((article: Article) => ({
        ...article,
        isScrapped: backendProvidesScrapStatus
          ? article.isScrapped
          : scrapIds.includes(article.id),
      }));

      // 클라이언트 사이드 필터링: 지난 행사 제외가 설정된 경우
      let filteredArticles = articlesWithScrapStatus;
      if (!filterState.includePast) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        filteredArticles = articlesWithScrapStatus.filter((article) => {
          try {
            const endDate = new Date(article.endAt);
            endDate.setHours(23, 59, 59, 999); // 해당 일의 마지막 시간
            return endDate >= today; // 종료일이 오늘 이후인 행사만
          } catch (e) {
            return true; // 날짜 파싱 실패 시 포함
          }
        });
      }

      setArticleList(filteredArticles);

      // 앰플리튜드 - 행사 목록 조회 트래킹 (정상적으로 데이터를 불러온 경우에만)
      trackEventListViewed({
        tab:
          selectedSegment === "많이 본"
            ? "viewCount"
            : selectedSegment === "많이 찜한"
              ? "scrapCount"
              : "createdAt",
        tags: filterState.types,
        includePast: filterState.includePast,
      });
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
      const article = articleList.find((a) => a.id === id);
      if (!article) return;

      const newScrapStatus = !article.isScrapped;
      const newScrapCount = article.isScrapped
        ? article.scrapCount - 1
        : article.scrapCount + 1;

      // 즉시 UI 업데이트 (Optimistic Update)
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
        // 앰플리튜드 - 회원 스크랩 삭제 트래킹
        trackScrapToggled({ articleId: id, action: "remove" });
      } else {
        await api.post(`/scrap/${id}`);
        // 앰플리튜드 - 회원 스크랩 추가 트래킹
        trackScrapToggled({ articleId: id, action: "add" });
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

      console.error(`스크랩 토글 실패: ${id}`, error);

      if (error.response?.status === 401) {
        // 앰플리튜드 - 비회원 스크랩 시도 트래킹
        trackAttemptedScrap({ articleId: id });
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

  // 게시글 목록 조회 (페이지 로드 시, 필터 변경 시)
  React.useEffect(() => {
    fetchArticles();
  }, [selectedSegment, filterState]);

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
          {/* 필터 버튼 */}
          <MobileHeaderSection
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
                <div className="text-gray-500">표시할 게시글이 없습니다.</div>
              </div>
            ) : (
              articleList.map((article) => (
                <EventCard
                  key={article.id}
                  {...article}
                  onCardClick={() => {
                    if (article.id) {
                      navigate(`/event/${article.id}`);
                    }
                  }}
                  onToggleScrap={() => handleToggleScrap(article.id)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
