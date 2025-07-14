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

      // 새로 업로드할 이미지 파일 추출
      const newThumbnailFile = data.thumbnailPath?.[0] ?? null;
      const newImageFiles = data.imagePaths
        ? (Array.from(data.imagePaths) as File[])
        : [];

      // 썸네일 이미지 정보
      let thumbnailInfo = null;
      if (newThumbnailFile) {
        thumbnailInfo = {
          fileName: newThumbnailFile.name,
          mimeType: newThumbnailFile.type,
        };
      }

      // 상세 이미지 정보
      const fileInfoList: { fileName: string; mimeType: string }[] = [];
      newImageFiles.forEach((file: File) => {
        fileInfoList.push({
          fileName: file.name,
          mimeType: file.type,
        });
      });

      console.log("썸네일 정보:", thumbnailInfo);
      console.log("상세 이미지 정보:", fileInfoList);

      // 1단계: POST /article로 게시글 생성 (이미지 제외)
      const articleResponse = await api.post("/article", {
        title: data.title,
        organization: data.organization,
        description: data.description || "",
        location: data.location,
        startAt: new Date(data.startAt).toISOString(),
        endAt: new Date(data.endAt).toISOString(),
        registrationUrl: data.registrationUrl || "",
        tags: data.tags || [],
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const articleId = articleResponse.data.id;
      console.log("게시글 생성 성공, ID:", articleId);

      // 2단계: 이미지가 있는 경우 presigned URL 요청 및 업로드
      if (thumbnailInfo || fileInfoList.length > 0) {
        // POST /media/presigned-url
        const presignedBody: any = { articleId, fileInfoList };
        if (thumbnailInfo) presignedBody.thumbnailInfo = thumbnailInfo;

        console.log("Presigned URL 요청:", presignedBody);
        const { data: presignedData } = await api.post(
          "/media/presigned-url",
          presignedBody
        );

        console.log("Presigned URL 응답:", presignedData);

        // PUT (presignedUrl을 통해 S3에 파일 업로드)
        const uploadPromises: Promise<any>[] = [];

        // 썸네일 업로드
        if (presignedData.thumbnailPresignedUrl && newThumbnailFile) {
          uploadPromises.push(
            fetch(presignedData.thumbnailPresignedUrl.presignedUrl, {
              method: "PUT",
              body: newThumbnailFile,
              headers: {
                "Content-Type": newThumbnailFile.type,
              },
            })
          );
        }

        // 상세 이미지 업로드
        const imageUrls: string[] = [];
        if (Array.isArray(presignedData.presignedUrls)) {
          presignedData.presignedUrls.forEach((presigned: any, idx: number) => {
            const file = newImageFiles[idx];
            if (file && presigned) {
              uploadPromises.push(
                fetch(presigned.presignedUrl, {
                  method: "PUT",
                  body: file,
                  headers: {
                    "Content-Type": file.type,
                  },
                })
              );
              imageUrls.push(presigned.imageUrl);
            }
          });
        }

        // 모든 파일 업로드 완료 대기
        if (uploadPromises.length > 0) {
          console.log("파일 업로드 시작...");
          await Promise.all(uploadPromises);
          console.log("파일 업로드 완료");
        }

        // 3단계: PATCH /media로 이미지 정보 등록
        const patchThumbnailInfo = presignedData.thumbnailPresignedUrl
          ? { imageUrl: presignedData.thumbnailPresignedUrl.imageUrl }
          : undefined;

        const patchFileInfoList = imageUrls.length > 0
          ? imageUrls.map((url) => ({ imageUrl: url }))
          : [];

        console.log("미디어 정보 등록:", {
          articleId,
          thumbnailInfo: patchThumbnailInfo,
          fileInfoList: patchFileInfoList,
        });

        await api.patch("/media", {
          articleId,
          thumbnailInfo: patchThumbnailInfo,
          fileInfoList: patchFileInfoList,
        });

        console.log("미디어 정보 등록 완료");
      }

      console.log("행사 등록 전체 프로세스 완료");
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
