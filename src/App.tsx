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
<<<<<<< HEAD
<<<<<<< HEAD
import AdminArticleDetail from "./pages/AdminArticleDetail";
import AdminArticleEdit from "./pages/AdminArticleEdit";
import EventUploadPage from "./pages/EventUploadPage";
=======
<<<<<<< HEAD
import { useAuthStore } from "@/stores/authStore";
import EventUploadPage from "./pages/EventUploadPage"; //
=======
import AdminArticleDetail from "./pages/AdminArticleDetail";
import AdminArticleEdit from "./pages/AdminArticleEdit";
import EventUploadPage from "./pages/EventUploadPage";
>>>>>>> 31d40d4 (feat: 행사 상세 페이지 구현)
>>>>>>> 1bced03 (feat: 행사 상세 페이지 구현)
=======
import { useAuthStore } from "@/stores/authStore";
import EventUploadPage from "./pages/ArticleUploadPage"; //
>>>>>>> 06d4603 (feat: 업로드 페이지 라우팅 연결)

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
<<<<<<< HEAD
<<<<<<< HEAD
        {/* 행사 업로드 페이지 */}
        <Route path="/admin-upload" element={<EventUploadPage />} />
        {/* 행사 상세 페이지 */}
        <Route
          path="/admin/article/:articleId"
          element={<AdminArticleDetail />}
        />
=======
<<<<<<< HEAD
        <Route path="/admin/article-upload" element={<ArticleUploadPage />} />
        <Route path="/admin/article/:articleId" element={<ArticleDetailPage />} />
        <Route path="/admin/article/:articleId/edit" element={<ArticleEditPage />} />
=======
        {/* 행사 업로드 페이지 */}
        <Route path="/admin-upload" element={<EventUploadPage />} />
<<<<<<< HEAD
>>>>>>> d0db937 (chore: 행사 수정페이지에 태그 추가 및 App.jsx에 라우터 변경 반영(/admin/article/:articleId/edit))
=======
        {/* 행사 상세 페이지 */}
        <Route
          path="/admin/article/:articleId"
          element={<AdminArticleDetail />}
        />
>>>>>>> 1bced03 (feat: 행사 상세 페이지 구현)
        {/* 행사 수정 페이지 */}
        <Route
          path="/admin/article/:articleId/edit"
          element={<AdminArticleEdit />}
        />
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 335ccd8 (chore: 행사 수정페이지에 태그 추가 및 App.jsx에 라우터 변경 반영(/admin/article/:articleId/edit))
>>>>>>> d0db937 (chore: 행사 수정페이지에 태그 추가 및 App.jsx에 라우터 변경 반영(/admin/article/:articleId/edit))
=======
>>>>>>> 335ccd8 (chore: 행사 수정페이지에 태그 추가 및 App.jsx에 라우터 변경 반영(/admin/article/:articleId/edit))
=======
>>>>>>> 31d40d4 (feat: 행사 상세 페이지 구현)
>>>>>>> 1bced03 (feat: 행사 상세 페이지 구현)
=======
        <Route path="/admin/article-upload" element={<ArticleUploadPage />} />
        <Route path="/admin/article/:articleId" element={<ArticleDetailPage />} />
        <Route path="/admin/article/:articleId/edit" element={<ArticleEditPage />} />
>>>>>>> 06d4603 (feat: 업로드 페이지 라우팅 연결)
      </Routes>
    </Router>
  );
}

export default App;
``