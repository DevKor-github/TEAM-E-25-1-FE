import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

type Article = {
  id: string;
  title: string;
  organization: string;
  startAt: string;
  endAt: string;
  location: string;
  thumbnail_path?: string;
  description?: string;
};

const sampleArticles: Article[] = [
  {
    id: "1",
    title: "고려대학교 120주년 기념 행사",
    organization: "고려대학교",
    startAt: "2025-05-05T10:00:00Z",
    endAt: "2025-05-05T17:00:00Z",
    location: "고려대학교 중앙광장",
    description: "고려대학교 개교 120주년을 맞이하여 진행되는 특별한 기념 행사입니다. 다양한 문화 행사와 기념식이 준비되어 있습니다.",
  },
  {
    id: "2",
    title: "2024 고려대학교 입실렌티",
    organization: "고려대학교 총학생회",
    startAt: "2024-03-23T18:00:00Z",
    endAt: "2024-03-23T22:00:00Z",
    location: "고려대학교 화정체육관",
    description: "새로운 학기의 시작을 알리는 고려대학교의 대표적인 축제, 입실렌티에 여러분을 초대합니다.",
  },
  {
    id: "3",
    title: "2024 고려대학교 대동제",
    organization: "고려대학교 총학생회",
    startAt: "2024-05-20T10:00:00Z",
    endAt: "2024-05-22T22:00:00Z",
    location: "고려대학교 전역",
    description: "봄의 절정을 맞이하여 진행되는 고려대학교의 대표 축제입니다. 다양한 부스와 공연이 준비되어 있습니다.",
  }
];

export default function AdminHome() {
  const [articles, setArticles] = useState<Article[]>(sampleArticles);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="py-8">
      <div className="bg-white rounded-lg shadow mb-6">
        {articles && articles.length > 0 ? (
          articles.map((article) => (
            <div
              key={article.id}
              onClick={() => navigate(`/admin/article/${article.id}`)}
              className="flex items-center px-6 py-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
            >
              <div className="flex-1">
                <div className="text-sm text-gray-500 mb-1">
                  {new Date(article.startAt).toLocaleDateString()}
                </div>
                <div className="font-semibold text-lg mb-1">{article.title}</div>
                <div className="text-sm text-gray-600">{article.organization}</div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/admin/article/${article.id}/edit`);
                }}
                className="mr-2"
              >
                수정
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/admin/article/${article.id}`);
                }}
              >
                상세
              </Button>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-gray-500">
            등록된 행사가 없습니다.
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <Button 
          onClick={() => navigate("/article/upload")}
          className="bg-black text-white px-6 py-2 rounded-full"
        >
          + 행사 등록
        </Button>
      </div>
    </div>
  );
}
