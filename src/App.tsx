import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import AdminHome from "./pages/AdminHome";
import { useAuthStore } from "@/stores/authStore";

function App() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

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
        {/* 행사 업로드 페이지 */}
        <Route path="/admin-home" element={<AdminHome />} />
      </Routes>
    </Router>
  );
}

export default App;
