import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { Header } from "@/components/Header";
import ArticleUploadPage from "./pages/ArticleUploadPage";
import ArticleDetailPage from "./pages/ArticleDetailPage";
import AdminLogin from "./pages/AdminLogin";
import AdminHome from "./pages/AdminHome";
import AdminArticleDetail from "./pages/AdminArticleDetail";
import AdminArticleEdit from "./pages/AdminArticleEdit";

import ButtonTest from "./pages/demo/ButtonTest";
import KakaoLoginTest from "./pages/demo/kakaoLoginTest";
import BottomSheetTest from "./pages/demo/BottomSheetTest";
import TabbedControlTest from "./pages/demo/TabbedControlTest";

// 인증된 사용자만 접근 가능한 라우트 컴포넌트
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  return isLoggedIn ? children : <Navigate to="/admin-login" replace />;
}

export default function App() {
  return (
    <Router>
      <Header />
      <main className="container mx-auto px-4 pt-16">
        <Routes>
          {/* 기본 경로를 로그인 페이지로 변경 */} {/* 일반 사용자용 라우트 */}
          <Route path="/" element={<Navigate to="/admin-login" replace />} />
          <Route path="/article/:articleId" element={<ArticleDetailPage />} />
          {/* 관리자 라우트 */}
          <Route path="/admin-login" element={<AdminLogin />} />
          {/* 인증이 필요한 관리자 라우트들 */}
          <Route
            path="/admin-home"
            element={
              <PrivateRoute>
                <AdminHome />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/article/:articleId"
            element={
              <PrivateRoute>
                <AdminArticleDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/article/:articleId/edit"
            element={
              <PrivateRoute>
                <AdminArticleEdit />
              </PrivateRoute>
            }
          />
          <Route
            path="/article/upload"
            element={
              <PrivateRoute>
                <ArticleUploadPage />
              </PrivateRoute>
            }
          />
          {/* 데모 페이지 라우트 */}
          <Route path="/demo/ButtonTest" element={<ButtonTest />} />
          <Route path="/demo/KakaoLoginTest" element={<KakaoLoginTest />} />
          <Route
            path="/demo/TabbedControlTest"
            element={<TabbedControlTest />}
          />
          <Route path="/demo/BottomSheetTest" element={<BottomSheetTest />} />
        </Routes>
      </main>
    </Router>
  );
}
