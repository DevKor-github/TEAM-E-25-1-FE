import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAdminAuthStore } from "@/stores/adminAuthStore";
import { useUserAuthStore } from "@/stores/userAuthStore";

import LoginPage from "./pages/LoginPage";
import ArticleDetailPage from "./pages/ArticleDetailPage";
import MyPage from "./pages/MyPage";
import ErrorPage from "./pages/ErrorPage";

import AdminLogin from "./pages/AdminLogin";
import AdminHome from "./pages/AdminHome";
import ArticleUploadPage from "./pages/ArticleUploadPage";
import AdminArticleDetail from "./pages/AdminArticleDetail";
import AdminArticleEdit from "./pages/AdminArticleEdit";

// 관리자 페이지에서 인증된 사용자만 접근 가능한 라우트 컴포넌트
function AdminPrivateRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useAdminAuthStore((state) => state.isLoggedIn);
  return isLoggedIn ? children : <Navigate to="/admin/login" replace />;
}

// 사용자 페이지에서 인증된 사용자만 접근 가능한 라우트 컴포넌트
function UserPrivateRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useUserAuthStore((state) => state.isLoggedIn);
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Router>
      <main>
        <Routes>
          {/* 기본 경로를 로그인 페이지로 변경 (개발 완료 후 /event로 변경해야 함) */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          {/* 사용자 라우트 */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/event/:eventId" element={<ArticleDetailPage />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route
            path="/mypage"
            element={
              <UserPrivateRoute>
                <MyPage />
              </UserPrivateRoute>
            }
          />
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
            path="/admin/event/:eventId"
            element={
              <AdminPrivateRoute>
                <AdminArticleDetail />
              </AdminPrivateRoute>
            }
          />
          <Route
            path="/admin/event/:event/edit"
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
    </Router>
  );
}
