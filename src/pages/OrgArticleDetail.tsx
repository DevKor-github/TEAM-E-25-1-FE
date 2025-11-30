import { OrgHeader } from "@/components/OrgHeader";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { useOrgAuthStore } from "@/stores/orgAuthStore";

type Article = {
  id: string;
  title: string;
  organization: string;
  thumbnailPath: string;
  scrapCount: number;
  viewCount: number;
  tags: string[];
  description?: string;
  location: string;
  startAt: string;
  endAt: string;
  registrationStartAt?: string;
  registrationEndAt?: string;
  imagePaths?: string[];
  registrationUrl?: string;
};

export default function OrgArticleDetail() {
  const navigate = useNavigate();
  const { articleId } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [error, setError] = useState<string | null>(null);
  const accessToken = useOrgAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (!articleId) return;

    const fetchArticle = async () => {
      try {
        const { data } = await api.get(`/article/${articleId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setArticle({
          ...data,
          tags: Array.isArray(data.tags)
            ? data.tags
            : typeof data.tags === "string"
              ? [data.tags]
              : [],
        });
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError("해당 행사를 찾을 수 없습니다.");
        } else {
          setError("행사 정보를 불러오는 중 오류가 발생했습니다.");
        }
      }
    };

    fetchArticle();
  }, [articleId, accessToken]);

  const handleDelete = async () => {
    if (!window.confirm("정말로 이 행사를 삭제하시겠습니까?")) return;

    try {
      await api.delete(`/organization/article/${articleId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      alert("행사가 성공적으로 삭제되었습니다!");
      navigate("/org/home");
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError("삭제할 행사를 찾을 수 없습니다.");
      } else {
        setError("행사 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <>
      <OrgHeader />
      <div className="pt-20 py-8 max-w-4xl mx-auto">
        {error ? (
          <div className="flex items-center justify-center text-red-600">
            {error}
          </div>
        ) : (
          article && (
            <>
              <div className="bg-white rounded-lg shadow-md">
                {article.thumbnailPath && (
                  <img
                    src={article.thumbnailPath}
                    alt="썸네일 이미지"
                    className="w-full h-64 object-cover rounded-t-lg"
                  />
                )}
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">{article.title}</h1>
                  <div className="space-y-3 mb-6">
                    <p>
                      <span className="font-semibold">태그:</span>
                      {article.tags.map((tag) => (
                        <span key={tag} className="ml-2">{tag}</span>
                      ))}
                    </p>
                    <p>
                      <span className="font-semibold">행사 일시:</span>{" "}
                      {new Date(article.startAt).toLocaleString()} ~{" "}
                      {new Date(article.endAt).toLocaleString()}
                    </p>
                    {article.registrationStartAt &&
                      article.registrationEndAt && (
                        <p>
                          <span className="font-semibold">신청 일시:</span>{" "}
                          {new Date(
                            article.registrationStartAt
                          ).toLocaleString()}{" "}
                          ~{" "}
                          {new Date(article.registrationEndAt).toLocaleString()}
                        </p>
                      )}

                    <p>
                      <span className="font-semibold">장소:</span>{" "}
                      {article.location}
                    </p>
                    <p>
                      <span className="font-semibold">주최기관:</span>{" "}
                      {article.organization}
                    </p>
                    <p>
                      <span className="font-semibold">조회수:</span>{" "}
                      {article.viewCount}
                    </p>
                    <p>
                      <span className="font-semibold">스크랩수:</span>{" "}
                      {article.scrapCount}
                    </p>
                  </div>

                  {article.description && (
                    <div className="prose max-w-none mb-6">
                      <h2 className="text-lg font-semibold mb-2">행사 설명</h2>
                      <p className="whitespace-pre-line break-words">
                        {article.description}
                      </p>
                    </div>
                  )}

                  {article.registrationUrl && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold mb-2">신청 링크</h2>
                      <a
                        href={article.registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-words text-blue-600 hover:underline"
                      >
                        {article.registrationUrl}
                      </a>
                    </div>
                  )}

                  {article.imagePaths && article.imagePaths.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold mb-2">
                        상세 이미지
                      </h2>
                      <div className="grid grid-cols-2 gap-4">
                        {article.imagePaths.map(
                          (url: string, index: number) => (
                            <img
                              key={index}
                              src={url}
                              alt={`상세 이미지 ${index + 1}`}
                              className="w-full h-auto rounded-lg"
                            />
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/org/event/${articleId}/edit`)}
                >
                  수정
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  삭제
                </Button>
              </div>
            </>
          )
        )}
      </div>
    </>
  );
}
