import { useNavigate } from "react-router-dom";
import chevronLeft from "../assets/chevronLeft.svg";
import logo from "../assets/logo.svg";
import KakaoLoginBtn from "@/components/ui/kakaoLoginBtn";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleKakaoLogin = async () => {
    try {
      window.location.href =
        "https://goyangeyaong.shop/auth/oauth/authorization";
    } catch (err) {
      alert("카카오 로그인 요청에 실패했습니다.");
    }
  };

  return (
    <div className="relative w-[375px] h-[812px] mx-auto">
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

      <div className="absolute top-[184px] left-[58px] w-[260px] h-[140px] rounded-[20px] px-[100px] py-[40px] gap-[10px] bg-gradient-to-b from-[#EFFAFF] to-[#DEF3FF]">
        <img src={logo} alt="univent logo" className="w-[60px] h-[60px]" />
      </div>

      <div className="absolute top-[364px] left-[20px]">
        <KakaoLoginBtn onClick={handleKakaoLogin} />
      </div>
    </div>
  );
}
