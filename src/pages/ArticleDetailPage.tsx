import { useRef } from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "@/lib/axios";
import { LoadingPlaceholder } from "@/components/LoadingPlaceholder";
import HeaderFrame from "@/components/HeaderFrame";
import EventTypeIndicator from "@/components/ui/EventTypeIndicator";
import type { EventType } from "@/components/ui/EventTypeIndicator";
import EventCard from "@/components/ui/EventCard";
import TabbedControl from "@/components/ui/tabbedControl";
import EventDateIndicator from "@/components/ui/EventDateIndicator";
import EventImage from "@/components/ui/EventImage";
import { Button } from "@/components/ui/buttons";
import { BottomButtonsCombo3 } from "@components/ui/bottomButtonsCombo";
import closeIcon from "../assets/closeIcon.svg";

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
  scrapCount: number;
  viewCount: number;
};

const dummyArticle: Article = {
  id: "1",
  title:
    "[Flagsmith 세미나] 버튼 하나로 실험하는 방법 : AB 테스트를 위한 새로운 접근법",
  organization: "더미 주관 기관",
  startAt: "2025-05-26T18:00:00Z",
  endAt: "2025-05-27T19:00:00Z",
  location: "서울 마포구 마포대로 122 디캠프 마포",
  description:
    "사업 방향성 설정과 성장에 필요한 전문 멘토링 dcamp officehour 5월 모집 오픈!!",
  thumbnail_path: "/eventThumbnail.png",
  imagePaths: ["/detailImage.png", "/eventThumbnail.png", "/detailImage.png"],
  tags: ["설명회"],
  registrationUrl: "https://www.naver.com/",
  scrapCount: 999,
  viewCount: 150,
};

function formatDate(start: string, end: string) {
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const startDate = new Date(start);
  const endDate = new Date(end);

  const startStr = `${startDate.getFullYear()}년 ${startDate.getMonth() + 1}월 ${startDate.getDate()}일 (${days[startDate.getDay()]}) ${startDate.getHours().toString().padStart(2, "0")}:${startDate.getMinutes().toString().padStart(2, "0")}`;
  const endStr = `${endDate.getMonth() + 1}월 ${endDate.getDate()}일 (${days[endDate.getDay()]}) ${endDate.getHours().toString().padStart(2, "0")}:${endDate.getMinutes().toString().padStart(2, "0")}`;

  return `${startStr} ~ ${endStr}`;
}

export default function ArticleDetailPage() {
  const { articleId } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [modalIndex, setModalIndex] = useState<number>(0);

  const TAB_HEIGHT = 40; // sticky tabbed control의 height(px)
  const datePlaceRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (tabId: string) => {
    let ref = null;
    if (tabId === "tab1") ref = datePlaceRef;
    if (tabId === "tab2") ref = imageRef;
    if (tabId === "tab3") ref = descRef;

    if (ref && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const targetY = scrollTop + rect.top - TAB_HEIGHT;
      window.scrollTo({ top: targetY, behavior: "smooth" });
    }
  };

  const handleImageClick = (src: string, idx: number) => {
    setModalImage(src);
    setModalIndex(idx);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setModalImage(null);
  };

  useEffect(() => {
    // const fetchArticle = async () => {
    //   try {
    //     setLoading(true);
    //     const { data } = await api.get(`/article/${articleId}`);
    //     setArticle(data);
    //     setError(null);
    //   } catch (err: any) {
    //     console.error("API Error:", err);
    //     if (err.response?.status === 404) {
    //       setError("해당 행사를 찾을 수 없습니다.");
    //     } else if (!navigator.onLine) {
    //       setError("인터넷 연결을 확인해주세요.");
    //     } else {
    //       setError(
    //         err.response?.data?.message ||
    //           "행사 정보를 불러오는 중 오류가 발생했습니다."
    //       );
    //     }
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    // fetchArticle();

    // API 연동 전 더미 데이터로 테스트
    setTimeout(() => {
      setArticle(dummyArticle);
      setLoading(false);
    }, 500);
  }, [articleId]);

  if (loading)
    return (
      <div className="max-w-4xl mx-auto p-6">
        <LoadingPlaceholder />
      </div>
    );

  if (error)
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );

  if (!article)
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-gray-600">
            행사를 찾을 수 없습니다.
          </h2>
        </div>
      </div>
    );

  return (
    // 전체 프레임
    <div className="w-[375px] mx-auto bg-white">
      <HeaderFrame />

      {/* Eventcard 컴포넌트 추가해야 함*/}
      <div className="flex flex-col pt-5 pr-5 pb-2 pl-5 gap-5">
        {article.thumbnail_path && (
          <img src={article.thumbnail_path} alt="썸네일 이미지" />
        )}

        <div className="font-semibold text-title4 text-gray-800 font-pretendard">
          {article.title}
        </div>

        {/* <div>
          <EventCard
            title="이벤트 타이틀"
            date="9월 25일 (수)"
            type={article.tags as EventType[]}
            dday={117}
            isLiked={true}
            likeCount={999}
            imageUrl={"/assets/event_thumbnail_image.png"}
          />
        </div> */}
      </div>

      {!modalOpen && (
        <div className="sticky top-0 z-20 bg-white border-b border-solid border-gray-200 pt-3 px-4 gap-2.5">
          <TabbedControl
            tabs={[
              { label: "행사 일시 ∙ 장소", id: "tab1" },
              {
                label: "행사 이미지",
                id: "tab2",
                numbering: article.imagePaths.length,
              },
              { label: "행사 소개", id: "tab3" },
            ]}
            onTabChange={handleTabChange}
          />
        </div>
      )}

      <div
        ref={datePlaceRef}
        className="flex flex-col pt-8 pr-5 pb-4 pl-5 gap-1"
      >
        <div className="font-medium text-body3 text-gray-500 font-pretendard">
          행사 일시
        </div>
        <div className="font-normal text-body1 text-gray-800 font-pretendard">
          {formatDate(article.startAt, article.endAt)}
        </div>
        <div>
          <EventDateIndicator status="ongoing" />
        </div>
      </div>

      <div className="flex flex-col pt-4 pr-5 pb-4 pl-5 gap-1">
        <div className="font-medium text-body3 text-gray-500 font-pretendard">
          행사 장소
        </div>
        <div className="font-normal text-body1 text-gray-800 font-pretendard">
          {article.location}
        </div>
        <div>
          <Button
            styleType="gray"
            size="md"
            onClick={() => {
              navigator.clipboard.writeText(article.location);
            }}
          >
            주소 복사
          </Button>
        </div>
      </div>

      <div ref={imageRef} className="flex flex-col pt-4 pr-5 pb-4 pl-5 gap-3">
        <div className="font-medium text-body3 text-gray-500 font-pretendard">
          행사 이미지 ({article.imagePaths.length})
        </div>
        <div className="flex flex-row gap-4 overflow-x-auto">
          {article.imagePaths.map((src, index) => (
            <div
              key={index}
              onClick={() => handleImageClick(src, index)}
              className="cursor-pointer flex-shrink-0 w-[160px]"
            >
              <EventImage src={src} alt={`행사 이미지 ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>

      {/* 상세이미지 모달 */}
      {modalOpen && modalImage && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="relative bg-white overflow-y-scroll scrollbar-hide w-[375px] h-screen flex flex-col items-center">
            {/* 상단 바: 닫기 버튼 + 인덱스 */}
            <div className="relative flex items-center w-[375px] h-[60px] min-h-[60px] pt-[10px] pr-[20px] pb-[10px] pl-[20px] gap-[10px]">
              <img
                className="cursor-pointer"
                onClick={handleModalClose}
                src={closeIcon}
                alt="닫기"
              />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-normal text-body1 text-gray-700 font-pretendard">
                {modalIndex + 1} / {article.imagePaths.length}
              </div>
            </div>

            {/* Image Section */}
            <div className="flex flex-col w-[375px] h-fit gap-[28px] mt-[121px] mb-[180px]">
              <div className="flex-1 flex items-center justify-center w-full">
                <img src={modalImage} alt={`행사 이미지 ${modalIndex + 1}`} />
              </div>

              {/* 하단 화살표 버튼 */}
              <div className="flex flex-row w-full pb-8">
                {/* 왼쪽 영역 */}
                <div className="flex-1 flex justify-center">
                  <Button
                    buttonType="symbol"
                    styleType="gray"
                    iconType="chevronLeft"
                    onClick={() => {
                      if (modalIndex > 0) {
                        setModalImage(article.imagePaths[modalIndex - 1]);
                        setModalIndex(modalIndex - 1);
                      }
                    }}
                  />
                </div>
                {/* 오른쪽 영역 */}
                <div className="flex-1 flex justify-center">
                  <Button
                    buttonType="symbol"
                    styleType="gray"
                    iconType="chevronRight"
                    onClick={() => {
                      if (modalIndex < article.imagePaths.length - 1) {
                        setModalImage(article.imagePaths[modalIndex + 1]);
                        setModalIndex(modalIndex + 1);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div ref={descRef} className="pt-8 pr-5 pb-10 pl-5 gap-2.5">
        <div className="font-normal text-body1 text-gray-800 font-pretendard">
          {article.description}
        </div>
      </div>

      <div>
        <BottomButtonsCombo3
          onShareClick={() => {
            navigator.clipboard.writeText(window.location.href);
          }}
          label="신청하기"
          labelDisabled={!article.registrationUrl}
          onLabelClick={() => {
            window.open(article.registrationUrl, "_blank");
          }}
        />
      </div>
    </div>
  );
}
