import { LoginForm } from "@/components/LoginForm";

export default function AdminLogin() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">관리자 로그인</h2>
        <LoginForm />
      </div>
    </div>
  );
}
