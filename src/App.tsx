import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useRef, useEffect } from "react";
import { usePreviousPageStore } from "@/stores/previousPageStore";
import { useAdminAuthStore } from "@/stores/adminAuthStore";
import { useOrgAuthStore } from "@/stores/orgAuthStore";
import { PageName } from "@/types/pageName";

import Redirection from "./pages/Redirection";
import LoginPage from "./pages/LoginPage";
import ArticleDetailPage from "./pages/ArticleDetailPage";
import MyPage from "./pages/MyPage";
import ErrorPage from "./pages/ErrorPage";
import ScrapPage from "./pages/ScrapPage";
import ArticleListSearch from "./pages/ArticleListSearch";
import ScrapSearch from "./pages/ScrapSearch";

import AdminLogin from "./pages/AdminLogin";
import AdminHome from "./pages/AdminHome";
import ArticleUploadPage from "./pages/ArticleUploadPage";
import AdminArticleDetail from "./pages/AdminArticleDetail";
import AdminArticleEdit from "./pages/AdminArticleEdit";
import ArticleListPage from "./pages/ArticleListPage";

import OrgSignup from "./pages/OrgSignup";
import OrgLogin from "./pages/OrgLogin";
import OrgHome from "./pages/OrgHome";
import OrgArticleDetail from "./pages/OrgArticleDetail";
import OrgArticleEdit from "./pages/OrgArticleEdit";
import OrgArticleUpload from "./pages/OrgArticleUpload";

// 관리자 페이지에서 인증된 사용자만 접근 가능한 라우트 컴포넌트
function AdminPrivateRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useAdminAuthStore((state) => state.isLoggedIn);

  // 관리자 라우트 접근 시마다 로그인 만료 체크
  useEffect(() => {
    useAdminAuthStore.getState().checkExpiration();
  }, []);

  return isLoggedIn ? children : <Navigate to="/admin/login" replace />;
}

// 기관 페이지에서 인증된 사용자만 접근 가능한 라우트 컴포넌트
function OrgPrivateRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useOrgAuthStore((state) => state.isLoggedIn);

  // 기관 라우트 접근 시마다 로그인 만료 체크
  useEffect(() => {
    useOrgAuthStore.getState().checkExpiration();
  }, []);

  return isLoggedIn ? children : <Navigate to="/org/login" replace />;
}

export default function App() {
  const location = useLocation();
  const setPreviousPage = usePreviousPageStore(
    (state) => state.setPreviousPage
  );
  const prevPath = useRef<string | null>(null);

  // 페이지 이동 시 이전 페이지 경로 저장
  useEffect(() => {
    const pathToPageName = (pathname: string): PageName | null => {
      if (pathname.startsWith("/event/") && pathname !== "/event")
        return "article_detail";
      if (pathname === "/event") return "article_list";
      if (pathname === "/scrap") return "scrap_list";
      if (pathname === "/mypage") return "my_page";
      if (pathname === "/login") return "login_page";
      return null;
    };

    const prevPageName = pathToPageName(prevPath.current || "");
    if (prevPageName) setPreviousPage(prevPageName);

    prevPath.current = location.pathname;
  }, [location.pathname, setPreviousPage]);

  return (
    <main>
      <Routes>
        {/* 기본 경로 설정 */}
        <Route path="/" element={<Navigate to="/event" replace />} />
        {/* 사용자 라우트 */}
        <Route path="/auth/login/oauth/callback" element={<Redirection />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/event" element={<ArticleListPage />} />
        <Route path="/event/search" element={<ArticleListSearch />} />
        <Route path="/event/:articleId" element={<ArticleDetailPage />} />
        <Route path="/scrap" element={<ScrapPage />} />
        <Route path="/scrap/search" element={<ScrapSearch />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/mypage" element={<MyPage />} />
        {/* 관리자 라우트 */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/home"
          element={
            <AdminPrivateRoute>
              <AdminHome />
            </AdminPrivateRoute>
          }
        />
        <Route
          path="/admin/event/:articleId"
          element={
            <AdminPrivateRoute>
              <AdminArticleDetail />
            </AdminPrivateRoute>
          }
        />
        <Route
          path="/admin/event/:articleId/edit"
          element={
            <AdminPrivateRoute>
              <AdminArticleEdit />
            </AdminPrivateRoute>
          }
        />
        <Route
          path="/admin/event/upload"
          element={
            <AdminPrivateRoute>
              <ArticleUploadPage />
            </AdminPrivateRoute>
          }
        />
        {/* 기관 라우트 */}
        <Route path="/org" element={<Navigate to="/org/login" replace />} />
        <Route path="/org/signup" element={<OrgSignup />} />
        <Route path="/org/login" element={<OrgLogin />} />
        <Route
          path="/org/home"
          element={
            <OrgPrivateRoute>
              <OrgHome />
            </OrgPrivateRoute>
          }
        />
        <Route
          path="/org/event/:articleId"
          element={
            <OrgPrivateRoute>
              <OrgArticleDetail />
            </OrgPrivateRoute>
          }
        />
        <Route
          path="/org/event/:articleId/edit"
          element={
            <OrgPrivateRoute>
              <OrgArticleEdit />
            </OrgPrivateRoute>
          }
        />
        <Route
          path="/org/event/upload"
          element={
            <OrgPrivateRoute>
              <OrgArticleUpload />
            </OrgPrivateRoute>
          }
        />
      </Routes>
    </main>
  );
}
