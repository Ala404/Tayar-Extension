import { createRoot } from "react-dom/client";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";
import App from "./App";
import "./index.css";
import "./i18n";

createRoot(document.getElementById("root")!).render(
  <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <App />
    </ThemeProvider>
  </Suspense>
);
