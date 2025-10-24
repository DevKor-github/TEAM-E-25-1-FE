import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useRef, useEffect } from "react";
import { usePreviousPageStore } from "@/stores/previousPageStore";
import { useAdminAuthStore } from "@/stores/adminAuthStore";
import { PageName } from "@/types/pageName";

import Redirection from "./pages/Redirection";
import LoginPage from "./pages/LoginPage";
import ArticleDetailPage from "./pages/ArticleDetailPage";
import MyPage from "./pages/MyPage";
import ErrorPage from "./pages/ErrorPage";
import ScrapPage from "./pages/ScrapPage";

import AdminLogin from "./pages/AdminLogin";
import AdminHome from "./pages/AdminHome";
import ArticleUploadPage from "./pages/ArticleUploadPage";
import AdminArticleDetail from "./pages/AdminArticleDetail";
import AdminArticleEdit from "./pages/AdminArticleEdit";
import ArticleListPage from "./pages/ArticleListPage";

// 관리자 페이지에서 인증된 사용자만 접근 가능한 라우트 컴포넌트
function AdminPrivateRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useAdminAuthStore((state) => state.isLoggedIn);

  // 관리자 라우트 접근 시마다 로그인 만료 체크
  useEffect(() => {
    useAdminAuthStore.getState().checkExpiration();
  }, []);

  return isLoggedIn ? children : <Navigate to="/admin/login" replace />;
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
        <Route path="auth/login/oauth/callback" element={<Redirection />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/event" element={<ArticleListPage />} />
        <Route path="/event/:articleId" element={<ArticleDetailPage />} />
        <Route path="/scrap" element={<ScrapPage />} />
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
      </Routes>
    </main>
  );
}
