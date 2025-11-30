import { useNavigate, useLocation } from "react-router-dom";
import { useOrgAuthStore } from "@/stores/orgAuthStore";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/axios";

export function OrgHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = useOrgAuthStore((state) => state.isLoggedIn);
  const logout = useOrgAuthStore((state) => state.logout);

  const handleLogout = async () => {
    if (window.confirm("로그아웃하시겠습니까?")) {
      try {
        // POST /auth/organization/logout 호출
        await api.post("/auth/organization/logout", {}, {
          headers: {
            Authorization: `Bearer ${useOrgAuthStore.getState().accessToken}`,
          },
        });
      } catch (error: any) {
        console.error("로그아웃 API 호출 실패:", error);
        
        // 401 (유효하지 않은 토큰) 또는 기타 에러도 로컬 로그아웃 진행
        if (error.response?.status === 401) {
          console.warn("토큰이 만료되었습니다. 로컬 로그아웃을 진행합니다.");
        }
        // API 실패해도 로컬 로그아웃 진행
      }

      logout();
      // axios 헤더에서 토큰 제거
      delete api.defaults.headers.common["Authorization"];
      navigate("/org/login");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b shadow-sm z-50">
      <div className="container mx-auto h-full px-4 flex items-center justify-between">
        <h1
          className="text-xl font-bold cursor-pointer"
          onClick={() => navigate("/org/home")}
        >
          UNIVENT - 기관
        </h1>
        {isLoggedIn && location.pathname !== "/org/login" && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
          >
            로그아웃
          </Button>
        )}
      </div>
    </header>
  );
}
