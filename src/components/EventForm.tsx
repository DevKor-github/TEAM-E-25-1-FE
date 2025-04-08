// src/components/EventForm.tsx

// 유효성 검사 스키마를 정의하기 위한 zod 임포트
import { z } from "zod"
// react-hook-form 관련 훅과 zod 연동 도구
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

// shadcn-ui에서 제공하는 Form 관련 UI 컴포넌트
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form"
import { Input } from "@components/ui/input"
import { Textarea } from "@components/ui/textarea"
import { Button } from "@components/ui/button"

// 유효성 검사 스키마 정의
const eventFormSchema = z.object({
  title: z.string().min(1, "제목은 필수입니다"),
  organization: z.string().min(1, "기관을 입력해주세요"),
  date: z.string().min(1, "일시를 선택해주세요"),
  content: z.string().min(1, "내용을 입력해주세요"),
  link: z.string().url("올바른 링크 형식이 아닙니다").optional(),
})

// 스키마로부터 타입 추론
type EventFormValues = z.infer<typeof eventFormSchema>

// 재사용 가능한 EventForm 컴포넌트
export function EventForm({
  onSubmit,
  defaultValues,
}: {
  onSubmit: (values: EventFormValues) => void
  defaultValues?: Partial<EventFormValues>
}) {
  // react-hook-form 초기 설정 (zod 유효성 검사 연결)
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: defaultValues || {},
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* 제목 입력 필드 */}
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

        {/* 주관 기관 입력 필드 */}
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

        {/* 일시 입력 필드 (datetime-local) */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>일시</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 행사 내용 입력 필드 */}
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

        {/* 신청 링크 입력 필드 (선택 사항) */}
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

        {/* 등록 버튼 */}
        <Button type="submit">등록하기</Button>
      </form>
    </Form>
  )
}
