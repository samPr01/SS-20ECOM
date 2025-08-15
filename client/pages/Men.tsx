import CategoryPage from "@/components/CategoryPage";

const menProducts = [
  {
    id: 301,
    name: "Cotton Casual T-Shirt",
    price: 599,
    originalPrice: 999,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop",
    rating: 4.2,
    reviews: 245,
    brand: "Urban Basics"
  },
  {
    id: 302,
    name: "Formal Dress Shirt",
    price: 1299,
    originalPrice: 2199,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    rating: 4.5,
    reviews: 189,
    brand: "Professional"
  },
  {
    id: 303,
    name: "Slim Fit Jeans",
    price: 1899,
    originalPrice: 3299,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop",
    rating: 4.4,
    reviews: 167,
    brand: "Denim Studio"
  },
  {
    id: 304,
    name: "Polo Shirt",
    price: 899,
    originalPrice: 1599,
    image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=300&h=300&fit=crop",
    rating: 4.3,
    reviews: 134,
    brand: "Sport Classic"
  },
  {
    id: 305,
    name: "Chinos Trousers",
    price: 1599,
    originalPrice: 2799,
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=300&h=300&fit=crop",
    rating: 4.4,
    reviews: 156,
    brand: "Casual Wear"
  },
  {
    id: 306,
    name: "Hoodie Sweatshirt",
    price: 1799,
    originalPrice: 2999,
    image: "https://images.unsplash.com/photo-1556821840-3a9fbc86339e?w=300&h=300&fit=crop",
    rating: 4.6,
    reviews: 198,
    brand: "Street Style"
  },
  {
    id: 307,
    name: "Ethnic Kurta",
    price: 1499,
    originalPrice: 2699,
    image: "https://images.unsplash.com/photo-1622470952873-7d7b89b3030c?w=300&h=300&fit=crop",
    rating: 4.5,
    reviews: 123,
    brand: "Traditional"
  },
  {
    id: 308,
    name: "Cargo Shorts",
    price: 999,
    originalPrice: 1799,
    image: "https://images.unsplash.com/photo-1506629905057-c4e3d5b3e4d9?w=300&h=300&fit=crop",
    rating: 4.2,
    reviews: 145,
    brand: "Summer Collection"
  },
  {
    id: 309,
    name: "Blazer Jacket",
    price: 3499,
    originalPrice: 5999,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&h=300&fit=crop",
    rating: 4.7,
    reviews: 178,
    brand: "Formal Wear"
  },
  {
    id: 310,
    name: "Track Suit Set",
    price: 2299,
    originalPrice: 3999,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop",
    rating: 4.3,
    reviews: 167,
    brand: "Athletic Wear"
  }
];

const subcategories = [
  "T-Shirts & Polos", "Shirts", "Jeans & Trousers", "Ethnic Wear", 
  "Shorts", "Hoodies & Sweatshirts", "Blazers & Suits", "Sportswear"
];

export default function Men() {
  return (
    <CategoryPage
      title="Men's Fashion"
      description="Stylish and comfortable clothing for men"
      bannerImage="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=400&fit=crop"
      products={menProducts}
      subcategories={subcategories}
    />
  );
}
