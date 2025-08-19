import CategoryPage from "@/components/CategoryPage";
import { allProducts } from "@/data/allProducts";

const subcategories = [
  "Mobile Accessories", "Audio & Headphones", "Computers & Laptops", "Smart Watches", 
  "Gaming", "Cameras", "Home Electronics", "Cables & Chargers", "Storage Devices"
];

export default function Electronics() {
  return (
    <CategoryPage
      title="Electronics"
      description="Latest gadgets and electronic accessories"
      bannerImage="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&h=400&fit=crop"
      products={allProducts.electronics}
      subcategories={subcategories}
    />
  );
}
