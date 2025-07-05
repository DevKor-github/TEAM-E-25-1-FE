import { AdminHeader } from "@/components/AdminHeader";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { Button } from "@components/ui/button";

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
  imagePaths?: string[];
  registrationUrl?: string;
};

export default function AdminArticleDetail() {
  const navigate = useNavigate();
  const { articleId } = useParams(); // URL 파라미터에서 articleId 가져오기
  const [article, setArticle] = useState<Article | null>(null);
  const [error, setError] = useState<string | null>(null);

  // id에 해당하는 행사 데이터 가져오기
  useEffect(() => {
    if (!articleId) return;

    const fetchArticle = async () => {
      try {
        const { data } = await api.get(`/article/${articleId}`);
        setArticle(data);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError("해당 행사를 찾을 수 없습니다.");
        } else {
          setError("행사 정보를 불러오는 중 오류가 발생했습니다.");
        }
      }
    };

    fetchArticle();
  }, [articleId, navigate]);

  // 삭제 요청 처리
  const handleDelete = async () => {
    if (!window.confirm("정말로 이 행사를 삭제하시겠습니까?")) return;

    try {
      await api.delete(`/article/${articleId}`);

      alert("행사가 성공적으로 삭제되었습니다!");
      navigate("/admin/home");
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
      <AdminHeader />
      <div className="pt-20 py-8 max-w-4xl mx-auto">
        {error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          /* 정상 데이터 렌더링 */
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
                        <span
                          key={tag}
                          className="inline-block ml-2 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </p>
                    <p>
                      <span className="font-semibold">일시:</span>
                      {new Date(article.startAt).toLocaleString()} ~
                      {new Date(article.endAt).toLocaleString()}
                    </p>
                    <p>
                      <span className="font-semibold">장소:</span>
                      {article.location}
                    </p>
                    <p>
                      <span className="font-semibold">주최기관:</span>
                      {article.organization}
                    </p>
                  </div>

                  {article.description && (
                    <div className="prose max-w-none mb-6">
                      <h2 className="text-lg font-semibold mb-2">행사 설명</h2>
                      <p className="whitespace-pre-line">
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
                        className="text-blue-600 hover:underline"
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
              {/* 하단 버튼 그룹 */}
              <div className="mt-6 flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/admin/event/${articleId}/edit`)}
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
