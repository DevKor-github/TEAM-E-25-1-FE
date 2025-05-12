import { useParams, useNavigate } from "react-router-dom";
import { ArticleForm } from "@components/ArticleForm";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

export default function AdminArticleEdit() {
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
          err.response?.data?.code === "ARTICLE_NOT_FOUND_FOR_UPDATE"
        ) {
          setError("수정할 행사를 찾을 수 없습니다.");
        } else {
          setError("행사 데이터를 불러오는 중 오류가 발생했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleId, navigate]);

  // 수정 요청 처리
  const handleSubmit = async (data: any) => {
    try {
      const formData = new FormData();

      // body 데이터 수정
      formData.append("title", data.title);
      formData.append("organization", data.organization);
      formData.append("description", data.content);
      formData.append("location", data.location);
      formData.append("startAt", new Date(data.start_datetime).toISOString());
      formData.append("endAt", new Date(data.end_datetime).toISOString());
      formData.append("registrationUrl", data.link);
      formData.append("tags", data.event_type);

      // 파일 데이터 수정
      if (data.thumbnail_image?.[0]) {
        formData.append("thumbnail", data.thumbnail_image[0]);
      }
      if (data.detail_image?.length) {
        Array.from(data.detail_image as File[]).forEach((file: File) => {
          formData.append("media", file);
        });
      }

      await axios.patch(`/article/${articleId}`, formData);

      alert("행사가 성공적으로 수정되었습니다!");
      navigate("/admin-home");
    } catch (err: any) {
      if (
        err.response?.status === 404 &&
        err.response?.data?.code === "ARTICLE_NOT_FOUND_FOR_UPDATE"
      ) {
        setError("수정할 행사를 찾을 수 없습니다.");
      } else {
        setError("행사 수정 중 오류가 발생했습니다.");
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
      <h2 className="text-2xl font-bold mb-4">행사 수정</h2>
      <ArticleForm onSubmit={handleSubmit} defaultValues={articleData} />
    </div>
  );
}
