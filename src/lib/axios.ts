import axios from "axios";

export const api = axios.create({
  baseURL: "/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 토큰 갱신
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    const status = err.response?.status;

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await api.get("/auth/refresh");
        return api(originalRequest);
      } catch (refreshErr: any) {
        alert("로그인 세션이 만료되었습니다. 다시 로그인 해주세요.");
        window.location.href = "/login";
        return Promise.reject(refreshErr);
      }
    }

    if (status === 500) {
      alert("인증 정보 처리 중 오류가 발생했습니다. 다시 로그인 해주세요.");
      window.location.href = "/login";
      return Promise.reject(err);
    }

    return Promise.reject(err);
  }
);
