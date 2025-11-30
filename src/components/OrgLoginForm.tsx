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
      await api.post("/auth/organization/login", {
        accountId: username,
        password,
      });

      // HttpOnly 쿠키는 JavaScript에서 접근할 수 없으므로,
      // 로그인 성공 시 임시 토큰과 organizationId를 저장
      // 실제 토큰은 브라우저가 자동으로 쿠키에 저장하고 관리함
      
      // username (accountId)을 organizationId로 사용
      const organizationId = username;
      
      // 임시 토큰 (실제로는 쿠키에 저장된 토큰 사용)
      const tempToken = `temp_${Date.now()}`;

      console.log("로그인 성공 - organizationId:", organizationId);

      // Zustand store에 로그인 정보 저장
      login(tempToken, organizationId);

      alert("로그인 성공!");
      navigate("/org/home");
    } catch (err: any) {
      console.error("로그인 오류:", err);
      
      if (err.response?.status === 404) {
        setError("아이디 또는 비밀번호가 잘못되었습니다.");
      } else if (err.response?.status === 401) {
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
