import { http, HttpResponse } from 'msw'
import { z } from 'zod'

// Article schema for validation
export const articleSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "제목은 필수입니다").max(100),
  organization: z.string().min(1, "기관을 입력해주세요").max(100),
  startAt: z.string().datetime(),
  endAt: z.string().datetime(),
  location: z.string().min(1, "장소를 입력해주세요").max(100),
  description: z.string().min(1, "내용을 입력해주세요").max(10000),
  thumbnail_path: z.string().optional(),
  imagePaths: z.array(z.string()),
  tags: z.array(z.enum(["축제", "강연", "설명회", "박람회", "공모전", "대회"])),
  registrationUrl: z.string().url("올바른 링크 형식이 아닙니다").optional(),
  scrapCount: z.number(),
  viewCount: z.number()
})

// Mock data
const mockArticles = [
  {
    id: "1",
    title: "2025 고려대학교 입실렌티",
    organization: "고려대학교 총학생회",
    startAt: "2025-05-20T13:00:00.000Z",
    endAt: "2025-05-20T20:00:00.000Z",
    location: "고려대학교 화정체육관",
    description: "2025 고려대학교 대표 축제 입실렌티에 여러분을 초대합니다!",
    thumbnail_path: "https://example.com/thumbnail1.jpg",
    imagePaths: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
    tags: ["축제"],
    registrationUrl: "https://example.com/register",
    scrapCount: 150,
    viewCount: 1200
  },
  {
    id: "2",
    title: "2025 SW 개발자 채용설명회",
    organization: "DevKor",
    startAt: "2025-05-25T09:00:00.000Z",
    endAt: "2025-05-25T12:00:00.000Z",
    location: "우정정보관 63층",
    description: "소프트웨어 개발자를 꿈꾸는 학생들을 위한 채용설명회입니다.",
    thumbnail_path: "https://example.com/thumbnail2.jpg",
    imagePaths: ["https://example.com/image3.jpg"],
    tags: ["설명회"],
    registrationUrl: "https://example.com/register2",
    scrapCount: 75,
    viewCount: 500
  }
]

export const handlers = [
  // GET /article - 행사 목록 조회
  http.get('/article', () => {
    return HttpResponse.json(mockArticles)
  }),

  // GET /article/:id - 특정 행사 조회
  http.get('/article/:id', ({ params }) => {
    const article = mockArticles.find(a => a.id === params.id)
    if (!article) {
      return new HttpResponse(null, {
        status: 404,
        statusText: 'Not Found'
      })
    }
    return HttpResponse.json(article)
  }),

  // POST /article - 행사 등록
  http.post('/article', async ({ request }) => {
    try {
      const formData = await request.formData()
      const newArticle = {
        id: String(mockArticles.length + 1),
        title: formData.get('title') as string,
        organization: formData.get('organization') as string,
        startAt: formData.get('startAt') as string,
        endAt: formData.get('endAt') as string,
        location: formData.get('location') as string,
        description: formData.get('description') as string,
        thumbnail_path: formData.get('thumbnail_path') as string,
        imagePaths: (formData.getAll('imagePaths') as string[]) || [],
        tags: (formData.get('tags') as string).split(','),
        registrationUrl: formData.get('registrationUrl') as string,
        scrapCount: 0,
        viewCount: 0
      }
      
      // Validate with zod
      const validatedArticle = articleSchema.parse(newArticle)
      mockArticles.push(validatedArticle)
      
      return HttpResponse.json(validatedArticle, { status: 201 })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return new HttpResponse(JSON.stringify({ 
          message: "Validation failed", 
          errors: error.errors 
        }), { status: 400 })
      }
      return new HttpResponse(null, { status: 500 })
    }
  }),

  // PATCH /article/:id - 행사 수정
  http.patch('/article/:id', async ({ params, request }) => {
    try {
      const article = mockArticles.find(a => a.id === params.id)
      if (!article) {
        return new HttpResponse(null, { status: 404 })
      }

      const formData = await request.formData()
      const updatedArticle = {
        ...article,
        title: formData.get('title') as string || article.title,
        organization: formData.get('organization') as string || article.organization,
        startAt: formData.get('startAt') as string || article.startAt,
        endAt: formData.get('endAt') as string || article.endAt,
        location: formData.get('location') as string || article.location,
        description: formData.get('description') as string || article.description,
        thumbnail_path: formData.get('thumbnail_path') as string || article.thumbnail_path,
        imagePaths: (formData.getAll('imagePaths') as string[]) || article.imagePaths,
        tags: formData.get('tags') ? (formData.get('tags') as string).split(',') : article.tags,
        registrationUrl: formData.get('registrationUrl') as string || article.registrationUrl,
      }

      // Validate with zod
      const validatedArticle = articleSchema.parse(updatedArticle)
      const index = mockArticles.findIndex(a => a.id === params.id)
      mockArticles[index] = validatedArticle

      return HttpResponse.json(validatedArticle)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return new HttpResponse(JSON.stringify({ 
          message: "Validation failed", 
          errors: error.errors 
        }), { status: 400 })
      }
      return new HttpResponse(null, { status: 500 })
    }
  }),

  // DELETE /article/:id - 행사 삭제
  http.delete('/article/:id', ({ params }) => {
    const index = mockArticles.findIndex(a => a.id === params.id)
    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    
    mockArticles.splice(index, 1)
    return new HttpResponse(null, { status: 204 })
  })
]
