import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import EMIPage from "./pages/EMI";
import { NavBar } from "@/components/NavBar";
import HomesPage from "./pages/Homes";
import ComparePage from "./pages/Compare";
import { CompareProvider } from "@/context/CompareContext";
import { AIChat } from "@/components/AIChat";
import { HistoryPanel } from "@/components/HistoryPanel";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ErrorBoundary>
        <HashRouter>
          <CompareProvider>
            <NavBar />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/homes" element={<HomesPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/emi" element={<EMIPage />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <AIChat />
            <HistoryPanel />
          </CompareProvider>
        </HashRouter>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
