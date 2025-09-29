import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { Button } from "@components/ui/button";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png"];

// 상세 이미지 미리보기용 타입 정의
type DetailImageItem = {
  url: string; // 미리보기용 URL (기존 이미지 URL 또는 createObjectURL)
  file?: File; // 새로 추가된 파일일 경우만 존재
  isNew: boolean; // 새 파일 여부
};

const articleFormSchema = z
  .object({
    title: z
      .string({
        required_error: "제목은 필수 항목입니다.",
      })
      .min(1, { message: "제목은 필수 항목입니다." })
      .max(100, { message: "제목은 100자를 초과할 수 없습니다." }),

    organization: z
      .string({
        required_error: "주관 기관을 입력하세요.",
      })
      .min(1, { message: "주관 기관을 입력하세요." })
      .max(100, { message: "기관명은 100자를 초과할 수 없습니다." }),

    tags: z
      .array(z.enum(["축제", "강연", "설명회", "박람회", "공모전", "대회", "교육", "취업·창업"]))
      .min(1, { message: "최소 1개의 행사 종류를 선택해주세요." }),

    location: z
      .string({
        required_error: "장소를 입력하세요.",
      })
      .min(1, { message: "장소를 입력하세요." })
      .max(100, { message: "장소는 100자를 초과할 수 없습니다." }),

    startAt: z
      .string({
        required_error: "시작 일시를 입력하세요.",
      })
      .min(1, { message: "시작 일시를 입력하세요." }),

    endAt: z
      .string({
        required_error: "종료 일시를 입력하세요.",
      })
      .min(1, { message: "종료 일시를 입력하세요." }),

    registrationStartAt: z.string().optional(),

    registrationEndAt: z.string().optional(),

    description: z
      .string()
      .max(10000, { message: "내용은 10000자를 초과할 수 없습니다." })
      .optional(),

    registrationUrl: z.string().optional(),

    thumbnailPath: z
      .custom<FileList>()
      .refine(
        (files) => !files || files?.[0]?.size <= MAX_FILE_SIZE,
        "파일 크기는 5MB 이하여야 합니다."
      )
      .refine(
        (files) => !files || ALLOWED_FILE_TYPES.includes(files?.[0]?.type),
        "jpg 또는 png 파일만 업로드 가능합니다."
      ),

    imagePaths: z
      .custom<FileList>()
      .optional()
      .refine(
        (files) => !files || files.length <= 10,
        "상세 이미지는 최대 10개까지만 업로드할 수 있습니다."
      )
      .refine(
        (files) =>
          !files ||
          Array.from(files).every((file) => file.size <= MAX_FILE_SIZE),
        "각 파일의 크기는 5MB 이하여야 합니다."
      )
      .refine(
        (files) =>
          !files ||
          Array.from(files).every((file) =>
            ALLOWED_FILE_TYPES.includes(file.type)
          ),
        "jpg 또는 png 파일만 업로드 가능합니다."
      ),
  })
  .refine(
    (data) => {
      const start = new Date(data.startAt);
      const end = new Date(data.endAt);
      return start <= end;
    },
    {
      message: "시작일은 종료일보다 앞서야 합니다.",
      path: ["endAt"],
    }
  )
  .refine(
    (data) => {
      if (!data.registrationStartAt || !data.registrationEndAt) return true;
      const regStart = new Date(data.registrationStartAt);
      const regEnd = new Date(data.registrationEndAt);
      return regStart <= regEnd;
    },
    {
      message: "신청 시작일은 신청 종료일보다 앞서야 합니다.",
      path: ["registrationEndAt"],
    }
  )
  .refine(
    (data) => {
      const bothEmpty = !data.registrationStartAt && !data.registrationEndAt;
      const bothFilled = !!data.registrationStartAt && !!data.registrationEndAt;
      return bothEmpty || bothFilled;
    },
    {
      message: "신청 시작일과 종료일을 모두 입력하거나 모두 비워두세요.",
      path: ["registrationEndAt"],
    }
  );

export type ArticleFormValues = z.infer<typeof articleFormSchema>;

export function ArticleForm({
  onSubmit,
  defaultValues,
  thumbnailPreviewUrl,
  imagePreviewUrls,
}: {
  onSubmit: (
    values: ArticleFormValues,
    remainingImageUrls?: string[],
    remainingThumbnailUrl?: string
  ) => void;
  defaultValues?: Partial<ArticleFormValues>;
  thumbnailPreviewUrl?: string;
  imagePreviewUrls?: string[];
}) {
  const [previewThumbnail, setPreviewThumbnail] = useState<string | undefined>(
    thumbnailPreviewUrl
  );
  const [detailImages, setDetailImages] = useState<DetailImageItem[]>(
    (imagePreviewUrls ?? []).map((url) => ({ url, isNew: false }))
  );

  // 파일 누적 핸들러
  const handleFileAccumulation = (
    newFiles: FileList | null,
    onChange: (files: FileList | null) => void
  ) => {
    if (!newFiles || newFiles.length === 0) return;

    const newFileArray = Array.from(newFiles);

    setDetailImages((prev) => {
      // 중복 파일 제거 (파일명과 크기로 비교)
      const uniqueFiles = [...prev];

      newFileArray.forEach((file) => {
        const isDuplicate = uniqueFiles.some((item) =>
          !item.isNew
            ? false
            : item.file?.name === file.name && item.file?.size === file.size
        );
        if (!isDuplicate && uniqueFiles.length < 10) {
          uniqueFiles.push({
            url: URL.createObjectURL(file),
            file,
            isNew: true,
          });
        }
      });

      // FileList 객체로 변환하여 react-hook-form에 전달 (새 파일만)
      // setTimeout으로 render 이후(setDetailImages가 완료된 이후) onChange 호출
      setTimeout(() => {
        const dt = new DataTransfer();
        uniqueFiles.forEach((item) => {
          if (item.isNew && item.file) {
            dt.items.add(item.file);
          }
        });
        onChange(dt.files);
      }, 0);

      return uniqueFiles;
    });
  };

  // 썸네일 이미지 삭제 핸들러
  const handleRemoveThumbnail = () => {
    setPreviewThumbnail(undefined);
  };

  // 상세 이미지 삭제 핸들러
  const handleRemoveDetailImage = (idx: number) => {
    setDetailImages((prev) => prev.filter((_, i) => i !== idx));
  };

  // 폼 제출 전 썸네일 이미지 유효성 검사
  const handleValidatedSubmit = (values: ArticleFormValues) => {
    // 미리보기(기존) 썸네일과 새로 추가된 썸네일 모두 없는 경우 에러 처리
    if (
      !previewThumbnail &&
      (!values.thumbnailPath || values.thumbnailPath.length !== 1)
    ) {
      alert("썸네일 이미지를 첨부해주세요.");
      return;
    }
    // 정상 처리 (그대로 남겨둘 기존 이미지 URL만 추출)
    const remainingImageUrls = detailImages
      .filter((item) => !item.isNew)
      .map((item) => item.url);
    onSubmit(values, remainingImageUrls, previewThumbnail);
  };

  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      organization: defaultValues?.organization ?? "",
      tags: defaultValues?.tags ?? [],
      location: defaultValues?.location ?? "",
      startAt: defaultValues?.startAt ?? "",
      endAt: defaultValues?.endAt ?? "",
      registrationStartAt: defaultValues?.registrationStartAt ?? "",
      registrationEndAt: defaultValues?.registrationEndAt ?? "",
      description: defaultValues?.description ?? "",
      registrationUrl: defaultValues?.registrationUrl ?? "",
      thumbnailPath: defaultValues?.thumbnailPath ?? undefined,
      imagePaths: defaultValues?.imagePaths ?? undefined,
    },
    mode: "onTouched",
    criteriaMode: "all",
    shouldUseNativeValidation: false,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleValidatedSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>행사 제목</FormLabel>
              <FormControl>
                <Input placeholder="예: 입실렌티" {...field} />
              </FormControl>
              <FormMessage>{fieldState.error?.message}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="organization"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>주관 기관</FormLabel>
              <FormControl>
                <Input placeholder="예: 고려대학교 응원단" {...field} />
              </FormControl>
              <FormMessage>{fieldState.error?.message}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>행사 종류 (복수 선택 가능)</FormLabel>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    "축제",
                    "강연",
                    "설명회",
                    "박람회",
                    "공모전",
                    "대회",
                    "교육",
                    "취업·창업",
                  ] as const
                ).map((tag) => (
                  <label
                    key={tag}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={field.value?.includes(tag) || false}
                      onChange={(e) => {
                        const currentTags = field.value || [];
                        if (e.target.checked) {
                          field.onChange([...currentTags, tag]);
                        } else {
                          field.onChange(currentTags.filter((t) => t !== tag));
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{tag}</span>
                  </label>
                ))}
              </div>
              <FormMessage>{fieldState.error?.message}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>장소</FormLabel>
              <FormControl>
                <Input placeholder="예: 녹지운동장" {...field} />
              </FormControl>
              <FormMessage>{fieldState.error?.message}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startAt"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>행사 시작 일시</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage>{fieldState.error?.message}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endAt"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>행사 종료 일시</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage>{fieldState.error?.message}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="registrationStartAt"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>신청 시작 일시 (선택)</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage>{fieldState.error?.message}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="registrationEndAt"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>신청 종료 일시 (선택)</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage>{fieldState.error?.message}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>내용</FormLabel>
              <FormControl>
                <Textarea
                  rows={5}
                  placeholder="행사 내용을 입력하세요"
                  {...field}
                />
              </FormControl>
              <FormMessage>{fieldState.error?.message}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="registrationUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>신청 링크 (선택)</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="thumbnailPath"
          render={({ field: { value, onChange, ...field }, fieldState }) => (
            <FormItem>
              <FormLabel>썸네일 이미지</FormLabel>
              {previewThumbnail && (
                <div className="mb-2 relative inline-block">
                  <img
                    src={previewThumbnail}
                    alt="기존 썸네일"
                    className="w-32 h-32 object-cover rounded border"
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-white/80 rounded-full px-2 py-0.5 text-xs border"
                    onClick={handleRemoveThumbnail}
                  >
                    삭제
                  </button>
                  <div className="text-xs text-gray-500">기존 썸네일</div>
                </div>
              )}
              <FormControl>
                <Input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={(e) => onChange(e.target.files)}
                  {...field}
                />
              </FormControl>
              <FormMessage>{fieldState.error?.message}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imagePaths"
          render={({ field: { value, onChange, ...field }, fieldState }) => (
            <FormItem>
              <FormLabel>상세 이미지 (선택, 최대 10개)</FormLabel>
              {detailImages.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-2">
                  {detailImages.map((item, idx) => (
                    <div
                      key={item.isNew ? `new-${idx}` : `old-${idx}`}
                      className="relative inline-block"
                    >
                      <img
                        src={item.url}
                        alt={
                          item.isNew
                            ? `새 이미지 ${idx + 1}`
                            : `기존 이미지 ${idx + 1}`
                        }
                        className="w-24 h-24 object-cover rounded border"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-white/80 rounded-full px-2 py-0.5 text-xs border"
                        onClick={() => handleRemoveDetailImage(idx)}
                      >
                        삭제
                      </button>
                      <div
                        className={`text-xs text-center ${item.isNew ? "text-blue-600" : "text-gray-500"}`}
                      >
                        {item.isNew ? "새 이미지" : "기존 이미지"}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <FormControl>
                <Input
                  type="file"
                  multiple
                  accept="image/png, image/jpeg"
                  onChange={(e) =>
                    handleFileAccumulation(e.target.files, onChange)
                  }
                  {...field}
                />
              </FormControl>

              {/* 파일 선택 도움말 */}
              <div className="text-sm text-gray-600 mt-1">
                💡 파일 선택 시 여러 번 클릭하여 이미지를 누적할 수 있습니다.
                (현재: {detailImages.length}/10개)
              </div>

              <FormMessage>{fieldState.error?.message}</FormMessage>
            </FormItem>
          )}
        />

        <Button type="submit">등록하기</Button>
      </form>
    </Form>
  );
}
