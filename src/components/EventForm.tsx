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

const eventFormSchema = z.object({
  title: z.string().min(1, "제목은 필수입니다").max(100),
  organization: z.string().min(1, "기관을 입력해주세요").max(100),
  event_type: z.enum(["축제", "강연", "설명회", "박람회", "공모전", "대회"], {
    required_error: "행사 종류를 선택해주세요",
  }),
  location: z.string().min(1, "장소를 입력해주세요").max(100),
  start_datetime: z.string().min(1, "시작 일시를 선택해주세요"),
  end_datetime: z.string().min(1, "종료 일시를 선택해주세요"),
  content: z.string().min(1, "내용을 입력해주세요").max(10000),
  link: z.string().url("올바른 링크 형식이 아닙니다").optional(),
  thumbnail_image: z
    .any()
    .refine((file) => file?.length === 1, "썸네일 이미지를 첨부해주세요")
    .refine((file) => file?.[0]?.size <= 5 * 1024 * 1024, "파일 크기는 5MB 이하여야 합니다")
    .refine(
      (file) => ["image/jpeg", "image/png"].includes(file?.[0]?.type),
      "jpg 또는 png 파일만 업로드 가능합니다"
    ),
  detail_image: z
    .any()
    .refine(
      (files) =>
        !files ||
        files.length === 0 ||
        (files.length <= 10 &&
          Array.from(files).every(
            (f: File) =>
              ["image/jpeg", "image/png"].includes(f.type) && f.size <= 5 * 1024 * 1024
          )),
      "상세 이미지는 최대 10개까지, jpg/png 형식, 각 5MB 이하만 허용됩니다"
    )
    .optional(),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

export function EventForm({
  onSubmit,
  defaultValues,
}: {
  onSubmit: (values: EventFormValues) => void;
  defaultValues?: Partial<EventFormValues>;
}) {
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>행사 제목</FormLabel>
              <FormControl>
                <Input placeholder="예: 고려대 입실렌티" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="organization"
          render={({ field }) => (
            <FormItem>
              <FormLabel>주관 기관</FormLabel>
              <FormControl>
                <Input placeholder="예: 총학생회" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="event_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>행사 종류</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="태그를 선택하세요" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {["축제", "강연", "설명회", "박람회", "공모전", "대회"].map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>장소</FormLabel>
              <FormControl>
                <Input placeholder="예: 백주년기념관 대강당" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="start_datetime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>시작 일시</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="end_datetime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>종료 일시</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>내용</FormLabel>
              <FormControl>
                <Textarea rows={5} placeholder="행사 내용을 입력하세요" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="link"
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
          name="thumbnail_image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>썸네일 이미지</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={(e) => field.onChange(e.target.files)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="detail_image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>상세 이미지 (선택, 최대 10개)</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  multiple
                  accept="image/png, image/jpeg"
                  onChange={(e) => field.onChange(e.target.files)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">등록하기</Button>
      </form>
    </Form>
  );
}
