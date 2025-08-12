import { useRef } from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/axios";
import HeaderFrame from "@/components/HeaderFrame";
import EventTypeIndicator from "@/components/ui/EventTypeIndicator";
import TabbedControl from "@/components/ui/tabbedControl";
import Toast from "@/components/ui/toast";
import EventDateIndicator from "@/components/ui/EventDateIndicator";
import EventImage from "@/components/ui/EventImage";
import { Button } from "@/components/ui/buttons";
import { BottomButtonsCombo3 } from "@components/ui/bottomButtonsCombo";
import closeIcon from "../assets/closeIcon.svg";
import heartGray from "@/assets/heart_gray.svg";
import copyIcon from "@/assets/copyIcon.svg";

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
  imagePaths?: string[];
  registrationUrl?: string;
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
  const navigate = useNavigate();
  const { articleId } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [isScrapped, setIsScrapped] = useState<boolean | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [modalIndex, setModalIndex] = useState<number>(0);

  const TAB_HEIGHT = 40; // sticky tabbed control의 height(px)
  const datePlaceRef = useRef<HTMLDivElement>(null);
  const orgRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (tabId: string) => {
    let ref = null;
    if (tabId === "tab1") ref = datePlaceRef;
    if (tabId === "tab2") ref = orgRef;
    if (tabId === "tab3") ref = imageRef;
    if (tabId === "tab4") ref = descRef;

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

  // 스크랩 여부 가져오는 함수
  const fetchScrapStatus = async () => {
    if (!articleId) return;

    try {
      const res = await api.get(`/scrap/article/${articleId}`);
      setIsScrapped(res.data.isScrapped);
    } catch (err: any) {
      setIsScrapped(false);
      if (err.response?.status === 401) {
        // 비로그인 상태이므로 스크랩 여부를 알 수 없는 게 정상
        return;
      } else {
        alert("스크랩 상태를 불러오는 중 오류가 발생했습니다.");
      }
    }
  };

  // article 데이터 가져오기
  useEffect(() => {
    if (!articleId) return;

    const fetchArticle = async () => {
      try {
        setLoading(true);

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
          alert("해당 행사를 찾을 수 없습니다.");
        } else {
          alert("행사 정보를 불러오는 중 오류가 발생했습니다.");
        }
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  useEffect(() => {
    fetchScrapStatus();
  }, [articleId]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-100">
        <div className="w-full max-w-[460px] mx-auto bg-white min-h-screen">
          <HeaderFrame />
          <div className="flex items-center justify-center py-8 text-lg text-gray-500">
            로딩 중...
          </div>
        </div>
      </div>
    );
  }

  if (!article)
    return (
      <div className="w-full min-h-screen bg-gray-100">
        <div className="w-full max-w-[460px] mx-auto bg-white min-h-screen">
          <HeaderFrame />
          <div className="flex items-center justify-center py-8 text-lg text-gray-500">
            해당 행사를 찾을 수 없습니다.
          </div>
        </div>
      </div>
    );

  return (
    // 바깥 프레임
    <div className="w-full min-h-screen bg-gray-100">
      {/* 중앙 컨텐츠 프레임 */}
      <div className="w-full max-w-[460px] mx-auto bg-white min-h-screen">
        <HeaderFrame />

        <div className="flex flex-col w-full pt-5 pr-5 pb-2 pl-5 gap-5">
          <img
            src={article.thumbnailPath}
            alt="썸네일 이미지"
            className="w-full aspect-video object-cover rounded-lg border border-gray-200 flex flex-col gap-[10px]"
          />

          <div className="flex flex-col w-full h-[94px] gap-3">
            <div className="w-full h-full font-semibold text-title4 text-gray-800 font-pretendard">
              {article.title}
            </div>
            <div className="flex flex-row w-full h-[26px]">
              <div className="flex flex-row w-fit gap-2">
                {article.tags.map((tag) => (
                  <EventTypeIndicator key={tag} type={tag} />
                ))}
              </div>
              <div className="flex flex-row ml-auto gap-3">
                <div className="font-normal text-body3 text-gray-500 font-pretendard">
                  조회 {article.viewCount}
                </div>
                <div className="flex flex-row gap-1">
                  <img src={heartGray} alt="like-count" className="w-5 h-5" />
                  <div className="font-normal text-body3 text-gray-500 font-pretendard">
                    {article.scrapCount > 999 ? "999+" : article.scrapCount}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 탭 컨트롤 */}
        {!modalOpen && (
          <div className="sticky top-0 z-20 bg-white flex flex-col w-full border-b border-solid border-gray-200 pt-3 px-4 gap-2.5">
            <TabbedControl
              tabs={[
                { label: "행사 일시 ∙ 장소", id: "tab1" },
                { label: "행사 주최기관", id: "tab2" },
                {
                  label: "행사 이미지",
                  id: "tab3",
                  numbering: article.imagePaths?.length ?? 0,
                },
                { label: "행사 소개", id: "tab4" },
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
            <EventDateIndicator
              startAt={article.startAt}
              endAt={article.endAt}
            />
          </div>
        </div>
        <div className="flex flex-col pt-4 pr-5 pb-4 pl-5 gap-1">
          <div className="flex flex-row gap-1">
            <div className="font-medium text-body3 text-gray-500 font-pretendard">
              행사 장소
            </div>
            <img
              src={copyIcon}
              alt="copy"
              className="w-5 h-5 cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(article.location);
                setToastMessage("장소가 복사되었습니다");
                setTimeout(() => setToastMessage(null), 2000);
              }}
            />
          </div>
          <div className="font-normal text-body1 text-gray-800 font-pretendard">
            {article.location}
          </div>
        </div>
        <div ref={orgRef} className="flex flex-col pt-4 pr-5 pb-4 pl-5 gap-1">
          <div className="font-medium text-body3 text-gray-500 font-pretendard">
            행사 주최기관
          </div>
          <div className="font-normal text-body1 text-gray-800 font-pretendard">
            {article.organization}
          </div>
        </div>
        <div ref={imageRef} className="flex flex-col pt-4 pr-5 pb-4 pl-5 gap-3">
          <div className="font-medium text-body3 text-gray-500 font-pretendard">
            행사 이미지 ({article.imagePaths?.length ?? 0})
          </div>
          {article.imagePaths && article.imagePaths.length > 0 ? (
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
          ) : (
            <div className="font-normal text-body1 text-gray-800 font-pretendard">
              이미지가 없습니다.
            </div>
          )}
        </div>

        {/* 상세이미지 모달 */}
        {modalOpen && modalImage && (
          <div className="min-h-[100vh] fixed inset-0 bg-gray-100 flex items-center justify-center">
            <div className="relative bg-white overflow-y-scroll scrollbar-hide w-full max-w-[460px] h-screen flex flex-col items-center">
              {/* 상단 바: 닫기 버튼 + 인덱스 */}
              <div className="relative flex items-center w-full h-[60px] min-h-[60px] pt-[10px] pr-[20px] pb-[10px] pl-[20px] gap-[10px]">
                <img
                  className="cursor-pointer"
                  onClick={handleModalClose}
                  src={closeIcon}
                  alt="닫기"
                />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-normal text-body1 text-gray-700 font-pretendard">
                  {modalIndex + 1} / {article.imagePaths?.length}
                </div>
              </div>

              {/* Image Section */}
              <div className="flex flex-col w-full h-fit gap-[28px] mt-[121px] mb-[180px]">
                <img
                  src={modalImage}
                  alt={`행사 이미지 ${modalIndex + 1}`}
                  className="flex-1 flex items-center justify-center w-full"
                />

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
                          setModalImage(
                            article.imagePaths?.[modalIndex - 1] ?? null
                          );
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
                        if (
                          article.imagePaths &&
                          modalIndex < article.imagePaths.length - 1
                        ) {
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
          <div className="whitespace-pre-line break-words font-normal text-body1 text-gray-800 font-pretendard">
            {article.description}
          </div>
        </div>
        <div>
          <BottomButtonsCombo3
            onShareClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setToastMessage("공유링크가 복사되었습니다");
              setTimeout(() => setToastMessage(null), 2000);
            }}
            label="바로가기"
            labelDisabled={!article.registrationUrl}
            onLabelClick={() => {
              if (!article.registrationUrl) return;
              const url =
                article.registrationUrl.startsWith("http://") ||
                article.registrationUrl.startsWith("https://")
                  ? article.registrationUrl
                  : `https://${article.registrationUrl}`;
              window.open(url, "_blank");
            }}
            heartScrapped={isScrapped ?? false} // isScrapped 값이 올 때까지 false로 처리
            onHeartClick={async () => {
              if (!articleId || !article) return;

              try {
                if (isScrapped) {
                  await api.delete(`/scrap/${articleId}`);
                  setIsScrapped(false);
                  setArticle({
                    ...article,
                    // 스크랩 취소할 때 scrapCount가 음수가 되지 않도록 안전하게 처리
                    scrapCount: Math.max(0, article.scrapCount - 1),
                  });
                } else {
                  await api.post(`/scrap/${articleId}`);
                  setIsScrapped(true);
                  setArticle({
                    ...article,
                    scrapCount: article.scrapCount + 1,
                  });
                }
              } catch (err: any) {
                if (err.response?.status === 401) {
                  navigate("/login");
                } else if (err.response?.status === 404) {
                  alert("해당 행사가 존재하지 않습니다.");
                } else {
                  alert("스크랩 처리 중 오류가 발생했습니다.");
                }
              }
            }}
          />
        </div>

        {/* Toast 메시지 띄우기 */}
        {toastMessage && (
          <div className="w-screen flex justify-center max-w-[300px] fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            <Toast message={toastMessage} />
          </div>
        )}
      </div>
    </div>
  );
}
