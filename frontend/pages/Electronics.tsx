import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNavigation from "@/components/BottomNavigation";
import ProductGrid from "@/components/ProductGrid";

export default function Electronics() {
  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Header />

      <main className="mt-6 md:mt-8">
        <ProductGrid 
      title="Electronics"
          category="electronics"
          showPagination={true} 
          productsPerPage={20}
        />
      </main>

      {/* Footer - Desktop Only */}
      <div className="hidden md:block">
        <Footer />
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <BottomNavigation />
    </div>
  );
}
