import CategoryPage from "@/components/CategoryPage";
import { allProducts } from "@/data/allProducts";

const subcategories = [
  "Gym Equipment",
  "Yoga & Fitness",
  "Cricket",
  "Football",
  "Badminton",
  "Swimming",
  "Running",
  "Cycling",
  "Outdoor Sports",
  "Fitness Accessories",
];

export default function SportsFitness() {
  return (
    <CategoryPage
      title="Sports & Fitness"
      description="Everything you need to stay active and healthy"
      bannerImage="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=400&fit=crop"
      products={allProducts.sports}
      subcategories={subcategories}
    />
  );
}
