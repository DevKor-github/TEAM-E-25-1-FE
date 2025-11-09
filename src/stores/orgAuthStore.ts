import { create } from "zustand";
import { persist } from "zustand/middleware";

type OrgAuthState = {
  isLoggedIn: boolean;
  accessToken: string | null;
  organizationId: string | null;
  login: (accessToken: string, organizationId: string) => void;
  logout: () => void;
  checkExpiration: () => void;
};

export const useOrgAuthStore = create(
  persist<OrgAuthState>(
    (set) => ({
      // 초기 로그아웃 상태
      isLoggedIn: false,
      accessToken: null,
      organizationId: null,

      // 로그인 함수
      login: (accessToken: string, organizationId: string) => {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 7); // 7일 후 로그인 만료
        localStorage.setItem(
          "org-auth-expiration",
          expirationDate.toISOString()
        );
        set({ isLoggedIn: true, accessToken, organizationId });
      },

      // 로그아웃 함수
      logout: () => {
        localStorage.removeItem("org-auth-expiration");
        set({ isLoggedIn: false, accessToken: null, organizationId: null });
      },

      // 만료 확인 함수
      checkExpiration: () => {
        const expiration = localStorage.getItem("org-auth-expiration");
        if (expiration && new Date(expiration) < new Date()) {
          set({ isLoggedIn: false, accessToken: null, organizationId: null });
          localStorage.removeItem("org-auth-expiration");
        }
      },
    }),
    {
      name: "org-auth-storage",
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
