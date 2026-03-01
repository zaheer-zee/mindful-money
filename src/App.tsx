import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadingScreen from "./pages/LoadingScreen";
import AuthPage from "./pages/AuthPage";
import OnboardingPage from "./pages/OnboardingPage";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import UploadPage from "./pages/UploadPage";
import InsightsPage from "./pages/InsightsPage";
import CategoriesPage from "./pages/CategoriesPage";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (

  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoadingScreen />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="upload" element={<UploadPage />} />
              <Route path="insights" element={<InsightsPage />} />
              <Route path="budget" element={<DashboardHome />} />
              <Route path="savings" element={<DashboardHome />} />
              <Route path="discipline" element={<DashboardHome />} />
              <Route path="categories" element={<CategoriesPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </AuthProvider>
);

export default App;
