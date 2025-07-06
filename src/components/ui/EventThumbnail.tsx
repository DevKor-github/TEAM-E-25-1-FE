import heartRed from "@/assets/heart_red500.svg";
import heartGray from "@/assets/heart_gray.svg";

interface EventThumbnailProps {
  title: string;
  org: string;
  imageUrl: string; // 사용자 업로드 이미지 경로
  period: string;
  location: string;
  isLiked?: boolean;
}

export default function EventThumbnail({
  title,
  imageUrl,
  isLiked = false,
}: EventThumbnailProps) {
  return (
    <div className="flex flex-col w-[320px] rounded-2xl bg-white p-4 shadow-md">
      <div className="relative mb-2">
        <img
          src={imageUrl}
          alt={title}
          className="rounded-xl w-full h-[120px] object-cover"
        />
        <button className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center">
          <img
            src={isLiked ? heartRed : heartGray}
            alt="이벤트 타이틀"
            className="w-6 h-6"
          />
        </button>
      </div>
    </div>
  );
}
