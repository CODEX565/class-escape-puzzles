import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import WordleGamePage from "./pages/WordleGamePage";
import FlagGuesserGamePage from "./pages/FlagGuesserGamePage";
import BrainChallengesGamePage from "./pages/BrainChallengesGamePage";
import FoodQuizGamePage from "./pages/FoodQuizGamePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/games/wordle" element={<WordleGamePage />} />
            <Route path="/games/flag-guesser" element={<FlagGuesserGamePage />} />
            <Route path="/games/brain-challenges" element={<BrainChallengesGamePage />} />
            <Route path="/games/food-quiz" element={<FoodQuizGamePage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
