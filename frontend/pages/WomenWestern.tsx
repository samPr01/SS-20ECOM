import CategoryPage from "@/components/CategoryPage";
import { allProducts } from "@/data/allProducts";

const subcategories = [
  "Dresses",
  "Tops & Tunics",
  "Jeans & Trousers",
  "Skirts",
  "Jumpsuits",
  "Blazers",
  "Shirts",
  "Shorts",
  "Co-ord Sets",
];

export default function WomenWestern() {
  return (
    <CategoryPage
      title="Women Western"
      description="Trendy western wear collection for modern women"
      bannerImage="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&h=400&fit=crop"
      products={allProducts.womenWestern}
      subcategories={subcategories}
    />
  );
}
