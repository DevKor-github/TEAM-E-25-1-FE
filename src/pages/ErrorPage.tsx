import { useNavigate, useLocation } from "react-router-dom";
import { BottomButtonsCombo1 } from "@/components/ui/bottomButtonsCombo";
import chevronLeft from "../assets/chevronLeft.svg";
import errorIcon from "../assets/errorIcon.svg";

export default function ErrorPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const errMessage =
    location.state?.errMessage ?? "알 수 없는 오류가 발생했습니다.";

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

      <div className="absolute top-[60px] w-[375px] flex flex-col p-[20px] gap-[24px]">
        <img src={errorIcon} alt="error icon" className="w-[60px] h-[60px]" />

        <div className="w-full flex flex-col gap-[8px]">
          <div className="w-full font-bold text-title3 text-gray-900 font-pretendard">
            잠깐 문제가 발생했어요
          </div>
          <div className="w-full font-normal text-body1 text-gray-600 font-pretendard">
            {errMessage}
          </div>
        </div>
      </div>

      <div className="absolute top-[724px] w-[375px]">
        <BottomButtonsCombo1 label="확인했어요" onClick={() => navigate("/")} />
      </div>
    </div>
  );
}
