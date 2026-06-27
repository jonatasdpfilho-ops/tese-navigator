import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "./pages/Home";
import HomeEn from "./pages/HomeEn";
import IsencaoIR from "./pages/services/IsencaoIR";
import ConversaoRMC from "./pages/services/ConversaoRMC";
import ConversaoRCC from "./pages/services/ConversaoRCC";
import BlogList from "./pages/blog/BlogList";
import BlogPost from "./pages/blog/BlogPost";
import Admin from "./pages/admin/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/en" element={<HomeEn />} />
          <Route path="/servicos/isencao-ir-doenca-grave" element={<IsencaoIR />} />
          <Route path="/servicos/conversao-rmc-consignado" element={<ConversaoRMC />} />
          <Route path="/servicos/conversao-rcc-consignado" element={<ConversaoRCC />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
