import EventTypeIndicator from "./EventTypeIndicator";
import EventDateIndicator from "./EventDateIndicator";
import heartRed from "@/assets/heart_red500.svg";
import heartGray from "@/assets/heart_gray.svg";

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
}

export default function EventCard({
  title,
  organization,
  thumbnailPath,
  scrapCount,
  tags,
  startAt,
  endAt,
  isScrapped,
  onToggleScrap,
}: EventCardProps) {
  // dday 계산 (타임존 이슈 없이 날짜만 비교, 한국시간 기준, startAt 유효성 체크)
  let diff: number | undefined = undefined;
  const isValidStart = !!startAt && !isNaN(new Date(startAt).getTime());
  if (isValidStart) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(startAt);
    start.setHours(0, 0, 0, 0);
    diff = Math.ceil(
      (start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
  }
  // tags: 배열
  const safeTags = Array.isArray(tags) ? tags : [];
  // date, period (startAt, endAt이 undefined일 때 안전 처리)
  const safeStartAt = startAt ?? "";
  const safeEndAt = endAt ?? "";
  const date =
    safeStartAt && safeEndAt
      ? `${safeStartAt.split("T")[0]} ~ ${safeEndAt.split("T")[0]}`
      : "";
  const likeCount = scrapCount;
  
  // 썸네일 이미지 URL 처리
  const getImageUrl = (path: string) => {
    console.log(`EventCard 썸네일 경로: "${path}"`);
    if (!path) {
      console.log("썸네일 경로가 비어있음, 기본 이미지 사용");
      return "/eventThumbnail.png"; // 기본 이미지
    }
    console.log(`최종 이미지 URL: "${path}"`);
    return path; // 백엔드에서 전체 URL을 반환한다고 가정
  };
  
  const imageUrl = getImageUrl(thumbnailPath);
  const org = organization;

  // 이미지 로드 에러 처리
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.log(`이미지 로드 실패: ${imageUrl}, 기본 이미지로 대체`);
    e.currentTarget.src = "/eventThumbnail.png";
  };

  return (
    <div className="flex flex-col w-[335px] rounded-2xl bg-white p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
      <div className="relative mb-2">
        <img
          src={imageUrl}
          alt={`${title} 썸네일`}
          className="rounded-xl w-full h-[120px] object-cover pointer-events-none"
          onError={handleImageError}
        />
        <button
          className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center z-10"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log(`EventCard 하트 버튼 클릭: ${title}`);
            onToggleScrap && onToggleScrap();
          }}
        >
          <img
            src={isScrapped ? heartRed : heartGray}
            alt="like"
            className="w-7 h-7"
          />
        </button>
      </div>
      <div className="text-xs font-medium text-[#B0A8C6] mb-1 leading-[18px]">
        {org}
      </div>
      <div className="font-pretendard font-semibold text-[17px] leading-[24px] text-gray800 mb-1 overflow-hidden text-ellipsis whitespace-nowrap">
        {title}
      </div>
      <div className="font-pretendard text-[16px] leading-[22px] text-gray-500 font-normal mb-3">
        {date}
      </div>
      <div className="flex gap-2 items-center mb-2">
        {safeTags.map((tag) => (
          <EventTypeIndicator key={tag} type={tag} />
        ))}
        <EventDateIndicator dday={diff} />
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