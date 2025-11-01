import * as amplitude from "@amplitude/analytics-browser";

const AMPLITUDE_API_KEY = import.meta.env.VITE_AMPLITUDE_API_KEY;

export const initAmplitude = () => {
  if (AMPLITUDE_API_KEY) {
    amplitude.init(AMPLITUDE_API_KEY, undefined, {
      defaultTracking: true,
    });

    // 초기 userId 설정 (로컬에 저장된 값이 있으면 사용, 없으면 anonymous)
    const storedUserId = localStorage.getItem("userId") ?? "anonymous";
    amplitude.setUserId(storedUserId);
  } else {
    console.error("앰플리튜드 API 키가 없습니다.");
  }
};
