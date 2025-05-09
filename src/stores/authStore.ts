import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  checkExpiration: () => void;
};

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      // 초기 로그아웃 상태
      isLoggedIn: false,

      // 로그인 함수
      login: () => {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 7); // 7일 후 로그인 만료
        localStorage.setItem("authExpiration", expirationDate.toISOString()); // 만료 시간 저장
        set({ isLoggedIn: true });
      },

      // 로그아웃 함수
      logout: () => {
        localStorage.removeItem("authExpiration");
        set({ isLoggedIn: false });
      },

      // 만료 확인 함수
      checkExpiration: () => {
        const expiration = localStorage.getItem("authExpiration"); // 로그아웃 상태면 expiration이 null
        // expiration이 null이 아니고(로그인 되어 있고), 만료 시간이 현재 시간보다 이전이면 자동 로그아웃 처리
        if (expiration && new Date(expiration) < new Date()) {
          set({ isLoggedIn: false });
          localStorage.removeItem("authExpiration");
        }
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
