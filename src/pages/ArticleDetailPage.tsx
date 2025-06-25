import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "@/lib/axios";
import { LoadingPlaceholder } from "@/components/LoadingPlaceholder";

type Article = {
  id: string;
  title: string;
  organization: string;
  startAt: string;
  endAt: string;
  location: string;
  description: string;
  thumbnail_path?: string;
  imagePaths: string[];
  tags: string[];
  registrationUrl?: string;
};

export default function ArticleDetailPage() {
  const { articleId } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/article/${articleId}`);
        setArticle(data);
        setError(null);      
      } catch (err: any) {
        console.error('API Error:', err);
        if (err.response?.status === 404) {
          setError("해당 행사를 찾을 수 없습니다.");
        } else if (!navigator.onLine) {
          setError("인터넷 연결을 확인해주세요.");
        } else {
          setError(err.response?.data?.message || "행사 정보를 불러오는 중 오류가 발생했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  if (loading) return (
    <div className="max-w-4xl mx-auto p-6">
      <LoadingPlaceholder />
    </div>
  );
  
  if (error) return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
        {error}
      </div>
    </div>
  );
  
  if (!article) return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold text-gray-600">행사를 찾을 수 없습니다.</h2>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        {article.thumbnail_path && (
          <img
            src={article.thumbnail_path}
            alt={article.title}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
        )}
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">
            {article.title}
          </h1>
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="space-y-2 text-gray-600">
            <p className="flex items-center gap-2">
              <span className="font-semibold">주관</span>
              <span>{article.organization}</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="font-semibold">장소</span>
              <span>{article.location}</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="font-semibold">일시</span>
              <span>
                {new Date(article.startAt).toLocaleString()} ~ {new Date(article.endAt).toLocaleString()}
              </span>
            </p>
          </div>
        </div>
        
        <div className="prose max-w-none mb-6">
          <h2 className="text-xl font-semibold mb-3">행사 설명</h2>
          <div className="whitespace-pre-line text-gray-700">
            {article.description}
          </div>
        </div>
        
        {article.registrationUrl && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">신청 링크</h2>
            <a
              href={article.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all"
            >
              {article.registrationUrl}
            </a>
          </div>
        )}

        {article.imagePaths && article.imagePaths.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-3">상세 이미지</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {article.imagePaths.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`상세 이미지 ${index + 1}`}
                  className="w-full h-auto rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
