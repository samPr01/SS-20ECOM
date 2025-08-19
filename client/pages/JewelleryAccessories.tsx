import CategoryPage from "@/components/CategoryPage";
import { allProducts } from "@/data/allProducts";

const subcategories = [
  "Necklaces", "Earrings", "Rings", "Bracelets", "Watches", 
  "Handbags", "Sunglasses", "Hair Accessories", "Bangles", "Men's Jewellery"
];

export default function JewelleryAccessories() {
  return (
    <CategoryPage
      title="Jewellery & Accessories"
      description="Beautiful jewellery and stylish accessories for every occasion"
      bannerImage="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&h=400&fit=crop"
      products={allProducts.jewellery}
      subcategories={subcategories}
    />
  );
}
