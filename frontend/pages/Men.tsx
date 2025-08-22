import CategoryPage from "@/components/CategoryPage";
import { allProducts } from "@/data/allProducts";

const subcategories = [
  "T-Shirts & Polos",
  "Shirts",
  "Jeans & Trousers",
  "Ethnic Wear",
  "Shorts",
  "Hoodies & Sweatshirts",
  "Blazers & Suits",
  "Sportswear",
];

export default function Men() {
  return (
    <CategoryPage
      title="Men's Fashion"
      description="Stylish and comfortable clothing for men"
      bannerImage="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=400&fit=crop"
      products={allProducts.men}
      subcategories={subcategories}
    />
  );
}
