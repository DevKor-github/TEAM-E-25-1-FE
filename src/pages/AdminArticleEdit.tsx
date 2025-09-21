import { AdminHeader } from "@/components/AdminHeader";
import { useParams, useNavigate } from "react-router-dom";
import { ArticleForm, ArticleFormValues } from "@components/ArticleForm";
import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";

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

export default function AdminArticleEdit() {
  const { articleId } = useParams(); // URL 파라미터에서 articleId 가져오기
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [error, setError] = useState<string | null>(null);

  const allowedTagTypes = [
    "강연",
    "공모전",
    "대회",
    "박람회",
    "설명회",
    "축제",
  ] as const; // 배열의 값을 변하지 않는 고정값(리터럴)으로 지정

  // UTC 날짜를 로컬 datetime input 값으로 변환하는 함수
  function toLocalDatetimeInputValue(utcString: string) {
    if (!utcString) return "";

    const date = new Date(utcString);
    // padStart로 2자리 길이 맞춤
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  }

  // article을 ArticleFormValues 형태로 변환하는 함수
  function articleToFormDefault(article: Article): Partial<ArticleFormValues> {
    return {
      ...article,
      tags: (article.tags ?? []).filter(
        (tag): tag is (typeof allowedTagTypes)[number] =>
          allowedTagTypes.includes(tag as any)
      ),
      startAt: article.startAt
        ? toLocalDatetimeInputValue(article.startAt)
        : "",
      endAt: article.endAt ? toLocalDatetimeInputValue(article.endAt) : "",
      registrationStartAt: article.registrationStartAt
        ? toLocalDatetimeInputValue(article.registrationStartAt)
        : "",
      registrationEndAt: article.registrationEndAt
        ? toLocalDatetimeInputValue(article.registrationEndAt)
        : "",

      // 이미지 필드는 undefined로 처리
      thumbnailPath: undefined,
      imagePaths: undefined,
    };
  }

  // id에 해당하는 행사 데이터 가져오기
  useEffect(() => {
    if (!articleId) return;

    const fetchArticle = async () => {
      try {
        const { data } = await api.get(`/article/${articleId}`);
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
  }, [articleId, navigate]);

  // 수정 요청 처리
  const handleSubmit = async (
    data: any,
    remainingImageUrls?: string[],
    remainingThumbnailUrl?: string
  ) => {
    try {
      // registrationStartAt, registrationEndAt 빈 문자열("")이면 null로 변환
      const fixedRegistrationStartAt = data.registrationStartAt
        ? new Date(data.registrationStartAt).toISOString()
        : null;
      const fixedRegistrationEndAt = data.registrationEndAt
        ? new Date(data.registrationEndAt).toISOString()
        : null;

      // 새로 업로드할 이미지 파일 추출
      const newThumbnailFile = data.thumbnailPath?.[0] ?? null;
      const newImageFiles = data.imagePaths
        ? (Array.from(data.imagePaths) as File[])
        : [];

      const isThumbnailUnchanged = !!remainingThumbnailUrl && !newThumbnailFile;
      const isImageUnchanged =
        (!newImageFiles || newImageFiles.length === 0) &&
        remainingImageUrls &&
        article?.imagePaths &&
        remainingImageUrls.length === article.imagePaths.length &&
        remainingImageUrls.every(
          (url, idx) => url === article.imagePaths?.[idx]
        );

      // 썸네일, 상세 이미지 모두 변경사항 없는 경우 PATCH /article만 요청
      if (isThumbnailUnchanged && isImageUnchanged) {
        await api.patch(`/article/${articleId}`, {
          title: data.title,
          organization: data.organization,
          description: data.description,
          location: data.location,
          startAt: new Date(data.startAt).toISOString(),
          endAt: new Date(data.endAt).toISOString(),
          registrationStartAt: fixedRegistrationStartAt,
          registrationEndAt: fixedRegistrationEndAt,
          registrationUrl: data.registrationUrl,
          tags: data.tags,
        });

        alert("행사가 성공적으로 수정되었습니다!");
        navigate(`/admin/event/${articleId}`);
        return;
      }

      // 썸네일 이미지 정보
      let thumbnailInfo = null;
      if (!isThumbnailUnchanged && newThumbnailFile) {
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

      // POST /media/presigned-url
      let thumbnailPresignedUrl = null;
      let thumbnailImageUrl = remainingThumbnailUrl || null;
      let imagePresignedUrls: { presignedUrl: string; imageUrl: string }[] = [];

      if (thumbnailInfo || fileInfoList.length > 0) {
        const presignedBody: any = { articleId, fileInfoList };
        // thumbnailInfo가 있는 경우 필드 추가해서 API 요청
        if (thumbnailInfo) presignedBody.thumbnailInfo = thumbnailInfo;

        const { data: presignedData } = await api.post(
          "/media/presigned-url",
          presignedBody
        );

        // 썸네일 이미지 presignedUrl
        if (presignedData.thumbnailPresignedUrl) {
          thumbnailPresignedUrl =
            presignedData.thumbnailPresignedUrl.presignedUrl;
          thumbnailImageUrl = presignedData.thumbnailPresignedUrl.imageUrl;
        }
        // 상세 이미지 presignedUrls
        if (Array.isArray(presignedData.presignedUrls)) {
          imagePresignedUrls = presignedData.presignedUrls;
        }
      }

      // PUT (presignedUrl을 통해 S3에 파일 업로드)
      const uploadPromises: Promise<any>[] = [];

      if (!isThumbnailUnchanged && thumbnailPresignedUrl && newThumbnailFile) {
        uploadPromises.push(
          fetch(thumbnailPresignedUrl, {
            method: "PUT",
            body: newThumbnailFile,
            headers: {
              "Content-Type": newThumbnailFile.type,
            },
          })
        );
      }

      // 남겨둔 기존 상세 이미지 + 새로 업로드한 상세 이미지의 imageUrl 배열
      let finalImageUrls: string[] = remainingImageUrls
        ? [...remainingImageUrls]
        : [];

      newImageFiles.forEach((file, idx) => {
        const presigned = imagePresignedUrls[idx];
        if (presigned) {
          uploadPromises.push(
            fetch(presigned.presignedUrl, {
              method: "PUT",
              body: file,
              headers: {
                "Content-Type": file.type,
              },
            })
          );
          finalImageUrls.push(presigned.imageUrl);
        }
      });

      if (uploadPromises.length > 0) {
        await Promise.all(uploadPromises);
      }

      // PATCH /media 요청
      const patchThumbnailInfo = thumbnailImageUrl
        ? { imageUrl: thumbnailImageUrl }
        : undefined;

      const patchFileInfoList =
        finalImageUrls.length > 0
          ? finalImageUrls.map((url) => ({ imageUrl: url }))
          : [];

      await api.patch("/media", {
        articleId,
        thumbnailInfo: patchThumbnailInfo,
        fileInfoList: patchFileInfoList,
      });

      // PATCH /article/{articleId} 이미지를 제외한 게시글 정보 수정
      await api.patch(`/article/${articleId}`, {
        title: data.title,
        organization: data.organization,
        description: data.description,
        location: data.location,
        startAt: new Date(data.startAt).toISOString(),
        endAt: new Date(data.endAt).toISOString(),
        registrationStartAt: new Date(data.registrationStartAt).toISOString(),
        registrationEndAt: new Date(data.registrationEndAt).toISOString(),
        registrationUrl: data.registrationUrl,
        tags: data.tags,
      });

      alert("행사가 성공적으로 수정되었습니다!");
      navigate(`/admin/event/${articleId}`);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError("수정할 행사를 찾을 수 없습니다.");
      } else if (err.response?.status === 500) {
        setError("행사 수정 중 서버 오류가 발생했습니다.");
      } else {
        setError("행사 수정 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <>
      <AdminHeader />
      <div className="max-w-2xl mx-auto p-6 pt-20">
        {error ? (
          <div className="max-w-md mx-auto mt-10">
            <p className="text-red-600 font-semibold">{error}</p>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={() => navigate("/admin/home")}>
                홈으로 이동
              </Button>
            </div>
          </div>
        ) : (
          article && (
            <>
              <h2 className="text-2xl font-bold mb-4">행사 수정</h2>
              <ArticleForm
                onSubmit={handleSubmit}
                defaultValues={articleToFormDefault(article)}
                thumbnailPreviewUrl={article.thumbnailPath}
                imagePreviewUrls={article.imagePaths}
              />
            </>
          )
        )}
      </div>
    </>
  );
}
