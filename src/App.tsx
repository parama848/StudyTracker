import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import DailyTracker from "./pages/DailyTracker";
import DSATracker from "./pages/DSATracker";
import OracleTracker from "./pages/OracleTracker";
import JapaneseTracker from "./pages/JapaneseTracker";
import CommunicationTracker from "./pages/CommunicationTracker";
import WeeklyReview from "./pages/WeeklyReview";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/daily" element={<DailyTracker />} />
          <Route path="/dsa" element={<DSATracker />} />
          <Route path="/oracle" element={<OracleTracker />} />
          <Route path="/japanese" element={<JapaneseTracker />} />
          <Route path="/communication" element={<CommunicationTracker />} />
          <Route path="/weekly-review" element={<WeeklyReview />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
