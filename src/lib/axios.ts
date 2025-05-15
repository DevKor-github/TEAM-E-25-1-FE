import axios from 'axios';

export const api = axios.create({
  baseURL:'/',  // 실제 백엔드 서버 URL로 변경
  headers: {
    'Content-Type': 'application/json',
  },
});
