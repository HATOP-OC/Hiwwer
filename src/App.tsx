import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import MyOrders from "./pages/MyOrders";
import OrderDetail from "./pages/OrderDetail";
import CreateOrder from "./pages/CreateOrder";
import ServiceDetail from "./pages/ServiceDetail";
import MyServices from "./pages/MyServices";
import CreateService from "./pages/CreateService";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";

// Сторінки для клієнтів
import Services from "./pages/Services";
import HowToOrder from "./pages/HowToOrder";
import HowItWorks from "./pages/HowItWorks";
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
import Analytics from "./pages/admin/Analytics";
import Users from "./pages/admin/Users";
import Performers from "./pages/admin/Performers";
import ServicesAdmin from "./pages/admin/Services";
import Orders from "./pages/admin/Orders";
import Security from "./pages/admin/Security";
import AdminSettings from "./pages/admin/Settings";
import Support from "./pages/admin/Support";
import RequireAdmin from '@/components/RequireAdmin';
import Database from './pages/admin/Database';
import Activity from './pages/admin/Activity';

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
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
              <Route path="/my-services" element={<MyServices />} />
              <Route path="/create-service" element={<CreateService />} />
              <Route path="/edit-service/:serviceId" element={<CreateService />} />
              <Route path="/order/:id" element={<OrderDetail />} />
              <Route path="/create-order/:serviceId" element={<CreateOrder />} />
              <Route path="/create-custom-order" element={<CreateOrder />} />
              <Route path="/settings" element={<Settings />} />
              
              {/* Сторінки для клієнтів */}
              <Route path="/services" element={<Services />} />
              <Route path="/services/:serviceId" element={<ServiceDetail />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
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
              <Route path="/admin/analytics" element={
                <RequireAdmin>
                  <Analytics />
                </RequireAdmin>
              } />
              <Route path="/admin/users" element={<RequireAdmin><Users /></RequireAdmin>} />
              <Route path="/admin/performers" element={<RequireAdmin><Performers /></RequireAdmin>} />
              <Route path="/admin/services" element={<RequireAdmin><ServicesAdmin /></RequireAdmin>} />
              <Route path="/admin/orders" element={<RequireAdmin><Orders /></RequireAdmin>} />
              <Route path="/admin/support" element={<RequireAdmin><Support /></RequireAdmin>} />
              <Route path="/admin/security" element={<RequireAdmin><Security /></RequireAdmin>} />
              <Route path="/admin/settings" element={<RequireAdmin><AdminSettings /></RequireAdmin>} />
              <Route path="/admin/database" element={<RequireAdmin><Database /></RequireAdmin>} />
              <Route path="/admin/activity" element={<RequireAdmin><Activity /></RequireAdmin>} />

               {/* Сторінка 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
