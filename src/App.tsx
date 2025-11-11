import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Home from "./pages/home";
import Filmes from "./pages/filmes";
import Series from "./pages/series";
import Animes from "./pages/animes";
import MovieDetails from "./pages/movie-details";
import NotFound from "./pages/NotFound";
import { InstallPWA } from "./components/install-pwa";
import { OfflineIndicator } from "./components/offline-indicator";
import { registerServiceWorker } from "./utils/pwa";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Registrar Service Worker
    registerServiceWorker();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <InstallPWA />
        <OfflineIndicator />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/home" element={<Home />} />
            <Route path="/filmes" element={<Filmes />} />
            <Route path="/series" element={<Series />} />
            <Route path="/animes" element={<Animes />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;