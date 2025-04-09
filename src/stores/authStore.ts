import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
};

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      // 초기 로그아웃 상태
      isLoggedIn: false,

      // 로그인 함수
      login: () => {
        set({ isLoggedIn: true });
      },

      // 로그아웃 함수
      logout: () => {
        set({ isLoggedIn: false });
      },
    }),
    {
      name: "auth-storage", // localStorage에 저장될 키 이름
      storage: {
        getItem: (name) => {
          const item = localStorage.getItem(name);
          return item ? JSON.parse(item) : null;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);
