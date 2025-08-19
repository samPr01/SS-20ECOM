import CategoryPage from "@/components/CategoryPage";
import { allProducts } from "@/data/allProducts";

const subcategories = [
  "Running Shoes", "Casual Shoes", "Formal Shoes", "Sandals", "Handbags", 
  "Backpacks", "Wallets", "Travel Bags", "Sports Shoes", "Office Bags"
];

export default function BagsFootwear() {
  return (
    <CategoryPage
      title="Bags & Footwear"
      description="Stylish bags and comfortable footwear for every lifestyle"
      bannerImage="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&h=400&fit=crop"
      products={allProducts.bags}
      subcategories={subcategories}
    />
  );
}
