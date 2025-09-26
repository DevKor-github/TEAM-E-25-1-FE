import * as amplitude from "@amplitude/analytics-browser";

const AMPLITUDE_API_KEY = import.meta.env.VITE_AMPLITUDE_API_KEY;

export const initAmplitude = () => {
  if (AMPLITUDE_API_KEY) {
    amplitude.init(AMPLITUDE_API_KEY, undefined, {
      defaultTracking: true,
    });
    console.log("앰플리튜드 초기화 완료");
  } else {
    console.error("앰플리튜드 API 키가 없습니다.");
  }
};
