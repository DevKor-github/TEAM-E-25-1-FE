import { Button } from "@components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "react-router-dom";

type LogoutBtnProps = {
  className?: string;
};

export function LogoutBtn({ className }: LogoutBtnProps) {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin-login");
  };

  return (
    <Button 
      onClick={handleLogout} 
      variant="outline"
      size="sm"
      className={className}
    >
      로그아웃
    </Button>
  );
}
