import { LogoutBtn } from "@/components/LogoutBtn";

export default function AdminHome() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-6">관리자 홈</h1>
        <LogoutBtn />
      </div>
    </div>
  );
}
