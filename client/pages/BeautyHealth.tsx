import CategoryPage from "@/components/CategoryPage";
import { allProducts } from "@/data/allProducts";

const subcategories = [
  "Skincare",
  "Makeup",
  "Hair Care",
  "Fragrances",
  "Personal Care",
  "Beauty Tools",
  "Wellness",
  "Supplements",
  "Oral Care",
];

export default function BeautyHealth() {
  return (
    <CategoryPage
      title="Beauty & Health"
      description="Beauty and wellness products for your daily care routine"
      bannerImage="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&h=400&fit=crop"
      products={allProducts.beauty}
      subcategories={subcategories}
    />
  );
}
