import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import AdminLogin from "./pages/AdminLogin";
import AdminHome from "./pages/AdminHome";
import AdminArticleDetail from "./pages/AdminArticleDetail";
import AdminArticleEdit from "./pages/AdminArticleEdit";
import EventUploadPage from "./pages/EventUploadPage";

function App() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const checkExpiration = useAuthStore((state) => state.checkExpiration);

  useEffect(() => {
    checkExpiration(); // 애플리케이션 로드 시 만료 확인
  }, [checkExpiration]);

  return (
    <Router>
      <Routes>
        {/* 첫 랜딩 페이지: 로그인 상태에 따라 리다이렉트 */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/admin-home" />
            ) : (
              <Navigate to="/admin-login" />
            )
          }
        />
        {/* 관리자 로그인 페이지 */}
        <Route path="/admin-login" element={<AdminLogin />} />
        {/* 관리자 홈 페이지 */}
        <Route path="/admin-home" element={<AdminHome />} />
        {/* 행사 업로드 페이지 */}
        <Route path="/admin-upload" element={<EventUploadPage />} />
        {/* 행사 상세 페이지 */}
        <Route
          path="/admin/article/:articleId"
          element={<AdminArticleDetail />}
        />
        {/* 행사 수정 페이지 */}
        <Route
          path="/admin/article/:articleId/edit"
          element={<AdminArticleEdit />}
        />
      </Routes>
    </Router>
  );
}

export default App;
