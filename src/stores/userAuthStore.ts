import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserAuthState = {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
};

export const useUserAuthStore = create(
  persist<UserAuthState>(
    (set) => ({
      // 초기 로그아웃 상태
      isLoggedIn: false,
      login: () => set({ isLoggedIn: true }),
      logout: () => set({ isLoggedIn: false }),
    }),
    {
      name: "user-auth-storage",
    }
  )
);
