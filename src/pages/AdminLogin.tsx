import { LoginForm } from "@/components/LoginForm";

export default function AdminLogin() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md bg-white rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-center mb-8">관리자 로그인</h2>
        <LoginForm />
      </div>
    </div>
  );
}
