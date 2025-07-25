import KakaoIcon from "../../assets/KakaoTalk_logo.svg";

const KakaoLoginBtn = ({ onClick }: { onClick?: () => void }) => {
  return (
    <button
      type="button"
      className="flex w-full py-3 px-4 justify-center items-center gap-3 rounded-xl bg-[#FEE500] border-0 cursor-pointer"
      onClick={onClick}
    >
      <span className="flex items-center justify-center">
        <img src={KakaoIcon} width={24} height={24} alt="kakao" />
      </span>
      <span className="w-full text-center text-black font-pretendard text-[17px] font-medium leading-[24px]">
        카카오로 시작하기
      </span>
    </button>
  );
};

export default KakaoLoginBtn;
