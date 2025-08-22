import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthProvider } from "./hooks/useAuth";
import { AdminAuthProvider } from "./hooks/useAdminAuth";
import { CartProvider } from "./hooks/useCart.tsx";
import { OrdersProvider } from "./hooks/useOrders.tsx";

// Lazy load components for better performance
const Index = lazy(() => import("./pages/Index"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));

// Category pages - lazy loaded
const WomenEthnic = lazy(() => import("./pages/WomenEthnic"));
const WomenWestern = lazy(() => import("./pages/WomenWestern"));
const Men = lazy(() => import("./pages/Men"));
const Kids = lazy(() => import("./pages/Kids"));
const HomeKitchen = lazy(() => import("./pages/HomeKitchen"));
const BeautyHealth = lazy(() => import("./pages/BeautyHealth"));
const Electronics = lazy(() => import("./pages/Electronics"));
const JewelleryAccessories = lazy(() => import("./pages/JewelleryAccessories"));
const BagsFootwear = lazy(() => import("./pages/BagsFootwear"));
const SportsFitness = lazy(() => import("./pages/SportsFitness"));
const CarMotorbike = lazy(() => import("./pages/CarMotorbike"));
const Office = lazy(() => import("./pages/Office"));

// User management pages - lazy loaded
const SignIn = lazy(() => import("./pages/SignIn"));
const Account = lazy(() => import("./pages/Account"));
const AccountAddresses = lazy(() => import("./pages/AccountAddresses"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Orders = lazy(() => import("./pages/Orders"));

// Admin pages - lazy loaded
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const AdminOrders = lazy(() => import("./pages/AdminOrders"));
const AdminAddresses = lazy(() => import("./pages/AdminAddresses"));
const AdminAnalytics = lazy(() => import("./pages/AdminAnalytics"));
const AdminSettings = lazy(() => import("./pages/AdminSettings"));
const AdminActivityLogs = lazy(() => import("./pages/AdminActivityLogs"));
const AdminUpload = lazy(() => import("./pages/admin/AdminUpload"));

const NotFound = lazy(() => import("./pages/NotFound"));

// Loading component for Suspense
const PageLoader = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AdminAuthProvider>
            <CartProvider>
              <OrdersProvider>
              <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />

          {/* Category Pages */}
          <Route path="/women-ethnic" element={<WomenEthnic />} />
          <Route path="/women-western" element={<WomenWestern />} />
          <Route path="/men" element={<Men />} />
          <Route path="/kids" element={<Kids />} />
          <Route path="/home-kitchen" element={<HomeKitchen />} />
          <Route path="/beauty-health" element={<BeautyHealth />} />
          <Route path="/electronics" element={<Electronics />} />
          <Route path="/jewellery" element={<JewelleryAccessories />} />
          <Route path="/bags" element={<BagsFootwear />} />
          <Route path="/sports" element={<SportsFitness />} />
          <Route path="/automotive" element={<CarMotorbike />} />
          <Route path="/office" element={<Office />} />

                {/* User Management Routes */}
                <Route path="/signin" element={<SignIn />} />
                <Route path="/account" element={<Account />} />
                <Route path="/account/addresses" element={<AccountAddresses />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders" element={<Orders />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/addresses" element={<AdminAddresses />} />
                <Route path="/admin/analytics" element={<AdminAnalytics />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
                <Route path="/admin/activity-logs" element={<AdminActivityLogs />} />
                <Route path="/admin/upload" element={<AdminUpload />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
              </Suspense>
              </OrdersProvider>
            </CartProvider>
          </AdminAuthProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
