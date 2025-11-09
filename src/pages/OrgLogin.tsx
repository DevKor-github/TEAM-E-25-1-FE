import { OrgLoginForm } from "@/components/OrgLoginForm";
import { useOrgAuthStore } from "@/stores/orgAuthStore";
import { Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function OrgLogin() {
  const isLoggedIn = useOrgAuthStore((state) => state.isLoggedIn);
  const navigate = useNavigate();

  useEffect(() => {
    useOrgAuthStore.getState().checkExpiration();
  }, []);

  if (isLoggedIn) {
    return <Navigate to="/org/home" replace />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-center mb-2">
            기관 로그인
          </h2>
          <p className="text-sm text-gray-600 text-center">
            행사 업로드 및 관리를 위해 로그인하세요.
          </p>
        </div>

        <OrgLoginForm />

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            아직 계정이 없으신가요?{" "}
            <button
              onClick={() => navigate("/org/signup")}
              className="text-blue-600 hover:underline font-medium"
            >
              회원가입
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
