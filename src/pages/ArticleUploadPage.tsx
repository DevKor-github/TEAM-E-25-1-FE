import { AdminHeader } from "@/components/AdminHeader";
import { ArticleForm } from "@components/ArticleForm";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/axios";

export default function ArticleUploadPage() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    try {
      setError(null);
      console.log("제출 데이터:", data);

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("organization", data.organization);
      formData.append("description", data.description || "");
      formData.append("location", data.location);
      formData.append("startAt", new Date(data.startAt).toISOString());
      formData.append("endAt", new Date(data.endAt).toISOString());
      
      if (data.registrationUrl) {
        formData.append("registrationUrl", data.registrationUrl);
      }

      // tags 처리 - ArticleForm에서 배열로 오므로 JSON 문자열로 변환
      if (data.tags && Array.isArray(data.tags) && data.tags.length > 0) {
        formData.append("tags", JSON.stringify(data.tags));
      }

      // 썸네일 이미지 처리
      if (data.thumbnailPath?.[0]) {
        formData.append("thumbnail", data.thumbnailPath[0]);
      }

      // 상세 이미지들 처리 
      if (data.imagePaths?.length) {
        Array.from(data.imagePaths as File[]).forEach((file: File) => {
          formData.append("images", file); //백엔드 스펙 맞춤
        });
      }

      // FormData 내용 확인용 로그
      console.log("FormData 내용:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await api.post("/article", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log("게시글 생성 성공:", response.data);
      alert("행사가 성공적으로 등록되었습니다!");
      navigate("/admin/home");
    } catch (err: any) {
      console.error("게시글 생성 실패:", err);
      console.error("에러 응답:", err.response?.data);
      setError(
        err.response?.data?.message || "행사 등록 중 오류가 발생했습니다."
      );
    }
  };

  return (
    <>
      <AdminHeader />
      <div className="max-w-2xl mx-auto p-6 pt-20">
        <h2 className="text-2xl font-bold mb-4">행사 등록</h2>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <ArticleForm onSubmit={handleSubmit} />
      </div>
    </>
  );
}
