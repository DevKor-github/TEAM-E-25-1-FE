import * as amplitude from "@amplitude/analytics-browser";

// 버튼 클릭
export function trackButtonClicked(params: {
  buttonName:
    | "open_filter"
    | "close_filter"
    | "apply_filter"
    | "scrap_article"
    | "start_with_kakao"
    | "share_article"
    | "open_registrationUrl"
    | "copy_article_location"
    | "previous_image"
    | "next_image"
    | "close_article_image_view";
  pageName:
    | "article_list"
    | "article_detail"
    | "article_image_view"
    | "scrap_list"
    | "my_page"
    | "login_page";
}) {
  amplitude.track("Button Clicked", params);
}

// 페이지 조회
export function trackPageViewed(params: {
  pageName:
    | "article_list"
    | "article_detail"
    | "article_image_view"
    | "scrap_list"
    | "my_page"
    | "login_page";
  previousPage: string;
}) {
  amplitude.track("Page Viewed", params);
}

// 행사 목록 조회
export function trackArticleListViewed(params: {
  currentTab: "view_count" | "scrap_count" | "created_at";
  filteredTag?: string[];
  includePast: boolean;
}) {
  amplitude.track("Article List Viewed", params);
}

// 행사 상세 조회
export function trackArticleDetailViewed(params: {
  tag: string[];
  detailImage: number;
  viewCount: number;
  hasLink: boolean;
  fromLink: boolean;
}) {
  amplitude.track("Article Detail Viewed", params);
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
export function trackArticleShared(params: {
  articleId: string;
  tag: string[];
}) {
  amplitude.track("Article Shared", params);
}

// 바로가기 버튼 링크 접속
export function trackRegistrationUrlOpened(params: {
  articleId: string;
  tag: string[];
}) {
  amplitude.track("RegistrationUrl Opened", params);
}
