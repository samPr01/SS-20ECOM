import CategoryPage from "@/components/CategoryPage";
import { allProducts } from "@/data/allProducts";

const subcategories = [
  "Cookware", "Home Decor", "Storage", "Lighting", "Bedding", 
  "Kitchen Appliances", "Dining", "Furniture", "Cleaning Supplies"
];

export default function HomeKitchen() {
  return (
    <CategoryPage
      title="Home & Kitchen"
      description="Everything you need to make your house a home"
      bannerImage="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=400&fit=crop"
      products={allProducts.homeKitchen}
      subcategories={subcategories}
    />
  );
}
