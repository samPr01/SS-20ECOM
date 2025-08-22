import CategoryPage from "@/components/CategoryPage";
import { allProducts } from "@/data/allProducts";

const subcategories = [
  "Baby Clothing",
  "Boys Clothing",
  "Girls Clothing",
  "Toys & Games",
  "School Supplies",
  "Footwear",
  "Baby Care",
  "Books & Learning",
];

export default function Kids() {
  return (
    <CategoryPage
      title="Kids & Toys"
      description="Everything for your little ones - clothing, toys, and essentials"
      bannerImage="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=400&fit=crop"
      products={allProducts.kids}
      subcategories={subcategories}
    />
  );
}
