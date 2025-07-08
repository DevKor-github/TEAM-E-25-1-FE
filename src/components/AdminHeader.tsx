import { useNavigate } from "react-router-dom";
import { useAdminAuthStore } from "@/stores/adminAuthStore";
import { LogoutBtn } from "./LogoutBtn";
import { useLocation } from "react-router-dom";

export function AdminHeader() {
  const navigate = useNavigate();
  const isLoggedIn = useAdminAuthStore((state) => state.isLoggedIn);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b shadow-sm z-50">
      <div className="container mx-auto h-full px-4 flex items-center justify-between">
        <h1
          className="text-xl font-bold cursor-pointer"
          onClick={() => navigate("/admin/home")}
        >
          UNIVENT
        </h1>
        {isLoggedIn && location.pathname !== "/admin/login" && (
          <LogoutBtn className="scale-100" />
        )}
      </div>
    </header>
  );
}
