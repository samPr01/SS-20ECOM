import CategoryPage from "@/components/CategoryPage";
import { allProducts } from "@/data/allProducts";

const subcategories = [
  "Car Electronics", "Car Accessories", "Motorcycle Gear", "Safety Equipment", "Car Care", 
  "Bike Accessories", "Car Audio", "Navigation", "Tools & Equipment", "Car Covers"
];

export default function CarMotorbike() {
  return (
    <CategoryPage
      title="Car & Motorbike"
      description="Essential accessories and equipment for your vehicles"
      bannerImage="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&h=400&fit=crop"
      products={allProducts.automotive}
      subcategories={subcategories}
    />
  );
}
