import { useState } from "react";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "react-router-dom";

export function LoginForm() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  // zustand store에서 로그인 함수 가져오기
  const login = useAuthStore((state) => state.login);

  const navigate = useNavigate();

  // 환경 변수에서 아이디와 비밀번호 가져오기
  const ADMIN_ID = import.meta.env.VITE_ADMIN_ID;
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

  const handleSubmit = (e: React.FormEvent) => {
    // 폼 제출 시 페이지 새로고침 방지
    e.preventDefault();

    // 로그인 로직
    if (id === ADMIN_ID && password === ADMIN_PASSWORD) {
      login(); // zustand의 로그인 함수 호출
      navigate("/admin-home"); // 로그인 성공 시 AdminHome으로 이동
    } else {
      alert("아이디 또는 비밀번호가 잘못되었습니다.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto mt-12">
      <div>
        <label htmlFor="id" className="block text-sm font-medium">
          아이디
        </label>
        <Input
          id="id"
          type="text"
          placeholder="아이디를 입력하세요"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          비밀번호
        </label>
        <Input
          id="password"
          type="password"
          placeholder="비밀번호를 입력하세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <Button type="submit" className="w-full">
        로그인
      </Button>
    </form>
  );
}
