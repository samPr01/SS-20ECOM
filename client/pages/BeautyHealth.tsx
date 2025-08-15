import CategoryPage from "@/components/CategoryPage";

const beautyHealthProducts = [
  {
    id: 601,
    name: "Organic Face Cream",
    price: 899,
    originalPrice: 1399,
    image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=300&h=300&fit=crop",
    rating: 4.5,
    reviews: 267,
    brand: "Natural Glow"
  },
  {
    id: 602,
    name: "Vitamin C Serum",
    price: 1299,
    originalPrice: 2199,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop",
    rating: 4.6,
    reviews: 189,
    brand: "Skin Care Pro"
  },
  {
    id: 603,
    name: "Makeup Brush Set",
    price: 1599,
    originalPrice: 2799,
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&h=300&fit=crop",
    rating: 4.4,
    reviews: 156,
    brand: "Beauty Tools"
  },
  {
    id: 604,
    name: "Hair Care Oil",
    price: 699,
    originalPrice: 1199,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop",
    rating: 4.3,
    reviews: 234,
    brand: "Hair Essentials"
  },
  {
    id: 605,
    name: "Lipstick Set",
    price: 1199,
    originalPrice: 1999,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop&q=80",
    rating: 4.2,
    reviews: 178,
    brand: "Color Pop"
  },
  {
    id: 606,
    name: "Face Mask Pack",
    price: 799,
    originalPrice: 1399,
    image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=300&h=300&fit=crop&q=80",
    rating: 4.5,
    reviews: 145,
    brand: "Spa Collection"
  },
  {
    id: 607,
    name: "Hair Straightener",
    price: 2499,
    originalPrice: 3999,
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&h=300&fit=crop&q=80",
    rating: 4.4,
    reviews: 123,
    brand: "Style Pro"
  },
  {
    id: 608,
    name: "Perfume Gift Set",
    price: 1899,
    originalPrice: 3199,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop&q=60",
    rating: 4.6,
    reviews: 198,
    brand: "Fragrance House"
  },
  {
    id: 609,
    name: "Body Lotion Set",
    price: 999,
    originalPrice: 1699,
    image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=300&h=300&fit=crop&q=60",
    rating: 4.3,
    reviews: 167,
    brand: "Body Care"
  },
  {
    id: 610,
    name: "Eye Shadow Palette",
    price: 1399,
    originalPrice: 2399,
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&h=300&fit=crop&q=70",
    rating: 4.5,
    reviews: 134,
    brand: "Glamour Collection"
  }
];

const subcategories = [
  "Skincare", "Makeup", "Hair Care", "Fragrances", "Personal Care", 
  "Beauty Tools", "Wellness", "Supplements", "Oral Care"
];

export default function BeautyHealth() {
  return (
    <CategoryPage
      title="Beauty & Health"
      description="Beauty and wellness products for your daily care routine"
      bannerImage="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&h=400&fit=crop"
      products={beautyHealthProducts}
      subcategories={subcategories}
    />
  );
}
