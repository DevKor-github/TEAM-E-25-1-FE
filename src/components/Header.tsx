import { useAuthStore } from "@/stores/authStore";
import { LogoutBtn } from "./LogoutBtn";
import { useLocation } from "react-router-dom";

export function Header() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b shadow-sm z-50">
      <div className="container mx-auto h-full px-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">UNIVENT</h1>
        {isLoggedIn && location.pathname !== "/admin-login" && (
          <LogoutBtn className="scale-75" />
        )}
      </div>
    </header>
  );
}
