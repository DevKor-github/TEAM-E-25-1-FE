import EventTypeIndicator from "./EventTypeIndicator";
import EventDateIndicator from "./EventDateIndicator";
import heartRed from "@/assets/heart_red500.svg";
import heartGray from "@/assets/heart_gray.svg";
import heartNothing from "@/assets/heart_nothing.svg";
export type Article = {
  id: string;
  title: string;
  organization: string;
  thumbnailPath: string;
  scrapCount: number;
  viewCount: number;
  tags: string[];
  description: string;
  location: string;
  startAt: string;
  endAt: string;
  imagePaths: string[];
  registrationUrl: string;
  isScrapped?: boolean; // 스크랩 여부 
};

interface EventCardProps extends Article {
  onToggleScrap?: () => void;
  onCardClick?: () => void; // 카드 클릭 핸들러 추가
}

export default function EventCard({
  title,
  thumbnailPath,
  scrapCount,
  tags,
  startAt,
  endAt,
  isScrapped,
  onToggleScrap,
  onCardClick,
}: EventCardProps) {
  // dday 계산 (백엔드 데이터가 있을 때만)
  let diff: number | undefined = undefined;
  let status: "upcoming" | "imminent" | "critical" | "ongoing" | "ended" = "upcoming";
  
  if (startAt) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const start = new Date(startAt);
      start.setHours(0, 0, 0, 0);
      diff = Math.ceil(
        (start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      // status 계산
      if (diff < 0) {
        status = "ended"; // 종료
      } else if (diff === 0) {
        status = "ongoing"; // 행사중 (당일)
      } else if (diff <= 3) {
        status = "critical"; // 매우 임박 (3일 이내, 경계선 있음)
      } else if (diff <= 7) {
        status = "imminent"; // 임박 (7일 이내, 경계선 없음)
      } else {
        status = "upcoming"; // 일반
      }
    } catch (e) {
      console.warn("Invalid startAt date:", startAt);
      diff = undefined;
    }
  }
  // tags: 배열
  const safeTags = Array.isArray(tags) ? tags : [];
  
  // 날짜 포맷팅 함수 (YYYY.MM.DD)
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}.${month}.${day}`;
    } catch (e) {
      return "";
    }
  };
  
  // 날짜 기간 포맷팅 - 백엔드 데이터가 있을 때만 표시
  let date = "";
  if (startAt && endAt) {
    const formattedStart = formatDate(startAt);
    const formattedEnd = formatDate(endAt);
    if (formattedStart && formattedEnd) {
      date = `${formattedStart} ~ ${formattedEnd}`;
    }
  }
  
  const likeCount = scrapCount;
  
  const imageUrl = thumbnailPath;

  return (
    <div 
      className="flex flex-col w-[335px] cursor-pointer"
      onClick={(e) => {
        // 하트 버튼 클릭이 아닌 경우에만 카드 클릭 이벤트 실행
        const target = e.target as HTMLElement;
        const isHeartButton = target.closest('button');
        if (!isHeartButton && onCardClick) {
          onCardClick();
        }
      }}
    >
      <div className="relative mb-2">
        <img
          src={imageUrl}
          alt={`${title} 썸네일`}
          className="rounded-xl w-full h-[188px] object-cover pointer-events-none"
          loading="lazy"
        />
        <button
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center z-10"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onToggleScrap) {
              onToggleScrap();
            }
          }}
        >
          <img
            src={isScrapped ? heartRed : heartNothing}
            alt="like"
            className="w-9 h-9"
          />
        </button>
      </div>
      <div className="font-pretendard font-semibold text-[17px] leading-[24px] text-gray800 mb-1 overflow-hidden text-ellipsis whitespace-nowrap">
        {title}
      </div>
      <div className="font-pretendard text-[16px] leading-[22px] text-gray-500 font-normal mb-3">
        {date || " "} {/* 백엔드 데이터가 없으면 빈 공간 */}
      </div>
      <div className="flex gap-2 items-center mb-2">
        {safeTags.map((tag) => (
          <EventTypeIndicator key={tag} type={tag} />
        ))}
        {diff !== undefined && <EventDateIndicator dday={diff} status={status} />} {/* D-day는 백엔드 데이터가 있을 때만 표시 */}
        <div className="flex items-center gap-1 ml-auto min-w-[52px] pr-1">
          <img src={heartGray} alt="like-count" className="w-5 h-5" />
          <span className="font-pretendard text-sm font-body-3 text-gray-500">
            {likeCount > 999 ? "999+" : likeCount}
          </span>
        </div>
      </div>
    </div>
  );
}