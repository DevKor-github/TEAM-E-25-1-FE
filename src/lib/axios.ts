import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000/",
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
    const errCode = err.response?.data?.code;

    if (
      status === 401 &&
      errCode === "AUTH_TOKEN_EXPIRED" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        await api.get("/auth/refresh");
        return api(originalRequest);
      } catch (refreshErr: any) {
        const refreshStatus = refreshErr?.response?.status;
        const refreshErrCode = refreshErr?.response?.data?.code;

        if (
          refreshStatus === 400 &&
          refreshErrCode === "AUTH_REFRESH_TOKEN_MISSING"
        ) {
          alert("토큰 재발급을 위한 정보가 누락되었습니다.");
        } else {
          alert("로그인 세션이 만료되었습니다. 다시 로그인 해주세요.");
        }
        window.location.href = "/login";
        return Promise.reject(refreshErr);
      }
    }

    if (status === 500 && errCode === "AUTH_TOKEN_PARSING_FAILED") {
      alert("인증 정보 처리 중 오류가 발생했습니다. 다시 로그인 해주세요.");
      window.location.href = "/login";
      return Promise.reject(err);
    }

    return Promise.reject(err);
  }
);
