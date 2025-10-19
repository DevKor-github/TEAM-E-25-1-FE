import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/axios";
import { usePreviousPageStore } from "@/stores/previousPageStore";
import { trackPageViewed } from "@/amplitude/track";
import { Button } from "@/components/ui/buttons";
import HeaderFrame from "@/components/HeaderFrame";

export default function MyPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      navigate("/", { replace: true });
    } catch (err: any) {
      if (err.response?.status === 401) {
        alert("로그인 상태가 아닙니다.");
      } else if (err.response?.status === 500) {
        alert("인증 정보 처리 중 오류가 발생했습니다. 다시 로그인 해주세요.");
      } else {
        alert("로그아웃 중 오류가 발생했습니다.");
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("정말로 회원탈퇴 하시겠습니까?")) return;
    try {
      await api.delete("/user/me");
      alert("성공적으로 회원탈퇴가 처리되었습니다.");
      navigate("/", { replace: true });
    } catch (err: any) {
      if (err.response?.status === 401) {
        alert("로그인 상태가 아닙니다.");
      } else if (err.response?.status === 404) {
        alert("존재하지 않는 사용자입니다.");
      } else {
        alert("회원탈퇴 중 오류가 발생했습니다.");
      }
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get<{ email: string }>("/user/me");
        setEmail(res.data.email);
      } catch (err: any) {
        if (err.response?.status === 401 || err.response?.status === 404) {
          // 유효하지 않은 access token 또는 존재하지 않는 사용자
          navigate("/login", { replace: true });
        } else {
          alert("사용자 정보를 불러오는 중 오류가 발생했습니다.");
          navigate("/", { replace: true });
        }
        return;
      }
    };

    fetchUser();
  }, []);

  const previousPage = usePreviousPageStore((state) => state.previousPage);

  // 앰플리튜드 - 페이지 조회 트래킹
  useEffect(() => {
    trackPageViewed({
      pageName: "my_page",
      previousPage: previousPage,
    });
  }, [previousPage]);

  return (
    // 바깥 프레임
    <div className="w-full min-h-screen bg-gray-100">
      {/* 중앙 컨텐츠 프레임 */}
      <div className="relative w-full max-w-[460px] mx-auto bg-white min-h-screen">
        <HeaderFrame />

        <div className="absolute top-[80px] left-[20px] w-[100px] h-[32px] font-semibold text-title3 font-pretendard">
          마이페이지
        </div>

        <div className="absolute top-[132px] left-[20px] right-[20px] rounded-[12px] border border-gray-200 px-[16px] py-[12px] flex flex-col gap-[12px]">
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
              {email}
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <div className="absolute top-[321px] left-[20px] flex flex-row gap-[12px]">
          <Button styleType="gray" size="md" onClick={handleLogout}>
            로그아웃
          </Button>
          <Button
            styleType="destructive"
            size="md"
            onClick={handleDeleteAccount}
          >
            회원탈퇴
          </Button>
        </div>
      </div>
    </div>
  );
}
