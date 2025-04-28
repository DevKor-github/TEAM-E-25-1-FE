import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

  // 로딩 중 표시
  if (loading) {
    return <div>로딩 중...</div>;
  }

  // 에러 메시지 표시
  if (error) {
    return (
      <div className="max-w-md mx-auto mt-10">
        <p className="text-red-600 font-semibold">{error}</p>
        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={() => navigate("/admin-home")}>
            홈으로 이동
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {articleData.title}
          </CardTitle>
          <CardDescription>행사 상세정보</CardDescription>
        </CardHeader>
        <CardContent>
          {/* 썸네일 이미지 */}
          <div className="mb-4">
            <img
              src={articleData.thumbnail_path}
              alt="썸네일 이미지"
              className="w-full h-auto rounded"
            />
          </div>

          {/* 상세 이미지 */}
          {articleData.imagePaths && (
            <div className="grid grid-cols-2 gap-4 mb-4">
              {articleData.imagePaths.map((url: string, index: number) => (
                <img
                  key={index}
                  src={url}
                  alt={`상세 이미지 ${index + 1}`}
                  className="w-full h-auto rounded"
                />
              ))}
            </div>
          )}

          <p className="text-gray-700 mb-2">
            <strong>주관 기관:</strong> {articleData.organization}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>장소:</strong> {articleData.location}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>시작 일시:</strong>{" "}
            {new Date(articleData.startAt).toLocaleString()}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>종료 일시:</strong>{" "}
            {new Date(articleData.endAt).toLocaleString()}
          </p>
          {articleData.description && (
            <p className="text-gray-700 mb-2">
              <strong>내용:</strong> {articleData.description}
            </p>
          )}
          {articleData.registrationUrl && (
            <p className="text-gray-700 mb-2">
              <strong>신청 링크:</strong>{" "}
              <a
                href={articleData.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {articleData.registrationUrl}
              </a>
            </p>
          )}
        </CardContent>
      </Card>
      <div className="mt-6 flex justify-end">
        <Button variant="outline" onClick={() => navigate("/admin-home")}>
          홈으로 이동
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate(`/admin/article/${articleId}/edit`)}
        >
          수정
        </Button>
        <Button variant="outline" onClick={handleDelete}>
          삭제
        </Button>
      </div>
    </div>
  );
}
