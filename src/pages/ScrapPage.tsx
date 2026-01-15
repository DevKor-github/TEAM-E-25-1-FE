import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderFrame from "../components/HeaderFrame";
import MobileHeaderSection from "../components/MobileHeaderSection";
import EventCard from "../components/ui/EventCard";
import FilterSheet, { FilterState } from "../components/FilterSheet";
import { api } from "../lib/axios";
import { usePreviousPageStore } from "@/stores/previousPageStore";
import { trackButtonClicked, trackPageViewed } from "@/amplitude/track";
import { useScrapSyncStore } from "@/stores/scrapSyncStore";
import { Button } from "@/components/ui/buttons";
import searchIcon_white from "@/assets/searchIcon_white.svg";

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

export default function ScrapPage() {
  const [selectedSegment, setSelectedSegment] = React.useState(() => {
    const saved = sessionStorage.getItem("scrapPageSelectedSegment");
    return saved || "많이 본";
  });
  const segments = ["많이 본", "많이 찜한", "임박한"];

  // articles를 useState로 관리
  const [articleList, setArticleList] = React.useState<Article[]>([]);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();
  const scrapUpdates = useScrapSyncStore((state) => state.updates);
  const setScrapStatus = useScrapSyncStore((state) => state.setScrapStatus);

  // API 중복 호출 방지를 위한 ref
  const fetchingRef = React.useRef(false);

  // 필터 상태
  const [filterSheetOpen, setFilterSheetOpen] = React.useState(false);
  const [filterState, setFilterState] = React.useState<FilterState>(() => {
    const saved = sessionStorage.getItem("scrapPageFilterState");
    return saved
      ? JSON.parse(saved)
      : {
          types: [],
          includePast: false, // 기본값을 '지난행사제외'로 변경
          hasExplicitDateFilter: false,
        };
  });

  // 세션 스토리지 저장
  React.useEffect(() => {
    sessionStorage.setItem("scrapPageSelectedSegment", selectedSegment);
  }, [selectedSegment]);

  React.useEffect(() => {
    sessionStorage.setItem("scrapPageFilterState", JSON.stringify(filterState));
  }, [filterState]);

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

      // 2. 스크랩 응답 데이터를 Article 타입에 맞게 변환 (개별 API 호출 제거)
      const articlesWithDetails = scrapList.map((scrapItem: any) => ({
        id: scrapItem.articleId, // 백엔드에서 articleId 필드로 제공
        title: scrapItem.title,
        organization: scrapItem.organization,
        thumbnailPath: scrapItem.thumbnailPath,
        scrapCount: scrapItem.scrapCount,
        viewCount: scrapItem.viewCount,
        tags: Array.isArray(scrapItem.tags)
          ? scrapItem.tags
          : [scrapItem.tags].filter(Boolean),
        description: scrapItem.description || "",
        location: scrapItem.location || "",
        startAt: scrapItem.startAt,
        endAt: scrapItem.endAt,
        imagePaths: Array.isArray(scrapItem.imagePaths)
          ? scrapItem.imagePaths
          : [],
        registrationUrl: scrapItem.registrationUrl || "",
        isScrapped: true,
      }));

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

      const overrides = useScrapSyncStore.getState().updates;
      const articlesWithOverrides = filteredArticles.map((article) => {
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
    filterState.types.join(","), // 배열을 문자열로 변환하여 안정적인 의존성 생성
    filterState.includePast,
    filterState.hasExplicitDateFilter,
    navigate,
  ]);

  // API: 스크랩 토글 (스크랩 해제만 가능)
  const handleToggleScrap = async (id: string) => {
    // 앰플리튜드 - 버튼 클릭 트래킹
    trackButtonClicked({
      buttonName: "scrap_article",
      pageName: "scrap_list",
    });
    const article = articleList.find((a) => a.id === id);
    if (!article) return;

    const previousScrapStatus = article.isScrapped ?? false;
    const previousScrapCount = article.scrapCount;
    const newScrapStatus = !previousScrapStatus;
    const newScrapCount = previousScrapStatus
      ? previousScrapCount - 1
      : previousScrapCount + 1;

    try {
      // 즉시 UI 업데이트
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

  // 필터 버튼 클릭
  const handleOpenFilter = () => {
    setFilterSheetOpen(true);
    // 앰플리튜드 - 버튼 클릭 트래킹
    trackButtonClicked({ buttonName: "open_filter", pageName: "scrap_list" });
  };
  const handleCloseFilter = () => {
    setFilterSheetOpen(false);
    // 앰플리튜드 - 버튼 클릭 트래킹
    trackButtonClicked({
      buttonName: "close_filter",
      pageName: "scrap_list",
    });
  };
  const handleApplyFilter = () => {
    setFilterSheetOpen(false);
    // 앰플리튜드 - 버튼 클릭 트래킹
    trackButtonClicked({
      buttonName: "apply_filter",
      pageName: "scrap_list",
    });
  };

  const previousPage = usePreviousPageStore((state) => state.previousPage);

  // 앰플리튜드 - 페이지 조회 트래킹
  useEffect(() => {
    trackPageViewed({
      pageName: "scrap_list",
      previousPage: previousPage,
    });
  }, [previousPage]);

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
              articleList.map((article, index) => (
                <EventCard
                  key={article.id || `scrap-article-${index}`}
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

        {/* 검색 플로팅 버튼 - 필터 시트 닫혔을 때만 표시 */}
        {!filterSheetOpen && (
          <div className="fixed inset-0 z-50 pointer-events-none">
            <div className="relative w-full max-w-[460px] h-full mx-auto">
              <div className="absolute bottom-5 right-5 pointer-events-auto">
                <Button
                  buttonType="text"
                  styleType="brand"
                  className="flex items-center rounded-full px-4 py-3 gap-1"
                  onClick={() => {
                    navigate("/scrap/search");
                  }}
                >
                  <img
                    src={searchIcon_white}
                    width={24}
                    height={24}
                    alt="search"
                  />
                  검색
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
