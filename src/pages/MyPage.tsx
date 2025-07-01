import HeaderFrame from "@/components/HeaderFrame";
import { Button } from "@/components/ui/buttons";

export default function MyPage() {
  return (
    <div className="relative w-[375px] mx-auto bg-white">
      <HeaderFrame />

      <div className="absolute top-[80px] left-[20px] w-[100px] h-[32px] font-semibold text-title3 font-pretendard">
        마이페이지
      </div>

      <div className="absolute top-[132px] left-[20px] w-[335px] rounded-[12px] border border-gray-200 px-[16px] py-[12px] flex flex-col gap-[12px]">
        <div className="w-full flex flex-col gap-[4px]">
          <div className="w-full font-medium text-body3 text-gray-500 font-pretendard">
            로그인 방식
          </div>
          <div className="w-full font-normal text-body1 text-gray-800 font-pretendard">
            카카오톡 소셜로그인
          </div>
        </div>

        <div className="w-full h-[1px] bg-gray-200" />

        <div className="w-full flex flex-col gap-[4px]">
          <div className="w-full font-medium text-body3 text-gray-500 font-pretendard">
            카카오 연동 이메일
          </div>
          <div className="w-full font-normal text-body1 text-gray-800 font-pretendard">
            이메일
          </div>
        </div>
      </div>

      {/* 버튼 */}
      <div className="absolute top-[321px] left-[20px] flex flex-row gap-[12px]">
        <Button styleType="gray" size="md">
          로그아웃
        </Button>
        <Button styleType="destructive" size="md">
          회원탈퇴
        </Button>
      </div>
    </div>
  );
}
