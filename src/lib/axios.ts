import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://localhost:8080',  // 실제 백엔드 서버 URL로 변경
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
