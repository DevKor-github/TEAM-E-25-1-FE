import { OrgSignupForm } from "@/components/OrgSignupForm";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/axios";
import { useState } from "react";

type SignupFormData = {
  username: string;
  password: string;
  passwordConfirm: string;
  organizationName: string;
  phoneNumber: string;
};

export default function OrgSignup() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: SignupFormData) => {
    try {
      setError(null);
      
      await api.post("/auth/organization/register", {
        accountId: data.username,
        password: data.password,
        name: data.organizationName,
        contact: data.phoneNumber,
      });

      alert("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.");
      navigate("/org/login");
    } catch (err: any) {
      console.error("회원가입 오류:", err);
      
      if (err.response?.status === 409) {
        setError("이미 존재하는 계정입니다.");
      } else {
        setError(
          err.response?.data?.message || 
          "회원가입 중 오류가 발생했습니다. 다시 시도해주세요."
        );
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-center mb-2">
            기관 회원가입
          </h2>
          <p className="text-sm text-gray-600 text-center">
            행사 업로드 권한을 받으려면 회원가입이 필요합니다.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <OrgSignupForm onSubmit={handleSubmit} />

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            이미 계정이 있으신가요?{" "}
            <button
              onClick={() => navigate("/org/login")}
              className="text-blue-600 hover:underline font-medium"
            >
              로그인
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
