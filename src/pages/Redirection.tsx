import { api } from "@/lib/axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Redirection() {
  const navigate = useNavigate();
  const authorizationCode = new URL(
    document.location.toString()
  ).searchParams.get("code");

  useEffect(() => {
    if (!authorizationCode) {
      alert("인증 코드가 제공되지 않았습니다.");
      navigate("/auth/login", { replace: true });
      return;
    }

    const sendCode = async () => {
      try {
        await api.get("/auth/login/oauth/callback", {
          params: { code: authorizationCode },
        });
        navigate("/", { replace: true });
      } catch (err: any) {
        const status = err?.response?.status;
        const errCode = err?.response?.data?.code;

        if (status === 400 && errCode === "AUTH_KAKAO_CODE_MISSING") {
          alert("인증 코드가 제공되지 않았습니다.");
        } else if (status === 401 && errCode === "AUTH_KAKAO_CODE_INVALID") {
          alert("유효하지 않은 인증 코드입니다. 다시 로그인 해주세요.");
        } else {
          alert("로그인 중 알 수 없는 오류가 발생했습니다.");
        }
        navigate("/auth/login", { replace: true });
      }
    };

    sendCode();
  }, [authorizationCode, navigate]);

  return <div className="relative w-[375px] h-[812px] mx-auto bg-black"></div>;
}
