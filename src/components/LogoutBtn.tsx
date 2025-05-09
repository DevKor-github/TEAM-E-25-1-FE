import { Button } from "@components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "react-router-dom";

export function LogoutBtn() {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // zustand의 로그아웃 함수 호출
    navigate("/admin-login"); // 로그아웃 후 AdminLogin으로 이동
  };

  return (
    <Button onClick={handleLogout} className="w-full mt-4">
      로그아웃
    </Button>
  );
}
