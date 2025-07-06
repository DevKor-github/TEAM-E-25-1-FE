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

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("organization", data.organization);
      formData.append("description", data.content);
      formData.append("location", data.location);
      formData.append("startAt", new Date(data.start_datetime).toISOString());
      formData.append("endAt", new Date(data.end_datetime).toISOString());
      if (data.link) formData.append("registrationUrl", data.link);
      formData.append("tags", data.event_type);

      // Handle file uploads
      if (data.thumbnail_image?.[0]) {
        formData.append("thumbnail", data.thumbnail_image[0]);
      }

      if (data.detail_image?.length) {
        Array.from(data.detail_image as File[]).forEach((file: File) => {
          formData.append("media", file);
        });
      }

      await api.post("/article", formData);
      alert("행사가 성공적으로 등록되었습니다!");
      navigate("/admin/home");
    } catch (err: any) {
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
