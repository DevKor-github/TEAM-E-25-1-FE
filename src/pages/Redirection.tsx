import { api } from "@/lib/axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as amplitude from "@amplitude/analytics-browser";

export default function Redirection() {
  const navigate = useNavigate();

  const code = new URL(document.location.toString()).searchParams.get("code");

  useEffect(() => {
    if (!code) {
      alert("인증 코드가 제공되지 않았습니다.");
      navigate("/login", { replace: true });
      return;
    }

    const sendCode = async () => {
      try {
        const res = await api.post("/auth/login/oauth/callback", null, {
          params: { code },
        });

        const { userId, redirectUrl } = res.data;
        if (userId) {
          localStorage.setItem("userId", String(userId));
          amplitude.setUserId(String(userId));
        }
        if (redirectUrl) {
          navigate(redirectUrl || "/", { replace: true });
        }
      } catch (err: any) {
        if (err.response?.status === 401) {
          alert("유효하지 않은 인증 코드입니다. 다시 로그인 해주세요.");
        } else {
          alert("로그인 중 알 수 없는 오류가 발생했습니다.");
        }
        navigate("/login", { replace: true });
      }
    };

    sendCode();
  }, [code, navigate]);

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <div className="w-full max-w-[460px] mx-auto bg-black min-h-screen">
        <div className="flex items-center justify-center py-8 text-lg text-white">
          로그인 진행 중...
        </div>
      </div>
    </div>
  );
}
