import CategoryPage from "@/components/CategoryPage";
import { allProducts } from "@/data/allProducts";

const subcategories = [
  "Sarees",
  "Kurtis & Suits",
  "Lehengas",
  "Anarkali Dresses",
  "Palazzo Sets",
  "Sharara Sets",
  "Dupatta Sets",
  "Ethnic Gowns",
];

export default function WomenEthnic() {
  return (
    <CategoryPage
      title="Women Ethnic"
      description="Discover beautiful traditional and ethnic wear for women"
      bannerImage="https://images.unsplash.com/photo-1583391733956-6c78276477e1?w=1200&h=400&fit=crop"
      products={allProducts.womenEthnic}
      subcategories={subcategories}
    />
  );
}
