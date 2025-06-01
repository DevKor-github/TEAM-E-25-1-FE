import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ButtonTest from "./pages/demo/ButtonTest";
import KakaoLoginTest from "./pages/demo/KakaoLoginTest";
import BottomSheetTest from "./pages/demo/BottomSheetTest";
import TabbedControlTest from "./pages/demo/TabbedControlTest";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* 데모 페이지 라우트 */}
        <Route path="/demo/ButtonTest" element={<ButtonTest />} />
        <Route path="/demo/KakaoLoginTest" element={<KakaoLoginTest />} />
        <Route path="/demo/TabbedControlTest" element={<TabbedControlTest />} />
        <Route path="/demo/BottomSheetTest" element={<BottomSheetTest />} />
      </Routes>
    </Router>
  );
}
