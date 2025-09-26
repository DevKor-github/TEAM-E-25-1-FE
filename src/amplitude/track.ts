import * as amplitude from "@amplitude/analytics-browser";

// 행사 목록 조회
export function trackEventListViewed(params: {
  tab: "viewCount" | "scrapCount" | "createdAt";
  tags?: string[];
  include_past?: boolean;
}) {
  amplitude.track("event_list_viewed", params);
}

// 행사 상세 진입
export function trackEventDetailViewed(params: {
  articleId: string;
  tags?: string[];
}) {
  amplitude.track("event_detail_viewed", params);
}

// 비회원 스크랩 시도
export function trackAttemptedScrap(params: { articleId: string }) {
  amplitude.track("attempted_scrap", params);
}

// 회원 스크랩 추가/삭제
export function trackScrapToggled(params: {
  articleId: string;
  action: "add" | "remove";
}) {
  amplitude.track("scrap_toggled", params);
}

// 공유 버튼 클릭
export function trackShareClicked(params: { articleId: string }) {
  amplitude.track("share_clicked", params);
}
