import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import WomenEthnic from "./pages/WomenEthnic";
import WomenWestern from "./pages/WomenWestern";
import Men from "./pages/Men";
import Kids from "./pages/Kids";
import HomeKitchen from "./pages/HomeKitchen";
import BeautyHealth from "./pages/BeautyHealth";
import Electronics from "./pages/Electronics";
import JewelleryAccessories from "./pages/JewelleryAccessories";
import BagsFootwear from "./pages/BagsFootwear";
import SportsFitness from "./pages/SportsFitness";
import CarMotorbike from "./pages/CarMotorbike";
import Office from "./pages/Office";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
