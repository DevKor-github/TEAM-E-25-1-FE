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

    // 사용자 로그인 상태 확인
    const userAuthState = JSON.parse(
      localStorage.getItem("user-auth-storage") || "{}"
    ).state?.isLoggedIn;

    // 기관 로그인 상태 확인
    const orgAuthState = JSON.parse(
      localStorage.getItem("org-auth-storage") || "{}"
    ).state?.isLoggedIn;

    // 401 에러 시 토큰 갱신 로직
    if (status === 401 && (userAuthState || orgAuthState) && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // 기관 로그인인 경우
        if (orgAuthState) {
          await api.post("/auth/organization/refresh");
          return api(originalRequest);
        }
        // 사용자 로그인인 경우
        else if (userAuthState) {
          await api.get("/auth/refresh");
          return api(originalRequest);
        }
      } catch (refreshErr: any) {
        if (!isRedirecting) {
          isRedirecting = true;
          const redirectUrl = orgAuthState ? "/org/login" : "/login";
          alert("로그인 세션이 만료되었습니다. 다시 로그인 해주세요.");
          window.location.href = redirectUrl;
        }
        return Promise.reject(refreshErr);
      }
    }

    if (status === 500) {
      if (!isRedirecting) {
        isRedirecting = true;
        alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }
      return Promise.reject(err);
    }

    return Promise.reject(err);
  }
);
