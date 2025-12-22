import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "@/lib/axios";
import { useScrapSyncStore } from "@/stores/scrapSyncStore";
import HeaderFrame from "../components/HeaderFrame";
import { InputField } from "@/components/ui/InputField";
import EventCard from "../components/ui/EventCard";
import emptyFileIcon from "@/assets/emptyFileIcon.svg";

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

export default function ScrapSearch() {
  const navigate = useNavigate();

  // URL Query Parameter에서 keyword 읽기
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("keyword") ?? "";
  const [searchValue, setSearchValue] = useState(initialQuery);

  const [searchedScrapedArticles, setSearchedScrapedArticles] = useState<
    Article[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const scrapUpdates = useScrapSyncStore((state) => state.updates);
  const setScrapStatus = useScrapSyncStore((state) => state.setScrapStatus);

  // 뒤로가기로 돌아왔을 때 URL Query Parameter에 keyword가 있으면 검색 API 재호출
  useEffect(() => {
    const keyword = searchParams.get("keyword") ?? "";
    setSearchValue(keyword);

    if (keyword && keyword.length >= 2) {
      fetchSearchedScrapedArticles(keyword);
    } else {
      setSearchedScrapedArticles([]);
    }
  }, [searchParams]);

  // Enter 입력 시 URL Query Parameter에 keyword 반영 및 검색 API 호출
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const trimmedKeyword = searchValue.trim();
      if (trimmedKeyword.length < 2) {
        setSearchedScrapedArticles([]);
        alert("두 글자 이상 입력해주세요.");
        return;
      }

      setSearchParams({ keyword: trimmedKeyword });
    }
  };

  // 스크랩 목록 게시글 검색 API
  const fetchSearchedScrapedArticles = async (keyword: string) => {
    try {
      setLoading(true);
      setHasSearched(true);

      const apiParams = {
        keyword,
        page: 1,
        limit: 10,
      };

      const response = await api.get("/scrap/search", {
        params: apiParams,
      });

      const articles = Array.isArray(response.data) ? response.data : [];

      // 스크랩 목록에서 검색한 게시글은 모두 isScrapped가 true이므로 간단히 매핑
      const articlesWithScrapStatus = articles.map((article) => ({
        ...article,
        id: article.articleId, // 스크랩 API는 id가 articleId로 옴
        isScrapped: true,
      }));

      const overrides = useScrapSyncStore.getState().updates;
      const articlesWithOverrides = articlesWithScrapStatus.map(
        (article: Article) => {
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
        }
      );

      setSearchedScrapedArticles(articlesWithOverrides);
    } catch (err: any) {
      if (err.response?.status === 400) {
        alert("잘못된 검색 요청입니다.");
      } else if (err.response?.status === 500) {
        alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      } else {
        alert("검색 결과를 불러오는 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  // API: 스크랩 토글 (스크랩 해제만 가능)
  const handleToggleScrap = async (id: string) => {
    const article = searchedScrapedArticles.find((a) => a.id === id);
    if (!article) return;

    const previousScrapStatus = article.isScrapped ?? false;
    const previousScrapCount = article.scrapCount;
    const newScrapStatus = !previousScrapStatus;
    const newScrapCount = previousScrapStatus
      ? previousScrapCount - 1
      : previousScrapCount + 1;

    try {
      // 즉시 UI 업데이트
      setSearchedScrapedArticles((prev) =>
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
      setSearchedScrapedArticles((prev) =>
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

  useEffect(() => {
    setSearchedScrapedArticles((prev) =>
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

        <div className="px-5 pt-5 font-semibold text-title3 text-gray-800 font-pretendard">
          찜한 행사 검색
        </div>

        <div className="mt-3 px-5 w-full">
          <InputField
            value={searchValue}
            onValueChange={setSearchValue}
            onKeyDown={handleSearchKeyDown}
          />
        </div>

        <div className="mt-3 flex flex-col px-5">
          <div className="flex flex-col gap-4 mt-4 w-full items-center">
            {searchedScrapedArticles.length === 0 && hasSearched ? (
              <div className="flex flex-col w-full gap-3 items-center px-5 py-10">
                <img
                  src={emptyFileIcon}
                  alt="search-result-empty"
                  className="w-10 h-10"
                />
                <div className="text-center text-body2 text-gray-500 font-pretendard">
                  검색 결과가 없어요. <br />
                  다른 검색어를 입력해주세요.
                </div>
              </div>
            ) : (
              searchedScrapedArticles.map((article, index) => (
                <EventCard
                  key={article.id || `scrap-article-${index}`}
                  {...article}
                  isScrapped={article.isScrapped !== false} // 동적으로 처리, 기본값은 true (스크랩 페이지이므로)
                  onCardClick={() => {
                    if (article.id) {
                      navigate(`/event/${article.id}`);
                    }
                    console.log(article.id);
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
