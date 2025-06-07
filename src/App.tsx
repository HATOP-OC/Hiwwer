import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import MyOrders from "./pages/MyOrders";
import NotFound from "./pages/NotFound";

// Сторінки для клієнтів
import Services from "./pages/Services";
import HowToOrder from "./pages/HowToOrder";
import ClientFAQ from "./pages/ClientFAQ";

// Сторінки для виконавців
import BecomePerformer from "./pages/BecomePerformer";
import PerformerGuidelines from "./pages/PerformerGuidelines";
import PerformerFAQ from "./pages/PerformerFAQ";

// Юридичні сторінки
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ContactUs from "./pages/ContactUs";

// Адмін-панель
import AdminDashboard from "./pages/admin/AdminDashboard";
import RequireAdmin from '@/components/RequireAdmin';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Основні сторінки */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/my-orders" element={<MyOrders />} />
              
              {/* Сторінки для клієнтів */}
              <Route path="/services" element={<Services />} />
              <Route path="/how-to-order" element={<HowToOrder />} />
              <Route path="/faq/client" element={<ClientFAQ />} />
              
              {/* Сторінки для виконавців */}
              <Route path="/become-performer" element={<BecomePerformer />} />
              <Route path="/performer-guidelines" element={<PerformerGuidelines />} />
              <Route path="/faq/performer" element={<PerformerFAQ />} />
              
              {/* Юридичні сторінки */}
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/contact-us" element={<ContactUs />} />
              
              {/* Адмін-панель */}
              <Route path="/admin" element={
                <RequireAdmin>
                  <AdminDashboard />
                </RequireAdmin>
              } />
              <Route path="/admin/dashboard" element={
                <RequireAdmin>
                  <AdminDashboard />
                </RequireAdmin>
              } />
              
              {/* Сторінка 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
