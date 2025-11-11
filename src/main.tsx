import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";

// Aplicar tema inicial antes de renderizar
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  document.documentElement.classList.add(savedTheme);
} else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  document.documentElement.classList.add("dark");
  localStorage.setItem("theme", "dark");
} else {
  document.documentElement.classList.add("light");
  localStorage.setItem("theme", "light");
}

createRoot(document.getElementById("root")!).render(<App />);