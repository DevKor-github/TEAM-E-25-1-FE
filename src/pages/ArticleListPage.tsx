import React from "react";
import { useNavigate } from "react-router-dom";
import HeaderFrame from "../components/HeaderFrame";
import MobileHeaderSection from "../components/MobileHeaderSection";
import EventCard from "../components/ui/EventCard";
import FilterSheet, { FilterState } from "../components/FilterSheet";
import { api } from "../lib/axios";
import { usePreviousPageStore } from "@/stores/previousPageStore";
import { useScrapSyncStore } from "@/stores/scrapSyncStore";
import {
  trackButtonClicked,
  trackPageViewed,
  trackArticleListViewed,
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
  const scrapUpdates = useScrapSyncStore((state) => state.updates);
  const setScrapStatus = useScrapSyncStore((state) => state.setScrapStatus);

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
              : "registrationStartAt",
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

      // 스크랩 상태 확인
      if (!backendProvidesScrapStatus) {
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

      const overrides = useScrapSyncStore.getState().updates;
      const articlesWithOverrides = filteredArticles.map((article: Article) => {
        const override = overrides[article.id];
        if (!override) {
          return article;
        }
        return {
          ...article,
          isScrapped: override.isScrapped,
          scrapCount:
            typeof override.scrapCount === "number"
              ? override.scrapCount
              : article.scrapCount,
        };
      });

      setArticleList(articlesWithOverrides);

      // 앰플리튜드 - 행사 목록 조회 트래킹 (정상적으로 데이터를 불러온 경우에만)
      trackArticleListViewed({
        currentTab:
          selectedSegment === "많이 본"
            ? "view_count"
            : selectedSegment === "많이 찜한"
              ? "scrap_count"
              : "created_at",
        filteredTag: filterState.types,
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
    // 앰플리튜드 - 버튼 클릭 트래킹
    trackButtonClicked({
      buttonName: "scrap_article",
      pageName: "article_list",
    });

    const currentArticle = articleList.find((a) => a.id === id);
    if (!currentArticle) return;

    const previousScrapStatus = currentArticle.isScrapped ?? false;
    const previousScrapCount = currentArticle.scrapCount;
    const newScrapStatus = !previousScrapStatus;
    const newScrapCount = previousScrapStatus
      ? previousScrapCount - 1
      : previousScrapCount + 1;

    try {
      // 즉시 UI 업데이트 (Optimistic Update)
      setArticleList((prev) =>
        prev.map((a) =>
          a.id === id
            ? { ...a, isScrapped: newScrapStatus, scrapCount: newScrapCount }
            : a
        )
      );

      // API 호출
      if (previousScrapStatus) {
        await api.delete(`/scrap/${id}`);
      } else {
        await api.post(`/scrap/${id}`);
      }

      setScrapStatus({
        articleId: id,
        isScrapped: newScrapStatus,
        scrapCount: Math.max(0, newScrapCount),
      });
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

      setScrapStatus({
        articleId: id,
        isScrapped: previousScrapStatus,
        scrapCount: previousScrapCount,
      });

      console.error(`스크랩 토글 실패: ${id}`, error);

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

  // 게시글 목록 조회 (페이지 로드 시, 필터 변경 시)
  React.useEffect(() => {
    fetchArticles();
  }, [selectedSegment, filterState]);

  React.useEffect(() => {
    setArticleList((prev) =>
      prev.length === 0
        ? prev
        : prev.map((article) => {
            const override = scrapUpdates[article.id];
            if (!override) {
              return article;
            }

            return {
              ...article,
              isScrapped: override.isScrapped,
              scrapCount:
                typeof override.scrapCount === "number"
                  ? override.scrapCount
                  : article.scrapCount,
            };
          })
    );
  }, [scrapUpdates]);

  const previousPage = usePreviousPageStore((state) => state.previousPage);

  // 앰플리튜드 - 페이지 조회 트래킹
  React.useEffect(() => {
    trackPageViewed({
      pageName: "article_list",
      previousPage: previousPage,
    });
  }, [previousPage]);

  // 필터 버튼 클릭
  const handleOpenFilter = () => {
    setFilterSheetOpen(true);
    // 앰플리튜드 - 버튼 클릭 트래킹
    trackButtonClicked({ buttonName: "open_filter", pageName: "article_list" });
  };
  const handleCloseFilter = () => {
    setFilterSheetOpen(false);
    // 앰플리튜드 - 버튼 클릭 트래킹
    trackButtonClicked({
      buttonName: "close_filter",
      pageName: "article_list",
    });
  };
  const handleApplyFilter = () => {
    setFilterSheetOpen(false);
    // 앰플리튜드 - 버튼 클릭 트래킹
    trackButtonClicked({
      buttonName: "apply_filter",
      pageName: "article_list",
    });
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
