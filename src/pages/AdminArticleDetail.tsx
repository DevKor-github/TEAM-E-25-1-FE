import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@components/ui/button";

export default function AdminArticleDetail() {
  const { articleId } = useParams(); // URL 파라미터에서 articleId 가져오기
  const navigate = useNavigate();
  const [articleData, setArticleData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // id에 해당하는 행사 데이터 가져오기
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`/article/${articleId}`);

        setArticleData(response.data);
      } catch (err: any) {
        if (
          err.response?.status === 404 &&
          err.response?.data?.code === "ARTICLE_NOT_FOUND_FOR_VIEW"
        ) {
          setError("요청한 행사를 찾을 수 없습니다.");
        } else {
          setError("행사 데이터를 불러오는 중 오류가 발생했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleId, navigate]);

  // 삭제 요청 처리
  const handleDelete = async () => {
    const confirmDelete = window.confirm("정말로 이 행사를 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/article/${articleId}`);

      alert("행사가 성공적으로 삭제되었습니다!");
      navigate("/admin-home");
    } catch (err: any) {
      if (
        err.response?.status === 404 &&
        err.response?.data?.code === "ARTICLE_NOT_FOUND_FOR_UPDATE"
      ) {
        setError("삭제할 행사를 찾을 수 없습니다.");
      } else {
        setError("행사 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="py-8 max-w-4xl mx-auto">
      {loading ? (
        <div>로딩 중...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <>
          {/* 행사 상세 정보 */}
          <div className="bg-white rounded-lg shadow-md">
            {articleData.thumbnail_path && (
              <img
                src={articleData.thumbnail_path}
                alt="썸네일"
                className="w-full h-64 object-cover rounded-t-lg"
              />
            )}
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">{articleData.title}</h1>
              <div className="space-y-3 mb-6">
                <p><span className="font-semibold">주관:</span> {articleData.organization}</p>
                <p><span className="font-semibold">장소:</span> {articleData.location}</p>
                <p>
                  <span className="font-semibold">일시:</span>{" "}
                  {new Date(articleData.startAt).toLocaleString()} ~ {new Date(articleData.endAt).toLocaleString()}
                </p>
              </div>
              <div className="prose max-w-none mb-6">
                <h2 className="text-lg font-semibold mb-2">행사 설명</h2>
                <p className="whitespace-pre-line">{articleData.description}</p>
              </div>
              {articleData.registrationUrl && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">신청 링크</h2>
                  <a 
                    href={articleData.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {articleData.registrationUrl}
                  </a>
                </div>
              )}
              {/* 상세 이미지 */}
              {articleData.imagePaths && articleData.imagePaths.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-2">상세 이미지</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {articleData.imagePaths.map((url: string, index: number) => (
                      <img
                        key={index}
                        src={url}
                        alt={`상세 이미지 ${index + 1}`}
                        className="w-full h-auto rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* 하단 버튼 그룹 */}
          <div className="mt-6 flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => navigate(`/admin/article/${articleId}/edit`)}
            >
              수정
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              삭제
            </Button>
          </div>
        </>
      )}
    </div>
  );
}