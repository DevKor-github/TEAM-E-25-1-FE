// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client"; 
import App from "./App";
import "./index.css";

function startApp() {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// development 환경에서만 MSW 활성화
if (process.env.NODE_ENV === 'development') {
  import('./mocks/browser')
    .then(() => {
      console.log('[MSW] Browser mocks enabled')
      startApp()
    })
    .catch((error) => {
      console.error('[MSW] Failed to enable mocks:', error)
      startApp()
    })
} else {
  startApp()
}
