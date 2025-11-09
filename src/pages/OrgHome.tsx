import { OrgHeader } from "@/components/OrgHeader";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LoadingCard } from "@/components/LoadingPlaceholder";
import { api } from "@/lib/axios";
import { useOrgAuthStore } from "@/stores/orgAuthStore";

type Article = {
  id: string;
  title: string;
  organization: string;
  startAt: string;
  endAt: string;
  location: string;
  thumbnail_path?: string;
  thumbnailPath?: string;
  description?: string;
  tags: string[];
  registrationUrl: string;
  scrapCount: number;
  viewCount: number;
  imagePaths: string[];
};

function ErrorAlert({
  message,
  retry,
}: {
  message: string;
  retry?: () => void;
}) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">{message}</p>
        </div>
        {retry && (
          <div className="ml-auto">
            <Button variant="outline" size="sm" onClick={retry}>
              다시 시도
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrgHome() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const accessToken = useOrgAuthStore((state) => state.accessToken);

  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/organization/article", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // API 응답 구조에 따라 배열 추출
      const articlesArray = Array.isArray(data)
        ? data
        : data.articles || data.data || [];
      console.log("기관 게시글 API 응답:", data);
      console.log("추출된 articles:", articlesArray);

      setArticles(articlesArray);
    } catch (error: any) {
      console.error("Failed to fetch articles:", error);
      setError(
        error.response?.data?.message ||
          "행사 목록을 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <>
      <OrgHeader />
      <div className="container mx-auto py-8 pt-20">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">내 행사 관리</h1>
          <Button onClick={() => navigate("/org/event/upload")}>
            행사 등록
          </Button>
        </div>

        {error ? (
          <ErrorAlert message={error} retry={fetchArticles} />
        ) : loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <LoadingCard key={i} />
            ))}
          </div>
        ) : !Array.isArray(articles) || articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">등록된 행사가 없습니다.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => navigate("/org/event/upload")}
            >
              첫 행사 등록하기
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.isArray(articles) &&
              articles.map((article) => (
                <div
                  key={article.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/org/event/${article.id}`)}
                >
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    {(article.thumbnail_path || article.thumbnailPath) && (
                      <div className="relative">
                        <img
                          src={article.thumbnail_path || article.thumbnailPath}
                          alt={article.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute bottom-2 right-2 flex gap-2">
                          <span className="bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            👁️ {article.viewCount}
                          </span>
                          <span className="bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            🔖 {article.scrapCount}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex gap-2 mb-2">
                        {article.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-lg font-semibold mb-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {article.organization}
                      </p>
                      <div className="text-gray-500 text-sm">
                        <p className="flex items-center gap-1">
                          <span>📅</span>
                          {new Date(article.startAt).toLocaleDateString()}
                        </p>
                        <p className="flex items-center gap-1">
                          <span>📍</span>
                          {article.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </>
  );
}
