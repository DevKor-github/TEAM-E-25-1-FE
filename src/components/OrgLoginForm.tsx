import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useOrgAuthStore } from "@/stores/orgAuthStore";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/axios";

export function OrgLoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useOrgAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      setError("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/organization/login", {
        username,
        password,
      });

      const { accessToken, organizationId } = response.data;

      if (!accessToken || !organizationId) {
        throw new Error("로그인 응답이 올바르지 않습니다.");
      }

      // Zustand store에 로그인 정보 저장
      login(accessToken, organizationId);

      // axios 기본 헤더에 토큰 설정
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      alert("로그인 성공!");
      navigate("/org/home");
    } catch (err: any) {
      console.error("로그인 오류:", err);
      
      if (err.response?.status === 401) {
        setError("아이디 또는 비밀번호가 잘못되었습니다.");
      } else {
        setError(
          err.response?.data?.message ||
          "로그인 중 오류가 발생했습니다. 다시 시도해주세요."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div>
        <Label htmlFor="username">아이디</Label>
        <Input
          id="username"
          type="text"
          placeholder="아이디를 입력하세요"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div>
        <Label htmlFor="password">비밀번호</Label>
        <Input
          id="password"
          type="password"
          placeholder="비밀번호를 입력하세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "로그인 중..." : "로그인"}
      </Button>
    </form>
  );
}
