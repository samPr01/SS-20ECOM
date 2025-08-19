import CategoryPage from "@/components/CategoryPage";
import { allProducts } from "@/data/allProducts";

const subcategories = [
  "Office Furniture", "Computer Accessories", "Stationery", "Printers & Scanners", "Storage", 
  "Desk Accessories", "Office Electronics", "Lighting", "Office Supplies", "Conference Room"
];

export default function Office() {
  return (
    <CategoryPage
      title="Office Supplies"
      description="Complete range of office furniture, electronics, and stationery"
      bannerImage="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=400&fit=crop"
      products={allProducts.office}
      subcategories={subcategories}
    />
  );
}
