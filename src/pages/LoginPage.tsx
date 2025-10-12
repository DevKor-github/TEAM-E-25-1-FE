import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/axios";
import { usePreviousPageStore } from "@/stores/previousPageStore";
import { trackButtonClicked, trackPageViewed } from "@/amplitude/track";

import chevronLeft from "../assets/chevronLeft.svg";
import logo from "../assets/logo.svg";
import KakaoLoginBtn from "@/components/ui/kakaoLoginBtn";

export default function LoginPage() {
  const navigate = useNavigate();

  // 로그인 상태 확인
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        await api.get("/user/me");
        // 로그인 상태면 메인으로 리다이렉트
        navigate("/", { replace: true });
      } catch (err: any) {
        return;
      }
    };

    checkLoginStatus();
  }, [navigate]);

  const previousPage = usePreviousPageStore((state) => state.previousPage);

  // 앰플리튜드 - 페이지 조회 트래킹
  useEffect(() => {
    trackPageViewed({
      pageName: "login_page",
      previousPage: previousPage,
    });
  }, [previousPage]);

  const handleKakaoLogin = () => {
    window.location.href = `${import.meta.env.VITE_BASE_URL}auth/oauth/authorization`;
    // 앰플리튜드 - 버튼 클릭 트래킹
    trackButtonClicked({
      buttonName: "start_with_kakao",
      pageName: "login_page",
    });
  };

  return (
    // 바깥 프레임
    <div className="w-full min-h-screen bg-gray-100">
      {/* 중앙 컨텐츠 프레임 */}
      <div className="relative w-full max-w-[460px] mx-auto bg-white min-h-screen">
        <div className="w-[375px] h-[60px] flex flex-row items-center px-[20px] py-[10px] gap-[10px]">
          <img
            src={chevronLeft}
            alt="이전으로 돌아가기"
            className="w-6 h-6 cursor-pointer"
            onClick={() => navigate(-1)}
          />
        </div>

        <div className="absolute top-[80px] left-[20px] w-[165px] h-[64px] font-semibold text-title3 font-pretendard">
          로그인이
          <br /> 필요한 기능이에요
        </div>

        <div className="absolute top-[184px] left-[58px] right-[58px] flex justify-center items-center max-w-[344px] h-[140px] rounded-[20px] py-[40px] gap-[10px] bg-gradient-to-b from-[#EFFAFF] to-[#DEF3FF]">
          <img src={logo} alt="univent logo" className="-[60px] h-[60px]" />
        </div>

        <div className="absolute w-full max-w-[460px] top-[364px] px-[20px]">
          <KakaoLoginBtn onClick={handleKakaoLogin} />
        </div>
      </div>
    </div>
  );
}
