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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png"];

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

    tags: z.array(
      z.enum(["축제", "강연", "설명회", "박람회", "공모전", "대회"]),
      {
        required_error: "행사 종류를 선택해주세요.",
      }
    ),

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

    description: z
      .string()
      .max(10000, { message: "내용은 10000자를 초과할 수 없습니다." })
      .optional(),

    registrationUrl: z.string().optional(),

    thumbnailPath: z
      .custom<FileList>()
      .refine((files) => files?.length === 1, "썸네일 이미지를 첨부해주세요.")
      .refine(
        (files) => files?.[0]?.size <= MAX_FILE_SIZE,
        "파일 크기는 5MB 이하여야 합니다."
      )
      .refine(
        (files) => ALLOWED_FILE_TYPES.includes(files?.[0]?.type),
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
  );

export type ArticleFormValues = z.infer<typeof articleFormSchema>;

export function ArticleForm({
  onSubmit,
  defaultValues,
}: {
  onSubmit: (values: ArticleFormValues) => void;
  defaultValues?: Partial<ArticleFormValues>;
}) {
  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      organization: defaultValues?.organization ?? "",
      tags: defaultValues?.tags ?? [],
      location: defaultValues?.location ?? "",
      startAt: defaultValues?.startAt ?? "",
      endAt: defaultValues?.endAt ?? "",
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              <FormLabel>행사 종류</FormLabel>
              <Select
                value={field.value?.[0] || ""}
                onValueChange={(val) => field.onChange([val])}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="태그를 선택하세요" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {["축제", "강연", "설명회", "박람회", "공모전", "대회"].map(
                    (tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
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
              <FormLabel>시작 일시</FormLabel>
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
              <FormLabel>종료 일시</FormLabel>
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
              <FormControl>
                <Input
                  type="file"
                  multiple
                  accept="image/png, image/jpeg"
                  onChange={(e) => onChange(e.target.files)}
                  {...field}
                />
              </FormControl>
              <FormMessage>{fieldState.error?.message}</FormMessage>
            </FormItem>
          )}
        />

        <Button type="submit">등록하기</Button>
      </form>
    </Form>
  );
}
