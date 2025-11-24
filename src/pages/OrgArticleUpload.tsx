import { OrgHeader } from "@/components/OrgHeader";
import { ArticleForm } from "@/components/ArticleForm";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/axios";
import { useOrgAuthStore } from "@/stores/orgAuthStore";

export default function OrgArticleUpload() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const accessToken = useOrgAuthStore((state) => state.accessToken);

  const handleSubmit = async (data: any) => {
    try {
      setError(null);

      const fixedRegistrationStartAt = data.registrationStartAt
        ? new Date(data.registrationStartAt).toISOString()
        : null;
      const fixedRegistrationEndAt = data.registrationEndAt
        ? new Date(data.registrationEndAt).toISOString()
        : null;

      const newThumbnailFile = data.thumbnailPath?.[0] ?? null;
      const newImageFiles = data.imagePaths
        ? (Array.from(data.imagePaths) as File[])
        : [];

      if (!newThumbnailFile) {
        setError("썸네일 이미지를 업로드해주세요.");
        return;
      }

      let thumbnailInfo = null;
      if (newThumbnailFile) {
        thumbnailInfo = {
          fileName: newThumbnailFile.name,
          mimeType: newThumbnailFile.type,
        };
      }

      const fileInfoList: { fileName: string; mimeType: string }[] = [];
      newImageFiles.forEach((file: File) => {
        fileInfoList.push({
          fileName: file.name,
          mimeType: file.type,
        });
      });

      // 1단계: POST /organization/article로 게시글 생성
      const articleResponse = await api.post(
        "/organization/article",
        {
          title: data.title,
          organization: data.organization,
          description: data.description || "",
          location: data.location,
          startAt: new Date(data.startAt).toISOString(),
          endAt: new Date(data.endAt).toISOString(),
          registrationStartAt: fixedRegistrationStartAt,
          registrationEndAt: fixedRegistrationEndAt,
          registrationUrl: data.registrationUrl || "",
          tags: data.tags || [],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (articleResponse.status !== 201) {
        throw new Error("게시글 생성 응답 코드가 올바르지 않습니다.");
      }

      const articleId =
        articleResponse.data.articleId || articleResponse.data.id;

      if (!articleId) {
        throw new Error("게시글 ID가 생성되지 않았습니다.");
      }

      // 2단계: 이미지 업로드
      if (thumbnailInfo || fileInfoList.length > 0) {
        const presignedBody: any = { articleId, fileInfoList };
        if (thumbnailInfo) presignedBody.thumbnailInfo = thumbnailInfo;

        const { data: presignedData } = await api.post(
          "/media/presigned-url",
          presignedBody,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const uploadPromises: Promise<any>[] = [];

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

        if (uploadPromises.length > 0) {
          const uploadResults = await Promise.all(uploadPromises);
          uploadResults.forEach((result, index) => {
            if (!result.ok) {
              throw new Error(
                `파일 업로드 실패 (${index + 1}번째 파일): ${result.status} ${result.statusText}`
              );
            }
          });
        }

        // 3단계: PATCH /media로 이미지 정보 등록
        const patchThumbnailInfo = presignedData.thumbnailPresignedUrl
          ? { imageUrl: presignedData.thumbnailPresignedUrl.imageUrl }
          : undefined;

        const patchFileInfoList =
          imageUrls.length > 0
            ? imageUrls.map((url) => ({ imageUrl: url }))
            : [];

        try {
          await api.patch(
            "/media",
            {
              articleId,
              thumbnailInfo: patchThumbnailInfo,
              fileInfoList: patchFileInfoList,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
        } catch (mediaError: any) {
          throw new Error(
            `미디어 정보 등록 실패: ${mediaError.response?.data?.message || mediaError.message}`
          );
        }
      }

      alert("행사가 성공적으로 등록되었습니다!");
      navigate("/org/home");
    } catch (err: any) {
      console.error("등록 오류:", err);
      
      if (err.response?.status === 500) {
        setError("게시글 생성 실패. 서버 오류가 발생했습니다. 다시 시도해주세요.");
      } else {
        setError(
          err.response?.data?.message || "행사 등록 중 오류가 발생했습니다."
        );
      }
    }
  };

  return (
    <>
      <OrgHeader />
      <div className="max-w-2xl mx-auto p-6 pt-20">
        <h2 className="text-2xl font-bold mb-4">행사 등록</h2>
        {error && <div className="text-red-600 mb-4">{error}</div>}

        <div className="mb-6 p-4 border border-blue-200 rounded-lg bg-blue-50">
          <h3 className="font-semibold text-blue-800 mb-2">
            💡 상세 이미지 업로드 안내
          </h3>
          <p className="text-sm text-blue-700">
            • 상세 이미지 선택 시 <strong>Ctrl+클릭</strong> 또는{" "}
            <strong>Shift+클릭</strong>으로 여러 이미지를 한 번에 선택할 수
            있습니다.
            <br />
            • 최대 10개까지 선택 가능합니다.
            <br />• 각 파일은 5MB 이하, JPG 또는 PNG 형식만 가능합니다.
          </p>
        </div>

        <ArticleForm onSubmit={handleSubmit} />
      </div>
    </>
  );
}
