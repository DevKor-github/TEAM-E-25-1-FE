import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let isRedirecting = false;

// 토큰 갱신
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    const status = err.response?.status;

    // 로그인 상태 확인 (useUserAuthStore는 훅이므로 컴포넌트 밖에서는 직접 접근해야 함)
    const isLoggedIn = JSON.parse(
      localStorage.getItem("user-auth-storage") || "{}"
    ).state?.isLoggedIn;

    if (status === 401 && isLoggedIn && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await api.get("/auth/refresh");
        return api(originalRequest);
      } catch (refreshErr: any) {
        if (!isRedirecting) {
          isRedirecting = true;
          alert("로그인 세션이 만료되었습니다. 다시 로그인 해주세요.");
          window.location.href = "/login";
        }
        return Promise.reject(refreshErr);
      }
    }

    if (status === 500) {
      if (!isRedirecting) {
        isRedirecting = true;
        alert("인증 정보 처리 중 오류가 발생했습니다. 다시 로그인 해주세요.");
        window.location.href = "/login";
      }
      return Promise.reject(err);
    }

    return Promise.reject(err);
  }
);
